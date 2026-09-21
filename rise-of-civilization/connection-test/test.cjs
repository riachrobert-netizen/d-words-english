'use strict';
const {test}=require('node:test');const assert=require('node:assert/strict');
const {WebSocket}=require('ws');const {createProbeServer,VERSION}=require('./server.cjs');
test('Two-player room relay, isolation, capacity, disconnect cleanup and origin validation',async()=>{
  const app=createProbeServer();await new Promise(r=>app.server.listen(0,'127.0.0.1',r));
  const root='http://127.0.0.1:'+app.server.address().port;
  function client(origin='http://localhost:3000'){
    const ws=new WebSocket(root.replace('http:','ws:')+'/ws',{origin});const messages=[];const waiting=[];
    ws.on('message',raw=>{const m=JSON.parse(raw);const i=waiting.findIndex(w=>w.type===m.type);if(i>=0){const w=waiting.splice(i,1)[0];clearTimeout(w.timer);w.resolve(m)}else messages.push(m)});
    ws.on('error',()=>{});
    return{ws,send:m=>ws.send(JSON.stringify(m)),next(type){const i=messages.findIndex(m=>m.type===type);if(i>=0)return Promise.resolve(messages.splice(i,1)[0]);return new Promise((resolve,reject)=>{const w={type,resolve,timer:setTimeout(()=>reject(Error('Timeout waiting for '+type)),1500)};waiting.push(w)})}};
  }
  try{
    assert.equal((await(await fetch(root+'/health')).json()).service,VERSION);
    assert((await(await fetch(root)).text()).includes('Can our worlds connect?'));
    const a=client(),b=client(),c=client();for(const x of [a,b,c])assert.equal((await x.next('hello')).service,VERSION);
    a.send({type:'create'});const code=(await a.next('room')).code;assert.match(code,/^[A-Z2-9]{6}$/);
    b.send({type:'join',code});assert.equal((await b.next('room')).players,2);assert.equal((await a.next('room')).players,2);
    c.send({type:'join',code});assert.match((await c.next('error')).message,/two players/);
    a.send({type:'probe',id:1});assert.deepEqual(await b.next('probe'),{type:'probe',id:1});b.send({type:'ack',id:1});assert.deepEqual(await a.next('ack'),{type:'ack',id:1});
    c.send({type:'signal'});assert.match((await c.next('error')).message,/Both players/);
    c.send({type:'join',code:'AAAAAA'});assert.match((await c.next('error')).message,/not found/);
    a.send({type:'ping',id:2});assert.equal((await a.next('pong')).id,2);
    b.ws.close();assert.equal((await a.next('room')).players,1);
    c.send({type:'join',code});assert.equal((await c.next('room')).players,2);await a.next('room');
    a.send({type:'leave'});await a.next('left');assert.equal((await c.next('room')).players,1);
    c.send({type:'leave'});await c.next('left');assert.equal(app.rooms.size,0);
    a.ws.send('bad json');assert.match((await a.next('error')).message,/Invalid/);
    const denied=client('https://unrelated.example');await new Promise((resolve,reject)=>{denied.ws.on('unexpected-response',(_,r)=>{assert.equal(r.statusCode,403);denied.ws.terminate();resolve()});denied.ws.on('open',()=>reject(Error('Unexpected origin accepted'))) });
  }finally{await app.close()}
});
