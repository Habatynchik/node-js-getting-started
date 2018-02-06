var firebase = require('./firebasecontroller');

const TeleBot = require('telebot');
const bot = new TeleBot({
    token: '530442712:AAFEOdLBBNi7ryGCqxTwxV6pqaO02JFF9SQ'
});

bot.on('text', function (msg) {
    console.log(`[text] ${ msg.chat.id } ${ msg.text } ${msg.from.first_name}`);
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

bot.on(['/back'], msg => {
    let replyMarkup = bot.keyboard([
        ['/schedule'],
        ['/group', '/about']
    ], {resize: true});

    return bot.sendMessage(msg.from.id, 'Головне меню', {replyMarkup});
});

bot.on('/schedule', msg => {
    let replyMarkup = bot.keyboard([
        ['/today', '/tomorrow'],
        ['/all_week', '/back']
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

    let schedule = firebase.getToday(day.getDay(), firebase.getGroup(msg.from.id));
    return bot.sendMessage(msg.from.id, s + schedule);
});

bot.on('/tomorrow', msg => {
    let day = new Date();
    let s = "Tomorrow schedule: \n";

    let schedule = firebase.getToday(day.getDay() + 1, firebase.getGroup(msg.from.id));
    return bot.sendMessage(msg.from.id, s + schedule);
});


bot.on(/^\/set (.+)$/, (msg, props) => {
    const group = props.match[1];

    firebase.writeUser(msg.from.id, group);
    return bot.sendMessage(msg.from.id, `Ваша группа: ${group}`);
});


bot.start();