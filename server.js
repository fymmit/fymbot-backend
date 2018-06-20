require('dotenv').config();
const app = require('express')();
const cors = require('cors');
const bodyParser = require('body-parser');
const yt = require('./src/youtube.js');

app.use(cors());
app.use((req, res, next) => {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
});
app.use(bodyParser.json());

var users = [
    {
        name: "Heikki", points: 100
    },
    {
        name: "Markku", points: 200
    }
]

app.get('/users', (req, res) => {
    res.json(users);
})

app.get('/youtube', (req, res) => {
    yt.search(req.query['q'], (err, result) => {
        res.send(err ? err.message : result);
    });
})

const port = process.env.PORT;
const server = app.listen(port, () => {
    console.log(`Server listening port ${port}`);
})
