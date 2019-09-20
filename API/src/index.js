const express = require('express');
const app = express();
const cors = require('cors');
const session = require('express-session');
import models, { connectDb } from './database';

require('dotenv').config({path: `${__dirname}\\environments\\${process.env.NODE_ENV.trim()}.env`})

app.use(express.json());
app.use(express.urlencoded({extended: false}));

app.use(cors({
    origin: 'http://localhost:3000',
    credentials: true,
}));
app.use((req, res, next) => {
    req.context = {
        models
    };
    next();
});
app.use(session({
    secret: 'some dirty little secret',
    resave: false,
    saveUninitialized: false,
}));

const PORT = process.env.PORT || 5000;

const routes = ['boards', 'columns', 'cards', 'users', 'subtasks'];

routes.forEach(route => {
    app.use(`/api/${route}`, require(`./routes/api/${route}`));
});

const erasaDatabaseOnSync = process.env.DELETEDB;

connectDb().then(async () => {
    if(erasaDatabaseOnSync) {
        await Promise.all([
            models.Board.deleteMany({}),
            models.Column.deleteMany({}),
            models.Card.deleteMany({}),
            models.User.deleteMany({}),
            models.Subtask.deleteMany({})
        ]);
    }
    app.listen(PORT, () => {
        console.log(`Express started on ${PORT}`);
    });
});

module.exports = app;