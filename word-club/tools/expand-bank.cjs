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

// E and F from the teacher's "Basic sentences using the most common English words starting with E + F.docx".
const eWords = [
  ['each','每一个','Each student has a book.','每个学生都有一本书。','Each'],
  ['early','早地','We woke up early today.','我们今天起得很早。'],
  ['earth','地球','The Earth is round.','地球是圆的。','Earth'],
  ['east','东方','The sun rises in the east.','太阳从东方升起。'],
  ['easy','容易的','This test is easy.','这次测验很容易。'],
  ['eat','吃','I like to eat apples.','我喜欢吃苹果。'],
  ['effort','努力','She made a big effort to win.','她为了获胜付出了很大努力。'],
  ['enough','足够的','We have enough food.','我们有足够的食物。'],
  ['every','每一个','Every child has a toy.','每个孩子都有一个玩具。','Every'],
  ['example','例子','This is an example of a good sentence.','这是一个好句子的例子。'],
  ['experience','经历；体验','I had a fun experience at the zoo.','我在动物园有一次有趣的体验。'],
  ['explain','解释','Please explain the answer to me.','请向我解释答案。'],
  ['eye','眼睛','I have two eyes.','我有两只眼睛。','eyes']
];

const fWords = [
  ['face','脸','She has a smile on her face.','她脸上带着微笑。'],
  ['fact','事实','It is a fact that the sky is blue.','天空是蓝色的，这是事实。'],
  ['false','错误的','His answer was false.','他的答案是错误的。'],
  ['family','家庭；家人','I love my family.','我爱我的家人。'],
  ['far','远的','My school is far from my house.','我的学校离家很远。'],
  ['farm','农场','There are many animals on the farm.','农场里有许多动物。'],
  ['fast','快的','The car is very fast.','这辆车开得很快。'],
  ['father','父亲','My father is kind.','我的父亲很和善。'],
  ['feel','感觉','I feel happy today.','我今天感觉很开心。'],
  ['feet','脚（复数）','I have two feet.','我有两只脚。'],
  ['few','少数；几个','I have a few candies left.','我还剩几颗糖。'],
  ['field','田地；场地','The cows are in the field.','奶牛在田野里。'],
  ['find','找到','I can find my book.','我能找到我的书。'],
  ['fire','火','The fire is hot.','火很热。'],
  ['first','第一','She won first place.','她赢得了第一名。'],
  ['fish','鱼','The fish is swimming.','鱼正在游泳。'],
  ['five','五','I have five apples.','我有五个苹果。'],
  ['fly','飞','Birds fly in the sky.','鸟儿在天空中飞翔。'],
  ['follow','跟随','Please follow me.','请跟着我。'],
  ['food','食物','I like to eat food.','我喜欢吃食物。'],
  ['form','形成','Ice can form from water.','水可以形成冰。'],
  ['found','找到了（find 的过去式）','I found my lost toy.','我找到了丢失的玩具。'],
  ['four','四','I have four books.','我有四本书。'],
  ['friend','朋友','My friend is very nice.','我的朋友很友好。'],
  ['from','来自','I am from Canada.','我来自加拿大。'],
  ['front','前面','The dog is in the front of the house.','狗在房子的前部。'],
  ['full','满的','My cup is full of water.','我的杯子装满了水。']
];

const alternateExamples = {
  e: {earth: [['泥土','Plants grow in the earth.','植物生长在泥土里。','earth']]},
  f: {
    face: [['面向','Please face the board.','请面向黑板。','face']],
    fly: [['苍蝇','There is a fly on the table.','桌上有一只苍蝇。','fly']],
    form: [['表格','Please fill out this form.','请填写这张表格。','form']]
  }
};

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
      const base = `${id === 'e' ? 'e2' : id}r${ri}w${wi}`;
      questions.push({id: base + 's', type: 'spell', word, meaning, answer: word, note});
      questions.push({id: base + 't', type: 'tiles', word, sentence, translation, answer: sentence, note, choices: [], alternatives: []});
      if (sentence.includes(form)) questions.push({id: base + 'b', type: 'blank', word, sentence, translation, answer: form, note, choices: [form], alternatives: []});
      const others = [...new Set(entries.map(x => x[1]).filter(x => x !== meaning))];
      questions.push({id: base + 'c', type: 'choice', word, sentence, translation, answer: meaning, choices: [meaning, others[(start + wi * 3 + 7) % others.length], others[(start + wi * 3 + 16) % others.length]], note});
      for (const [ai, [otherMeaning, otherSentence, otherTranslation, otherForm]] of (alternateExamples[id]?.[word] || []).entries()) {
        const variant = base + 'v' + ai;
        questions.push({id: variant + 't', type: 'tiles', word, sentence: otherSentence, translation: otherTranslation, answer: otherSentence, note: `${word} = ${otherMeaning}`, choices: [], alternatives: []});
        questions.push({id: variant + 'b', type: 'blank', word, sentence: otherSentence, translation: otherTranslation, answer: otherForm, note: `${word} = ${otherMeaning}`, choices: [otherForm], alternatives: []});
        questions.push({id: variant + 'c', type: 'choice', word, sentence: otherSentence, translation: otherTranslation, answer: otherMeaning, choices: [otherMeaning, meaning, others[(start + wi * 3 + 7) % others.length]], note: `${word} = ${otherMeaning}`});
      }
    });
    const pairs = subset.slice(0, 5).map(w => [w[0], w[1]]);
    questions.push({id: `${id === 'e' ? 'e2' : id}r${ri}m`, type: 'match', pairs, note: 'All the pairs are connected! 五组词语配对完成！'});
    const subject = subset.find(w => /^(Please|Can|Could|What|I |We |She |He )/.test(w[2])) || subset[0];
    questions.push({id: `${id === 'e' ? 'e2' : id}r${ri}h`, type: 'chat', prompt: `Which sentence uses “${subject[0]}” correctly?`, choices: [subject[2], ...subset.filter(w => w !== subject).slice(0, 2).map(w => w[2])], answer: subject[2], note: `${subject[0]} = ${subject[1]}`});
    rounds.push({words: subset, questions});
  }
  return {id, label: id.toUpperCase(), words: entries, rounds};
}

bank.a = makeCategory('a', bank.ab.words.filter(w => w[0].toLowerCase().startsWith('a')));
bank.b = makeCategory('b', bank.ab.words.filter(w => w[0].toLowerCase().startsWith('b')));
bank.c = makeCategory('c', cWords);
bank.e = makeCategory('e', eWords);
bank.f = makeCategory('f', fWords);
const ordered = {a: bank.a, b: bank.b, c: bank.c, d: bank.d, e: bank.e, f: bank.f, ab: bank.ab};
ordered.ab.hidden = true;
fs.writeFileSync(bankPath, 'window.WORD_CLUB_BANK = ' + JSON.stringify(ordered, null, 2) + ';\n');
console.log(Object.fromEntries(Object.entries(ordered).map(([id, c]) => [id, `${c.words.length} words, ${c.rounds.length} rounds`])));
