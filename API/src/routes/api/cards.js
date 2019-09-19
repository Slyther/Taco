const express = require('express');
const router = express.Router();

router.post('/', async (req, res) => {
    const card = await req.context.models.Card.create(req.body);
    card.activity = await req.context.models.Card.resolveActivity(card.activity, req.context.models);

    return res.send(card);
});

router.get('/:id', async (req, res) => {
    const cards = await req.context.models.Card.findByBoardId(req.params.id);
    Promise.all(
        cards.map(async card => {
            card.activity = await req.context.models.Card.resolveActivity(card.activity, req.context.models);
            return card;
        })
    ).then((cards) => {
        return res.send(cards);
    });
});

router.get('/card/:id', async (req, res) => {
    const cards = await req.context.models.Card.findById(req.params.id);
    cards.activity = await req.context.models.Card.resolveActivity(cards.activity, req.context.models);

    return res.send(cards);
});

router.put('/:id', async (req, res) => {
    let updatedCard = await req.context.models.Card.updateOne({_id: req.params.id}, req.body);
    
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