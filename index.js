import express from 'express';
import cors from 'cors';
import multer from 'multer';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import { YooCheckout } from '@a2seven/yoo-checkout';

import checkAuth from './utils/checkAuth.js';
import checkAdmin from './utils/checkAdmin.js';
import { registerValidator, applicantValidator, loginValidator } from './utils/validator.js';
import handleValidationErrors from './utils/handleValidationErrors.js';

import * as EmployerController from './controllers/EmployerController.js';
import * as ApplicantController from './controllers/ApplicantController.js';

dotenv.config()

const port = process.env.PORT || 5000

const mongooseUrl = `mongodb://0.0.0.0:27017`
const url1 = `mongodb://finfreedb:27017/admin`

mongoose.set("strictQuery", false);
mongoose
    .connect(`mongodb://mongo:27017/admin`, { useNewUrlParser: true, useUnifiedTopology: true })
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

app.get('/auth/get-all', checkAdmin, EmployerController.getAll);
app.get('/applicants/admin', checkAdmin, ApplicantController.getAllAplicants);
app.delete('/auth/admin/:id', checkAdmin, EmployerController.remove);
app.delete('/applicants/admin/:id', checkAdmin, ApplicantController.remove);

app.post('/auth/register', registerValidator, handleValidationErrors, EmployerController.register);
app.post('/auth/login', loginValidator, handleValidationErrors, EmployerController.login);
app.get('/auth/me', checkAuth, EmployerController.getMe);
app.patch('/auth/update', checkAuth, EmployerController.updatePositions);
app.delete('/auth/:id', checkAuth, EmployerController.remove);

app.get('/test/:id', EmployerController.getEmployer);
app.get('/applicants', checkAuth, ApplicantController.getAll);
app.post('/applicants', applicantValidator, handleValidationErrors, ApplicantController.create);
app.delete('/applicants/:id', checkAuth, ApplicantController.remove);
app.patch('/applicants/:id', checkAuth, ApplicantController.update);
app.get('/create-pdf', checkAuth, ApplicantController.getDocument);

const checkout = new YooCheckout({
    shopId: process.env.YOOKASSA_SHOP_ID,
    secretKey: process.env.YOOKASSA_SECRET_KEY
  });

app.post('/create-payment', async (req, res) => {
    const idempotenceKey = req.body.id;
    const createPayload = {
        amount: {
            value: '99.00',
            currency: 'RUB'
        },
        payment_method_data: {
            type: 'bank_card'
        },
        capture:true,
        confirmation: {
            type: 'redirect',
            return_url: `https://hrminer.ru/lk/${req.body.employerId}`
        },
    };

    try {
        await checkout.createPayment(createPayload, idempotenceKey).then((data) => res.send(data));
        
    } catch (error) {
        res.send(error);
    }
});

app.listen(port, (err) => {
    if (err) {
        return console.log(err);
    }

    console.log(`App listening on ${port}!`);
});