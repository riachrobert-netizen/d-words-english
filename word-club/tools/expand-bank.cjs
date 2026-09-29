// Run from the repository root: node word-club/tools/expand-bank.cjs
// Keeps the original A+B bank for older saved results, while publishing one letter per category.
const fs = require('fs');
const vm = require('vm');
const path = require('path');
const bankPath = path.join(__dirname, '../assets/words.js');
const context = {window: {}};
vm.runInNewContext(fs.readFileSync(bankPath, 'utf8'), context);
const bank = JSON.parse(JSON.stringify(context.window.WORD_CLUB_BANK));

// English word, Chinese meaning, original example, translation, tested form.
// C examples follow the teacher's "c words sentences only input.docx".
const cWords = [
  ['call','打电话','Please call your mom.','请给妈妈打电话。'],
  ['came','来了（come 的过去式）','He came to my house.','他来过我家。'],
  ['can','能够','I can swim.','我会游泳。'],
  ['car','汽车','She drives a red car.','她开一辆红色汽车。'],
  ['care','关心','I care about my friends.','我关心我的朋友。'],
  ['carefully','小心地','He walks carefully on the ice.','他小心地在冰上走。'],
  ['carry','搬；拿','Please carry this box.','请搬这个箱子。'],
  ['centre','中心','The table is in the centre of the room.','桌子在房间的中央。'],
  ['certain','确定的','I am certain she will come.','我确定她会来。'],
  ['change','换；改变','I will change my clothes.','我要换衣服。'],
  ['check','检查','Please check your homework.','请检查你的作业。'],
  ['child','孩子（单数）','The child is playing.','这个孩子正在玩。'],
  ['children','孩子们（复数）','The children are happy.','孩子们很开心。'],
  ['city','城市','I live in a city.','我住在一座城市里。'],
  ['class','班级；课程','Our class starts at 8 AM.','我们的课早上八点开始。'],
  ['clear','晴朗的；清楚的','The sky is clear today.','今天天空很晴朗。'],
  ['close','关上','Please close the door.','请把门关上。'],
  ['cold','冷的','The water is cold.','水很冷。'],
  ['colour','颜色','The sky is blue in colour.','天空的颜色是蓝色的。'],
  ['come','来','Please come to my house.','请来我家。'],
  ['common','常见的','Apples are a common fruit.','苹果是一种常见的水果。'],
  ['community','社区','Our community is very friendly.','我们的社区很友好。'],
  ['complete','完成','I will complete my work.','我要完成我的工作。'],
  ['contain','包含','This box contains toys.','这个箱子里装着玩具。','contains'],
  ['could','能；可以（礼貌请求）','Could you help me?','你能帮帮我吗？','Could'],
  ['country','国家','China is a big country.','中国是一个大国。'],
  ['course','课程','The math course is hard.','数学课很难。'],
  ['create','创造','She likes to create art.','她喜欢创作艺术作品。'],
  ['cried','哭了（cry 的过去式）','The baby cried loudly.','宝宝大声哭了。'],
  ['cross','穿过','Let\'s cross the road.','我们过马路吧。'],
  ['cry','哭','I heard the baby cry.','我听到宝宝哭了。'],
  ['cut','剪；切','Please cut the paper.','请剪这张纸。']
];

