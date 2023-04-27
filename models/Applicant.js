import mongoose from "mongoose";

const ApplicantSchema = new mongoose.Schema({
    name:{
        type: String,
        required: true,
    },
    email:{
        type: String,
        required: true,
    },
    phone:{
        type: Number,
        required: true,
    },
    mbtiType:{
        type: String,
        required: true,
    },
    position:{
        type: String,
        required: true,
    },
    employer:{
        type: String,
        required: true,
    },
    paymentId:{
        type: String,
        default: 'none',
    },
    status:{
        type: String,
        default: 'none',
    },
},{
    timestamps:true,
},
);

export default mongoose.model('Applicant', ApplicantSchema);