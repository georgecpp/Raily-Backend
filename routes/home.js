const router = require('express').Router();

router.get('/', (req, res) => {
    res.send('Welcome to home page of Raily API!');
})

module.exports = router;