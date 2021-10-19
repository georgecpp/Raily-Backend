const router = require('express').Router();
const bcrypt = require('bcryptjs');
const {registerValidation, loginValidation, fbuserLoginValidation} = require('../validation');
const jwt = require('jsonwebtoken');
const User = require('../model/User');


const registerUser = async (req,res) => {

       // Hash the password...
       const salt = await bcrypt.genSalt(10);
       const hashedPassword = await bcrypt.hash(req.body.password, salt);
   
       // create a new user
       const user = new User({
           email: req.body.email,
           password: hashedPassword,
           name: req.body.name,
           fbuserId: req.body.fbuserId,
           img: req.body.img,
           friends: null,
           historyTrains: null,
       });
   
       try {
           const savedUser = await user.save();
           res.send({user: user._id});
       }
       catch(err) {
           res.status(400).send(err);
       }
}

const createAndAssignJWT = (user, res) => {
     // Create and assign JWT for this session
     const token = jwt.sign({_id: user._id}, process.env.TOKEN_SECRET);
     res.header('auth-token-raily', token).send(token);
}


// Register ROUTE
router.post('/register', async (req, res) => {
    
    // Validate the data before making a user
    const {error} = registerValidation(req.body);

    if(error) return res.status(400).send(error.details[0].message);

    // check if user already in the database
    const userExist = await User.findOne({email: req.body.email});
    if(userExist) {
        return res.status(400).send('User already exists!');
    }

    registerUser(req,res);
});

router.get('/register', async (req, res) => {
    res.send("Welcome to register route. Post data if u wanna be registered");
})

// Login ROUTE -- used for classic Raily App login method
router.post('/login', async (req, res) => {
    
    // Validate the data before we login the user.
    const {error} = loginValidation(req.body);
    if(error) return res.status(400).send(error.details[0].message);

    // checking if the email exists in the database
    const user = await User.findOne({email: req.body.email});
    if(!user) {
        return res.status(400).send('Email doesn\'t exist!');
    }

    // Password is correct
    const validPass = await bcrypt.compare(req.body.password, user.password);
    if(!validPass) return res.status(400).send('Invalid Password');

    // Create and assign JWT for this session

    createAndAssignJWT(user, res);

});

router.post('/facebook-auth', async(req, res) => {
    // Validate the data before we login the user.
    const {error} = fbuserLoginValidation(req.body);
    if(error) return res.status(400).send(error.details[0].message);


    // check if fbuserId exists in the database
    const user = await User.findOne({fbuserId: req.body.fbuserId});

    // if not, register user with fbuserId and access-token as password
    if(!user) {
        registerUser(req, res);
        return;
    }

    // if fbuserId exists, verify access token exists in the database for this specific fbuserId
    const accessToken = await User.findOne({fbuserId: req.body.fbuserId, password: req.body.password});
    if(!accessToken) {
        // update access token for user with fbuserId
        const updateAccesToken = await User.updateOne({fbuserId: req.body.fbuserId}, accessToken);
        if(!updateAccesToken) return res.status(400).send('Something went wrong with the server - Facebook Auth');
    }

    // create and assign JWT for this session
    createAndAssignJWT(user, res);
});


router.post('/google-auth', async(req, res) => {

    // Validate the data before we login the user.
    const {error} = loginValidation(req.body);
    if(error) return res.status(400).send(error.details[0].message);

    // check if email exists in the database
    const user = await User.findOne({email: req.body.email});

    // if not, register user with user email and google access-token as password
    if(!user) {
        registerUser(req,res);
        return;
    }

    // if user email exists, verify google access token exists in the database for this specific user email
    const accessToken = await User.findOne({email: req.body.email, password: req.body.password});
    if(!accessToken) {
        // update access token for the user
        const updateAccesToken = await User.updateOne({email: req.body.email},accessToken);
        if(!updateAccesToken) return res.status(400).send('Something went wrong with the server - Google Auth');
    }

    // Create and assign JWT for this session
    createAndAssignJWT(user, res);
});

module.exports = router;