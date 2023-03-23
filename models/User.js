import mongoose from "mongoose";

const UserSchema = new mongoose.Schema({
    firstName:{
        type: String,
        required: true,
    },
    prof: String, 
    workTime: {
        type: Number,
        default: 8,
    },
    salary: Number,
    userId:{
        type: String,
        required: true,
        unique: true,
    },
    balance: {
        type: Number,
        default: 500,
    },
    debts: {
        type: Number,
        default: 0,
    },
    age:{
        type: Number,
        required: true,
    },
    children:{
        type: Number,
        default: 0,
    },
    house: {
        type: Array,
        default: [],
    },
    car: {
        type: Array,
        default: [],
    },
    carsharing: {
        status: {
            type: Boolean,
            default: false,
        },
        date: {
            type: Number,
            default: 0,
        },
    },
    rent: {
        type: Array,
        default: [],
    },
    bizs: {
        type: Array,
        default: [],
    },
    deposit:{
        amount: {
            type: Number,
            default: 0,
        },
        date: {
            type: Number,
            default: 0,
        },
    },
    credits:{
        type: Array,
        default: [],
    },
    record:{
        age: {
            type: Number,
            default: 0,
        },
        prof: String,
        cashflow: {
            type: Number,
            default: 0,
        },
        bizCount: {
            type: Number,
            default: 0,
        },
        deposit: {
            type: Number,
            default: 0,
        },
        rentCount: {
            type: Number,
            default: 0,
        },
        houseSumm: {
            type: Number,
            default: 0,
        },
        carSum: {
            type: Number,
            default: 0,
        },
    },
    expenses:{
        type: Number,
        default: 0,
    },
    datePoint:{
        type: Number,
        default: 0,
    },
    freeEnergizer:{
        type: Number,
        default: 0,
    },
    freeEnergizerCount:{
        type: Number,
        default: 2,
    },
    onGame:{
        type: Boolean,
        default: true,
    },
    time:{
        type: Number,
        default: 10,
    },
    energy:{
        type: Number,
        default: 100,
    },
    maxEnergy:{
        type: Number,
        default: 100,
    },
    energizer:{
        type: Number,
        default: 0,
    },
    freeEnergizerOn:{
        type: Boolean,
        default: true,
    },
    lifesCount:{
        type: Number,
        default: 0,
    },
    greetingIn:{
        type: Array,
        default: [],
    },
    greetingOut:{
        type: Array,
        default: [],
    },
    disabled:{
        type: Array,
        default: [],
    },
    promoter:{
        type: Boolean,
        default: false,
    },
    photo100: String,

},{
    timestamps:true,
},
);

export default mongoose.model('User', UserSchema);