// Editable starter vocabulary for E. Replace these entries with the taught E list when available.
const eWords = [
  ['each','每一个','Each child has a book.','每个孩子都有一本书。'],
  ['ear','耳朵','I can hear with my ears.','我可以用耳朵听。','ears'],
  ['early','早的；提早','We arrived early today.','我们今天到得很早。'],
  ['earth','地球','We live on Earth.','我们生活在地球上。','Earth'],
  ['east','东方','The sun rises in the east.','太阳从东方升起。'],
  ['easy','容易的','This question is easy.','这道题很容易。'],
  ['eat','吃','I eat breakfast every morning.','我每天早上吃早餐。'],
  ['egg','鸡蛋','There is an egg on my plate.','我的盘子里有一个鸡蛋。'],
  ['eight','八','I have eight pencils.','我有八支铅笔。'],
  ['elephant','大象','The elephant has a long trunk.','大象有一条长鼻子。'],
  ['else','其他；另外','What else do you need?','你还需要什么？'],
  ['end','结束；末尾','The story has a happy end.','这个故事有一个快乐的结局。'],
  ['enjoy','喜欢；享受','I enjoy reading books.','我喜欢读书。'],
  ['enough','足够的','We have enough water.','我们有足够的水。'],
  ['enter','进入','Please enter the classroom.','请走进教室。'],
  ['even','甚至','Even my little brother can do it.','甚至我的弟弟也能做到。','Even'],
  ['evening','傍晚；晚上','We eat dinner in the evening.','我们在晚上吃晚饭。'],
  ['every','每个','I read every day.','我每天读书。'],
  ['example','例子','Can you give me an example?','你能给我举个例子吗？'],
  ['excited','兴奋的','She is excited about the trip.','她对旅行感到兴奋。']
];

function makeCategory(id, words, roundSize = 8) {
  const entries = words.map(w => [w[0], w[1], w[2], w[3], w[4] || w[0]]);
  const rounds = [];
  for (let start = 0; start < entries.length; start += roundSize) {
    const subset = entries.slice(start, start + roundSize);
    const ri = rounds.length;
    const questions = [];
    subset.forEach((w, wi) => {
      const [word, meaning, sentence, translation, form] = w;
      const note = `${word} = ${meaning}`;
      const base = `${id}r${ri}w${wi}`;
      questions.push({id: base + 's', type: 'spell', word, meaning, answer: word, note});
      questions.push({id: base + 't', type: 'tiles', word, sentence, translation, answer: sentence, note, choices: [], alternatives: []});
      if (sentence.includes(form)) questions.push({id: base + 'b', type: 'blank', word, sentence, translation, answer: form, note, choices: [form], alternatives: []});
      const others = [...new Set(entries.map(x => x[1]).filter(x => x !== meaning))];
      questions.push({id: base + 'c', type: 'choice', word, sentence, translation, answer: meaning, choices: [meaning, others[(start + wi * 3 + 7) % others.length], others[(start + wi * 3 + 16) % others.length]], note});
    });
    const pairs = subset.slice(0, 5).map(w => [w[0], w[1]]);
    questions.push({id: `${id}r${ri}m`, type: 'match', pairs, note: 'All the pairs are connected! 五组词语配对完成！'});
    const subject = subset.find(w => /^(Please|Can|Could|What|I |We |She |He )/.test(w[2])) || subset[0];
    questions.push({id: `${id}r${ri}h`, type: 'chat', prompt: `Which sentence uses “${subject[0]}” correctly?`, choices: [subject[2], ...subset.filter(w => w !== subject).slice(0, 2).map(w => w[2])], answer: subject[2], note: `${subject[0]} = ${subject[1]}`});
    rounds.push({words: subset, questions});
  }
  return {id, label: id.toUpperCase(), words: entries, rounds};
}

bank.a = makeCategory('a', bank.ab.words.filter(w => w[0].toLowerCase().startsWith('a')));
bank.b = makeCategory('b', bank.ab.words.filter(w => w[0].toLowerCase().startsWith('b')));
bank.c = makeCategory('c', cWords);
bank.e = makeCategory('e', eWords);
const ordered = {a: bank.a, b: bank.b, c: bank.c, d: bank.d, e: bank.e, ab: bank.ab};
ordered.ab.hidden = true;
fs.writeFileSync(bankPath, 'window.WORD_CLUB_BANK = ' + JSON.stringify(ordered, null, 2) + ';\n');
console.log(Object.fromEntries(Object.entries(ordered).map(([id, c]) => [id, `${c.words.length} words, ${c.rounds.length} rounds`])));
