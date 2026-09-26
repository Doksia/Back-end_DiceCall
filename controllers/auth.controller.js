const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const User = require('../models/User.model'); 


exports.login = async (req, res) => {
  const { email, password } = req.body;

  try {
    
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ Error: 'Invalid Credentials' });
    }
    const valid = await bcrypt.compare(password, user.password);
    if (!valid) {
      return res.status(400).json({ Error: 'Invalid Credentials' });
    }
    const token = jwt.sign(
      { id: user._id },            
      process.env.JWT_SECRET,        
      { expiresIn: '5h' }             
    );
    res.json({
      token,
      user: { id: user._id, nombre: user.nombre, email: user.email }
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({ Error: 'Internal server Error' });
  }
};

  exports.signup = async (req, res) => {
  const { name, email, password } = req.body;

  try {
    const existeUser = await User.findOne({ email });
    if (existeUser) {
      return res.status(400).json({ Error: 'Not valid email' });
    }
    const salt = await bcrypt.genSalt(10);
    const passwordEncripted = await bcrypt.hash(password, salt);

    const newUser = new User({
      name,
      email,
      password: passwordEncripted
    });
    await newUser.save();
    res.status(201).json({ Success: 'Success creating the user', user: { name, email } });

  } catch (error) {
    console.error(error);
    res.status(500).json({ Error: 'Error creating the user' });
  }
};