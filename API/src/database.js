const mongoose = require('mongoose');

const username = 'TacoAccess';
const password = 'JvuOZ84xIwn8GRpI';
const server = 'cluster0-sjxrw.mongodb.net';
const database = 'TacoBoard';
const uri = `mongodb+srv://${username}:${password}@${server}/${database}?retryWrites=true&w=majority`;

const Board = require('./models/board.model');
const Column = require('./models/column.model');
const Card = require('./models/card.model');

const models = { Board, Column, Card };

const connectDb = () => {
    return mongoose.connect(uri, { useNewUrlParser: true });
}

export { connectDb };

export default models;