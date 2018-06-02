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
    var userFound = false;
    for (var i = 0; i < users.length; i++) {
        var user = users[i];
        if (user.name == req.body.name) {
            user.points += req.body.points;
            userFound = true;
            break;
        }
    }
    if (!userFound) {
        res.send('User not found.');
    }
    console.log(users);
    res.json(users);
})

const port = process.env.PORT;
const server = app.listen(port, () => {
    console.log(`Server listening port ${port}`);
})