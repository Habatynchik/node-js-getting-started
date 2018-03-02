var firebase = require('./firebasecontroller');
var week = require('./week');

const TeleBot = require('telebot');
const bot = new TeleBot({
    token: '530442712:AAFEOdLBBNi7ryGCqxTwxV6pqaO02JFF9SQ'
});

bot.on('text', function (msg) {
    console.log(`[text] ${ msg.chat.id } ${ msg.text }`);
});

bot.on(['/start'], msg => {
    let replyMarkup = bot.keyboard([
        ['/schedule'],
        ['/my_group', '/about']
    ], {resize: true});

    let text =
        "✅                    Welcome                    ✅\n" +
        "To view the schedule, please register\n" +
        "Command for entering group:\n" +
        "/set <your group number>\n";

    return bot.sendMessage(msg.from.id, text, {replyMarkup});
});

bot.on([/(⬅️\s)?Назад*/], msg => {
    let replyMarkup = bot.keyboard([
        ['/schedule'],
        ['/group', '/about']
    ], {resize: true});

    return bot.sendMessage(msg.from.id, 'Головне меню', {replyMarkup});
});

bot.on('/schedule', msg => {
    let replyMarkup = bot.keyboard([
        ['/today', '/tomorrow'],
        ['/all_week', '⬅️ Назад']
    ], {resize: true});

    return bot.sendMessage(msg.from.id, 'Your schedule', {replyMarkup});
});


bot.on('/group', msg => {
    let group = firebase.getGroup(msg.from.id);
    let s = "Your group number: " + group + "\n" +
        "\n" +
        "Full list of allowed characters:\n" +
        "Numbers: 0-9\n" +
        "Command for entering group:\n" +
        "/set <your group number>\n";

    return bot.sendMessage(msg.from.id, s);

});

bot.on('/today', msg => {
    let day = new Date();
    let s = "Today schedule: \n";
    let w, curentDay = day.getDay();
    if (week.getWeek(day) % 2 == 0) w = 1; else w = 2;
    if (curentDay >= 5)
        if (w == 1) w = 2; else w = 1;
    let schedule = firebase.getToday(curentDay, firebase.getGroup(msg.from.id), w);
    return bot.sendMessage(msg.from.id, s + schedule);
});

bot.on('/all_week', msg => {
    let day = new Date();
    let s = "Week schedule: \n";
    let w, curentDay = day.getDay();
    if (week.getWeek(day) % 2 == 0) w = 1; else w = 2;
    if (curentDay >= 5)
        if (w == 1) w = 2; else w = 1;
    let schedule = firebase.getWeek(firebase.getGroup(msg.from.id), w);
    return bot.sendMessage(msg.from.id, s + schedule);
});

bot.on('/about', msg => {

    let text =
        "Version 0.2.2\n" +
        "Dev by students from KISIT\n" +
        "❤️❤️❤️:\n" ;
    return bot.sendMessage(msg.from.id, text);
});

bot.on('/tomorrow', msg => {
    let day = new Date();
    let s = "Tomorrow schedule: \n";
    let w;
    if (week.getWeek(day) % 2 == 0) w = 1; else w = 2;
    let schedule = firebase.getToday(day.getDay() + 1, firebase.getGroup(msg.from.id), w);
    return bot.sendMessage(msg.from.id, s + schedule);
});


bot.on(/^\/set (.+)$/, (msg, props) => {
    const group = props.match[1];

    firebase.writeUser(msg.from.id, group);
    return bot.sendMessage(msg.from.id, `Ваша группа: ${group}`);
});


bot.start();