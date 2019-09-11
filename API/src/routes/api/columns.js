const express = require('express');
const router = express.Router();

router.post('/', async (req, res) => {
    const column = await req.context.models.Column.create({
        name: req.body.name,
        board: req.body.board
    });

    return res.send(column);
});

router.get('/:id', async (req, res) => {
    const columns = await req.context.models.Column.findByBoardId(req.params.id);

    return res.send(columns);
});

router.put('/:id', async (req, res) => {
    let column = await req.context.models.Column.findById(req.params.id);
    let updatedColumn = await req.context.models.Column.updateOne(column, req.body);
    
    return res.send(updatedColumn);
});

router.delete('/:id', async (req, res) => {
    const column = await req.context.models.Column.findById(req.params.id);
    let result = null;
    if(column) {
        result = await column.remove();
    }

    return res.send(result);
});

module.exports = router;