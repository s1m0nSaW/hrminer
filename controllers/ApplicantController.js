import ApplicantModel from "../models/Applicant.js";

export const create = async (req,res) => {
    try {
        const doc = new ApplicantModel({
            name: req.body.name,
            email: req.body.email,
            phone: req.body.phone,
            position: req.body.position,
            mbtiType: req.body.mbtiType,
            employer: req.body.employer,
        });

        await doc.save();

        res.json({
            success: true,
        });
    } catch (err) {
        console.log(err);
        res.status(500).json({
            message: 'Не удалось отправить результаты',
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
                    success: true
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