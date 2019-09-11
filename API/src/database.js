const mongoose = require('mongoose');

const username = 'TacoAccess';
const password = 'JvuOZ84xIwn8GRpI';
const server = 'cluster0-sjxrw.mongodb.net';
const database = 'TacoBoard';
const uri = `mongodb+srv://${username}:${password}@${server}/${database}?retryWrites=true&w=majority`;

const Board = require('./models/board.model').default;
const Column = require('./models/column.model').default;
const Card = require('./models/card.model').default;
const User = require('./models/user.model').default;

const models = { Board, Column, Card, User };

const connectDb = () => {
    return mongoose.connect(uri, { useNewUrlParser: true });
}

export { connectDb };

export default models;