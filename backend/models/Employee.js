import mongoose from "mongoose";

const employeeschema = new mongoose.Schema({
    empid:String,
    name:String,
    email:String,
    phone:String,
    dob:Date,
    address:String,
    bloodgroup:String,
    doj:Date,
    department:String

})

const Employee = mongoose.model('Employee',employeeschema)

export default Employee