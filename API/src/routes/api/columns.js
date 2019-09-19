const express = require('express');
const router = express.Router();

router.post('/', async (req, res) => {
    const column = await req.context.models.Column.create(req.body);

    return res.send(column);
});

router.get('/:id', async (req, res) => {
    const columns = await req.context.models.Column.findByBoardId(req.params.id);

    return res.send(columns);
});

router.get('/column/:id', async (req, res) => {
    const columns = await req.context.models.Column.findById(req.params.id);

    return res.send(columns);
});

router.put('/:id', async (req, res) => {
    let updatedColumn = await req.context.models.Column.updateOne({_id: req.params.id}, req.body);
    
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