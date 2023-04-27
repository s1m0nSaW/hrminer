import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';

dotenv.config()

const secret = process.env.SECRET
const password = process.env.PASSWORD

export const checkAuth (req, res, next) => {
  const token = (req.headers.authorization || '').replace(/Bearer\s?/, '');

  if (token) {
    try {
      const decoded = jwt.verify(token, secret);
      req.userId = decoded._id;
      next();
    } catch (e) {
      return res.status(403).json({
        message: 'Нет доступа',
      });
    }
  } else {
    return res.status(403).json({
      message: 'Нет доступа',
    });
  }
};

export const checkAdmin (req, res, next) => {
  const pass = req.body.pass;
  try {
    if(pass === password){
      next()
    } else {
      return res.status(403).json({
        message: 'Нет доступа',
      });
    }
  } catch (e) {
    return res.status(403).json({
      message: 'Нет доступа',
    });
  }
}