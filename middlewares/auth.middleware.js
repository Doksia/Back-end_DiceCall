const jwt = require('jsonwebtoken');
module.exports = function (req, res, next) {
  const authHeader = req.header('Authorization');
  
  if (!authHeader) {
    return res.status(401).json({ Error: 'denied access' });
  }

  try {
    const token = authHeader.split(' ')[1];
    const encript = jwt.verify(token, process.env.JWT_SECRET);
    req.usuario = encript; 
    next(); 
  } catch (error) {
    res.status(401).json({ Error: 'Token no valid' });
  }
};