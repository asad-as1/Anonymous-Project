const dotenv = require('dotenv');
dotenv.config();
const jwt = require('jsonwebtoken');
const User = require('../models/user'); 

const authenticate = async (req, res, next) => {
  const {token} = req.body;
  // console.log(token)
  
  if (!token) {
    return res.status(401).json({ message: 'Unauthorized1' });
  }
  try {
    const decoded = jwt.verify(token, process.env.SECRET);
    const user = await User.findById(decoded.userId); 
    // console.log(user)

    if (!user) {
      return res.status(401).json({ message: 'Unauthorized2' });
    }
    
    req.user = { id: user.id, role: user.role};

    next();
  } catch (error) {
    res.status(401).json({ message: 'Invalid or expired token' });
  }
};

module.exports = { authenticate };