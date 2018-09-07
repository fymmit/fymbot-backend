require('dotenv').config();
const app = require('express')();
const cors = require('cors');
const bodyParser = require('body-parser');
const yt = require('./src/youtube.js');
const users = require('./src/users');

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

app.get('/youtube', (req, res) => {
    yt.search(req.query.q, (err, result) => {
        res.send(err ? err.message : result);
    });
})

app.get('/users', (req, res) => {
    users.getUsers((users) => {
        res.json(users);
    });
})

app.post(`/${secret}/users`, (req, res) => {
    users.postUsers(req, (data) => {
        res.json(data);
    })
})

app.post(`/${secret}/points`, (req, res) => {
    users.postPoints(req, (data) => {
        res.json(data);
    })
})

const port = process.env.PORT;
const server = app.listen(port, () => {
    console.log(`Server listening port ${port}`);
    users.loadUserData();
})
