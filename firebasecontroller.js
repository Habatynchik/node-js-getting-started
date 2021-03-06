var firebase = require("firebase");
var config = {
    apiKey: "AIzaSyBNIJ_e2Fj9qnqU0G6xXwa3jEaCJeaQj0A",
    authDomain: "telegrambot-959bc.firebaseapp.com",
    databaseURL: "https://telegrambot-959bc.firebaseio.com",
    projectId: "telegrambot-959bc",
    storageBucket: "telegrambot-959bc.appspot.com",
    messagingSenderId: "920940172779"
};
firebase.initializeApp(config);

var database = firebase.database();

exports.writeUser = function (id, group) {
    database.ref('users/' + id).set({
        id: id,
        group: group
    });
};

exports.getGroup = function (id) {
    let group;
    database.ref('users/' + id).on('value', function (snapshot) {
        group = (snapshot.val() && snapshot.val().group) || 'Anonymous';
    });
    return group;
};

exports.getWeek = function (group, week) {
    let schedule = "";
    for (let day = 1; day < 6; day++) {
        schedule += "Day: " + day + " \n";
        database.ref('/schedule/' + group + "/" + day).on('value', function (snapshot) {
            snapshot.forEach(function (childSnapshot) {
                if (childSnapshot.val().week == 0 || childSnapshot.val().week == week) {
                    schedule += childSnapshot.val().name + "\n";
                }
            });
            schedule += "\n";
        });
    }
    return schedule;
};

exports.getToday = function (day, group, week) {
    let schedule = "";
    database.ref('/schedule/' + group + '/' + day).on('value', function (snapshot) {
        snapshot.forEach(function (childSnapshot) {
            if (childSnapshot.val().week == 0 || childSnapshot.val().week == week) {
                schedule += ("|" + childSnapshot.val().time + "| " + childSnapshot.val().room + ". " + childSnapshot.val().teacher + "\n" + childSnapshot.val().name + "\n") || 'Anonymous';
            }
        });
    });
    return schedule;
};