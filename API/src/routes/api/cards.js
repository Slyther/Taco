const express = require('express');
const router = express.Router();

router.post('/', async (req, res) => {
    const card = await req.context.models.Card.create(req.body);

    return res.send(card);
});

router.get('/:id', async (req, res) => {
    const cards = await req.context.models.Card.findByBoardId(req.params.id);

    return res.send(cards);
});

router.get('/card/:id', async (req, res) => {
    const cards = await req.context.models.Card.findById(req.params.id);

    return res.send(cards);
});

router.put('/:id', async (req, res) => {
    let card = await req.context.models.Card.findById(req.params.id);
    let updatedCard = await req.context.models.Card.updateOne(card, req.body);
    
    return res.send(updatedCard);
});

router.delete('/:id', async (req, res) => {
    const card = await req.context.models.Card.findById(req.params.id);
    let result = null;
    if(card) {
        result = await card.remove();
    }

    return res.send(result);
});

module.exports = router;