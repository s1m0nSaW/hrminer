import dotenv from 'dotenv';

dotenv.config()

const password = process.env.PASSWORD

export default (req, res, next) => {
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