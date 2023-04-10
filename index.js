import express from 'express';
import cors from 'cors';
import multer from 'multer';
import mongoose from 'mongoose';
import dotenv from 'dotenv';

import checkAuth from './utils/checkAuth.js';
import { registerValidator, applicantValidator, loginValidator } from './utils/validator.js';
import handleValidationErrors from './utils/handleValidationErrors.js';

import * as EmployerController from './controllers/EmployerController.js';
import * as ApplicantController from './controllers/ApplicantController.js';

dotenv.config()

const port = process.env.PORT || 5000

//mongoose.set("strictQuery", false);

const mongooseUrl = `mongodb://0.0.0.0:27017`
const url1 = `mongodb://finfreedb:27017/admin`

mongoose
    .connect(`mongodb://finfreedb:27017/hrminer`)
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

app.post('/auth/register', registerValidator, handleValidationErrors, EmployerController.register);
app.post('/auth/login', loginValidator, handleValidationErrors, EmployerController.login);
app.get('/auth/me', checkAuth, EmployerController.getMe);
app.patch('/auth/update', checkAuth, EmployerController.updatePositions);
app.delete('/auth/:id', checkAuth, EmployerController.remove);

app.get('/test/:id', EmployerController.getEmployer);
app.get('/applicants', checkAuth, ApplicantController.getAll);
app.post('/applicants', applicantValidator, handleValidationErrors, ApplicantController.create);
app.delete('/applicants/:id', checkAuth, ApplicantController.remove);
app.get('/create-pdf', ApplicantController.getDocument);

app.listen(port, (err) => {
    if (err) {
        return console.log(err);
    }

    console.log(`App listening on ${port}!`);
});