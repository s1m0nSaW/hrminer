import mongoose from "mongoose";

const EmployerSchema = new mongoose.Schema({
    email:{
        type: String,
        required: true,
        unique: true,
    },
    name:{
        type: String,
        required: true,
    },
    passwordHash:{
        type: String,
        required: true,
    },
    positions:{
        type: Array,
        default: [],
    },
},{
    timestamps:true,
},
);

export default mongoose.model('Employer', EmployerSchema);