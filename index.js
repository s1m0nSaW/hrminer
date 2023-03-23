import express from 'express';
import cors from 'cors';
import multer from 'multer';
import mongoose from 'mongoose';
import checkAuth from './utils/checkAuth.js';

import * as UserController from './controllers/UserController.js';
import * as BusinessController from './controllers/BusinessController.js';

const {
    MONGO_USERNAME,
    MONGO_PASSWORD,
    MONGO_HOSTNAME,
    MONGO_PORT,
    MONGO_DB
  } = process.env;

const port = process.env.PORT || 5000

const url = `mongodb://${MONGO_USERNAME}:${MONGO_PASSWORD}@${MONGO_HOSTNAME}:${MONGO_PORT}/${MONGO_DB}?authSource=admin`;

mongoose.set("strictQuery", false);

const mongooseUrl = `mongodb://localhost:27017`
const url1 = `mongodb://finfreedb:27017/admin`

mongoose
    .connect(`mongodb://localhost:27017/hrminer`)
    .then(() => console.log('DB ok'))
    .catch((err) => console.log('DB error ' + err));

const app = express();

const storage = multer.diskStorage({
    destination: ( _, __, cb)=>{
        cb(null, 'uploads');
    },
    filename: ( _, file, cb) => {
        cb(null, file.originalname);
    },
});

const upload = multer({storage});

app.use(express.json());
app.use(cors());
app.use('/uploads', express.static('uploads'));

app.post('/upload', upload.single('image'), (req,res) => {
    res.json({
        url: `/uploads/${req.file.originalname}`,
    });
});

app.post('/auth/login', UserController.login);
app.post('/auth/register/:params', checkAuth, UserController.register);
app.get('/auth/me/:params', checkAuth, UserController.getMe);
app.get('/auth/users', UserController.getAll);
app.patch('/auth/:id',UserController.update);
app.patch('/auth/new/:params', checkAuth, UserController.newGame);
app.delete('/auth/:id',UserController.remove);

app.get('/bizs', BusinessController.getAll);
app.get('/bizs/:id',BusinessController.getOne);
app.post('/bizs',BusinessController.create);
app.delete('/bizs/:id',BusinessController.remove);
app.patch('/bizs/:id',BusinessController.update);


app.listen(port, (err) => {
    if (err) {
        return console.log(err);
    }

    console.log(`App listening on ${port}!`);
});