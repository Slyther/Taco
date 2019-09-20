const mongoose = require('mongoose');

require('dotenv').config({path: `${__dirname}\\environments\\${process.env.NODE_ENV.trim()}.env`})

const username = process.env.DBUSER;
const password = process.env.DBPASSWORD;
const server = process.env.DBSERVER;
const database = process.env.DBNAME;
const uri = `mongodb+srv://${username}:${password}@${server}/${database}?retryWrites=true&w=majority`;

const Board = require('./models/board.model').default;
const Column = require('./models/column.model').default;
const Card = require('./models/card.model').default;
const User = require('./models/user.model').default;
const Subtask = require('./models/subtask.model').default;

const models = { Board, Column, Card, User, Subtask };

const connectDb = () => {
    return mongoose.connect(uri, { useNewUrlParser: true });
}

export { connectDb };

export default models;