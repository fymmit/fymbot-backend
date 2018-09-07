const fs = require('fs');

let users

function findExistingUser(searchedUsername, callback) {
    for (var i = 0; i < users.length; i++) {
        var user = users[i];
        if (user.name == searchedUsername) {
            callback(null, user);
            return;
        }
    }
    callback(new Error('User not found.'));
    return;
}

function givePoints(user, points) {
    user.points += points;
}

function postPoints(req, callback) {
    findExistingUser(req.body.name, (err, user) => {
        if (err) {
            callback(err.message);
        } else {
            givePoints(user, req.body.points);
            writeUserData().then(() => {
                callback(users);
            }).catch(rejection => {
                console.log(rejection);
            })
        }
    })
}

function getUsers(callback) {
    callback(users);
}

function postUsers(req, callback) {
    let user = {
        id: '',
        name: '',
        points: 0
    }
    user.id = (users.length + 1).toString();
    user.name = req.body.name;
    users.push(user);
    writeUserData().then(() => {
        callback(users);
    }).catch(rejection => {
        console.log(rejection);
    })
}

const loadUserData = () => {
    fs.readFile(`${__dirname}/../users.json`, 'utf8', (err, data) => {
        !err ? users = JSON.parse(data) : console.log(err);
    })
}

const writeUserData = () => {
    return new Promise((resolve, reject) => {
        let data = JSON.stringify(users);
        fs.writeFile('users.json', data, 'utf8', (err) => {
            err ? reject(err) : resolve();
        })
    })
}

module.exports = {
    postPoints,
    postUsers,
    getUsers,
    loadUserData
}