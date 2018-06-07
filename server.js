require('dotenv').config();
const app = require('express')();
const cors = require('cors');
const bodyParser = require('body-parser');

const secret = process.env.SECRET;

app.use(cors());
app.use((req, res, next) => {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
  });
app.use(bodyParser.json());

var users = [
    {
        id: '1',
        name: 'Heikki',
        points: 100
    },
    {
        id: '2',
        name: 'Markku',
        points: 200
    }
]

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
    console.log(user);
    res.json(users);
})

app.post(`/${secret}/points`, (req, res) => {
    findExistingUser(req.body.name, (err, user) => {
        if (err) {
            res.send(err.message);
            return;
        }
        givePoints(user, req.body.points);
        res.json(users);
    })
})

function findExistingUser(searchedUsername, callback) {
    for (var i = 0; i < users.length; i++) {
        var user = users[i];
        if (user.name == searchedUsername) {
            console.log('User found, ebin.');
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
})