const express = require('express');
const router = express.Router();

router.post('/', async (req, res) => {
    const subtask = await req.context.models.Subtask.create(req.body);

    return res.send(subtask);
});

router.get('/:id', async (req, res) => {
    const subtasks = await req.context.models.Subtask.findByCardId(req.params.id);

    return res.send(subtasks);
});

router.put('/:id', async (req, res) => {
    let updatedSubtask = await req.context.models.Subtask.updateOne({_id: req.params.id}, req.body);
    
    return res.send(updatedSubtask);
});

router.delete('/:id', async (req, res) => {
    const subtask = await req.context.models.Subtask.findById(req.params.id);
    let result = null;
    if(subtask) {
        result = await subtask.remove();
    }

    return res.send(result);
});

module.exports = router;