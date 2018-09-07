require('dotenv').config();
const app = require('express')();
const cors = require('cors');
const bodyParser = require('body-parser');
const yt = require('./src/youtube.js');
const fs = require('fs');

const secret = process.env.SECRET;

app.use(cors());
app.use((req, res, next) => {
    res.header("Access-Control-Allow-Origin", "*");
    res.header(
        "Access-Control-Allow-Headers",
        "Origin, X-Requested-With, Content-Type, Accept"
    );
    next();
});
app.use(bodyParser.json());

let users

const loadUserData = () => {
    fs.readFile('users.json', 'utf8', (err, data) => {
        !err ? users = JSON.parse(data) : console.log(err);
    })
    console.log("XD");
}

app.get('/youtube', (req, res) => {
    yt.search(req.query.q, (err, result) => {
        res.send(err ? err.message : result);
    });
})

app.get('/users', (req, res) => {
    res.json(users);
})

app.post(`/${secret}/users`, (req, res) => {
    var user = {
        id: '',
        name: '',
        points: 0
    }
    user.id = (users.length + 1).toString();
    user.name = req.body.name;
    users.push(user);
    writeUserData().then(() => {
        res.json(users);
    }).catch(rejection => {
        console.log(rejection);
    })
})

writeUserData = () => {
    return new Promise((resolve, reject) => {
        let data = JSON.stringify(users);
        fs.writeFile('users.json', data, 'utf8', (err) => {
            err ? reject(err) : resolve();
        })
    })
}

app.post(`/${secret}/points`, (req, res) => {
    findExistingUser(req.body.name, (err, user) => {
        if (err) {
            res.send(err.message);
        } else {
            givePoints(user, req.body.points);
            writeUserData().then(() => {
                res.json(users);
            }).catch(rejection => {
                console.log(rejection);
            })
        }
    })
})

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

const port = process.env.PORT;
const server = app.listen(port, () => {
    console.log(`Server listening port ${port}`);
    loadUserData();
})
