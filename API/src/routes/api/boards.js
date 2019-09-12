const express = require('express');
const router = express.Router();

router.post('/', async (req, res) => {
    const board = await req.context.models.Board.create(req.body)
    .catch((err) => {
        console.log(err.code);
        if(err.code === 11000) {
            return { errorMessage: "Another board already exists with this name." };
        }
    });

    const user = await req.context.models.User.findById(req.body.owner);
    user.boards.push(board._id);
    user.save();

    return res.send(board);
});


router.get('/', async (req, res) => {
    const boards = await req.context.models.Board.find();

    return res.send(boards);
});

router.get('/:id', async (req, res) => {
    const board = await req.context.models.Board.findById(req.params.id).populate('users');

    return res.send(board);
});

router.delete('/:id', async (req, res) => {
    const board = await req.context.models.Board.findById(req.params.id);
    let result = null;
    if(board) {
        result = await board.remove();
    }

    return res.send(result);
});

module.exports = router;