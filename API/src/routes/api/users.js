const express = require('express');
const router = express.Router();

router.post('/register', async (req, res) => {
    let validationResult = await req.context.models.User.validateNewUser(req.body);
    if (validationResult.length !== 0) {
        return res.json({ validationResult: validationResult });
    }
    let preparedUser = req.context.models.User.prepareSecretInfo(req.body);
    const user = await req.context.models.User.create(preparedUser);

    return res.status(200).send(user);
});

router.post('/login', async (req, res) => {
    let isValidLogin = await req.context.models.User.validateLogin(req.body);
    if (isValidLogin) {
        req.session.username = req.body.username;
        req.session.email = req.body.email;
        req.session.isLoggedIn = true;
        return res.send({"msg": "success"});
    }

    return res.send({"msg": "Incorrect login info."});
});

router.get('/login', async (req, res) => {
    if(req.session.isLoggedIn){
        return res.send({ username: req.session.username, email: req.session.email});
    }
    return res.send({"msg": "Not logged in."});
});

router.get('/logout', async (req, res) => {
    req.session.destroy();
    return res.send({"msg": "success"});
});

router.get('/:id', async (req, res) => {
    const user = await req.context.models.User.findById(req.params.id);

    return res.send(user);
});

router.put('/:id', async (req, res) => {
    let user = await req.context.models.User.findById(req.params.id);
    let updatedUser = await req.context.models.User.updateOne(user, req.body);
    
    return res.send(updatedUser);
});

router.delete('/:id', async (req, res) => {
    const user = await req.context.models.User.findById(req.params.id);
    let result = null;
    if(user) {
        result = await user.remove();
    }

    return res.send(result);
});

module.exports = router;