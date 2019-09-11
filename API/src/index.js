const express = require('express');
const app = express();
const cors = require('cors');
const session = require('express-session');
import models, { connectDb } from './database';

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

const erasaDatabaseOnSync = false;

connectDb().then(async () => {
    if(erasaDatabaseOnSync) {
        await Promise.all([
            models.Board.deleteMany({}),
            models.Column.deleteMany({}),
            models.Card.deleteMany({})
        ]);

        createSeeds();
    }
    app.listen(PORT, () => {
        console.log(`Express started on ${PORT}`);
    });
});

const createSeeds = async () => {
    const board1 = new models.Board({
        name: "Test Board"
    });

    const column1 = new models.Column({
        name: "Test Column",
        board: board1.id
    });

    const card1 = new models.Card({
        name: "Test Card",
        description: "This is a test card",
        activity: [
            "some activity",
            "another bit of activiy"
        ],
        column: column1.id,
        board: board1.id
    });

    const board2 = new models.Board({
        name: "Test Board 2"
    });

    const column2 = new models.Column({
        name: "Test Column 2",
        board: board2.id
    });

    const card2 = new models.Card({
        name: "Test Card 2",
        description: "This is a test card",
        activity: [
            "some activity",
            "another bit of activiy"
        ],
        column: column1.id,
        board: board1.id
    });

    await board1.save();
    await column1.save()
    await card1.save();
    await board2.save();
    await column2.save()
    await card2.save();
}

module.exports = app;