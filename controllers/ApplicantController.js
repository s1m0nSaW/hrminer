import ApplicantModel from "../models/Applicant.js";
import PDFDocument from 'pdfkit';
import { ISTJ, ISFJ, INFJ, INTJ, ISTP, ISFP, INFP, INTP, ESTP, ESFP, ENFP, ENTP, ESTJ, ESFJ, ENFJ, ENTJ } from '../data/Types.js'

export const create = async (req,res) => {
    try {
        const doc = new ApplicantModel({
            name: req.body.name,
            email: req.body.email,
            phone: req.body.phone,
            position: req.body.position,
            mbtiType: req.body.mbtiType,
            employer: req.body.employer,
            paymentId: req.body.paymentId,
            status: req.body.status,
        });

        await doc.save();

        res.json({
            success: "Результаты отправлены",
        });
    } catch (err) {
        console.log(err);
        res.status(500).json({
            message: 'Не удалось отправить результаты',
        });
    }
}

export const update = async (req, res) => {
    try {
        const user = await ApplicantModel.findOneAndUpdate({
            _id: req.params.id,
        }, {$set:{
            paymentId: req.body.paymentId,
            status: req.body.status,
        }},{ returnDocument: "after" });

        if(user){res.json(user);}

    } catch (err) {
        console.log(err);
        res.status(500).json({
            message: 'Не удалось обновить статус',
        });
    }
};

export const getAllAplicants = async (req,res) => {
    try {
        const applicants = await ApplicantModel.find().exec();

        res.json(applicants);
    } catch (err) {
        console.log(err);
        res.status(500).json({
            message: 'Не удалось найти соискателей',
        });
    }
}

export const getAll = async (req,res) => {
    try {
        const applicants = await ApplicantModel.find({ employer: req.userId }).exec();

        res.json(applicants);
    } catch (err) {
        console.log(err);
        res.status(500).json({
            message: 'Не удалось найти соискателей',
        });
    }
}

export const payments = async (req, res) => {
    const data = req.body;
    console.log(data)
    try {
        const user = await ApplicantModel.findOneAndUpdate({
            paymentId: data.object.id,
        }, {$set:{
            status: data.object.status,
        }},{ returnDocument: "after" });
        console.log(user)
        res.sendStatus(200)
    } catch (error) {
        console.log(error)
        res.sendStatus(500)
    }
}

export const remove = async (req, res) => {
    try {
        ApplicantModel.findOneAndDelete(
            {
                _id: req.params.id,
            },
            (err, doc) => {
                if (err) {
                    console.log(err);
                    return res.status(500).json({
                        message: 'Не удалось удалить',
                    });
                }

                if (!doc) {
                    return res.status(404).json({
                        message: 'Соискатель не найден'
                    });
                }

                res.json({
                    success: "Анкета удалена"
                });
            }
        );
    } catch (err) {
        console.log(err);
        res.status(500).json({
            message: 'Проблема с удалением',
        });
    }
}

export const getDocument = (req, res) => {
    const { name, phone, email, mbtiType } = req.body;

    const getDescription = (type) => {
        let str = {}
        switch (type) {
            case 'ISTJ':
                str = ISTJ;
                break;
            case 'ISFJ':
                str = ISFJ;
                break;
            case 'INFJ':
                str = INFJ;
                break;
            case 'INTJ':
                str = INTJ;
                break;
            case 'ISTP':
                str = ISTP;
                break;
            case 'ISFP':
                str = ISFP;
                break;
            case 'INFP':
                str = INFP;
                break;
            case 'INTP':
                str = INTP;
                break;
            case 'ESTP':
                str = ESTP;
                break;
            case 'ESFP':
                str = ESFP;
                break;
            case 'ENFP':
                str = ENFP;
                break;
            case 'ENTP':
                str = ENTP;
                break;
            case 'ESTJ':
                str = ESTJ;
                break;
            case 'ESFJ':
                str = ESFJ;
                break;
            case 'ENFJ':
                str = ENFJ;
                break;
            case 'ENTJ':
                str = ENTJ;
                break;
            default:
                str = {title1:'Произошла непредвиденная ошибка'}

        }
        return (
            str
        )
    }

    const pdfDoc = new PDFDocument();

    res.attachment(`${name}_info.pdf`); // Задаем имя файла и заголовок ответа на скачивание

    pdfDoc.fontSize(20).font('fonts/BonaNova.ttf').text(`Рекомендации по работе от HR Майнер`,50,20, { align: 'center' });
    pdfDoc.moveDown();
    pdfDoc.fontSize(14).font('fonts/BonaNova.ttf').text(`ФИО: ${name}`, { align: 'center' });
    pdfDoc.fontSize(14).font('fonts/BonaNova.ttf').text(`Номер телефона: ${phone}`, { align: 'center' });
    pdfDoc.fontSize(14).font('fonts/BonaNova.ttf').text(`Email: ${email}`, { align: 'center' });
    pdfDoc.moveDown();
    pdfDoc.fontSize(20).font('fonts/BonaNova.ttf').text(getDescription(mbtiType).title1);
    pdfDoc.fontSize(14).font('fonts/BonaNova.ttf').text(getDescription(mbtiType).text1);
    pdfDoc.moveDown();
    pdfDoc.fontSize(20).font('fonts/BonaNova.ttf').text(getDescription(mbtiType).title2);
    pdfDoc.fontSize(14).font('fonts/BonaNova.ttf').text(getDescription(mbtiType).text2);
    pdfDoc.moveDown();
    pdfDoc.fontSize(20).font('fonts/BonaNova.ttf').text(getDescription(mbtiType).title3);
    pdfDoc.fontSize(14).font('fonts/BonaNova.ttf').text(getDescription(mbtiType).text3);
    pdfDoc.moveDown();
    pdfDoc.fontSize(20).font('fonts/BonaNova.ttf').text(getDescription(mbtiType).title4);
    pdfDoc.fontSize(14).font('fonts/BonaNova.ttf').text(getDescription(mbtiType).text4);
    pdfDoc.addPage();
    pdfDoc.fontSize(20).font('fonts/BonaNova.ttf').text(getDescription(mbtiType).title5,50,30);
    pdfDoc.fontSize(14).font('fonts/BonaNova.ttf').text(getDescription(mbtiType).text5);
    pdfDoc.moveDown();
    pdfDoc.fontSize(20).font('fonts/BonaNova.ttf').text(getDescription(mbtiType).title6);
    pdfDoc.fontSize(14).font('fonts/BonaNova.ttf').text(getDescription(mbtiType).text6);
    pdfDoc.moveDown();
    pdfDoc.fontSize(20).font('fonts/BonaNova.ttf').text("Как мотивировать:"); 
    pdfDoc.fontSize(14).font('fonts/BonaNova.ttf').text(getDescription(mbtiType).text7);
    pdfDoc.moveDown();
    pdfDoc.fontSize(20).font('fonts/BonaNova.ttf').text(getDescription(mbtiType).title8);
    pdfDoc.fontSize(14).font('fonts/BonaNova.ttf').text(getDescription(mbtiType).text8);
    pdfDoc.moveDown();
    pdfDoc.fontSize(20).font('fonts/BonaNova.ttf').text(getDescription(mbtiType).title9);
    pdfDoc.fontSize(14).font('fonts/BonaNova.ttf').text(getDescription(mbtiType).text9);


    pdfDoc.pipe(res); // Отправляем pdf документ в ответ на запрос

    pdfDoc.end();
}