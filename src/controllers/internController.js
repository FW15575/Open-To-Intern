const internModel = require("../models/internModel")
const validator = require('validator')

const { default: mongoose } = require("mongoose")
const collegeModel = require("../models/collegeModel")
const isValidObjectId = (ObjectId) =>{return mongoose.Types.ObjectId.isValid(ObjectId)}
let isValid= /\d/

let isValidMobile = /^[6-9]\d{9}$/

const createIntern = async function(req,res){
    try{
    const data = req.body

    if(Object.keys(data).length == 0){
        return res.status(400).send({ status: false, message: "Invalid request parameters please provide Intern details" })
    }

    if(!data.name){
        return res.status(400).send({ status: false, message: "Please Provide name"})

    }

    if(isValid.test(data.name)){
      return res.status(400).send({status:false,message:'Name Should not contain Numbers'})
    }
    if (!data.email){
      return res.status(400).send({ status: false, message: " Please Provide email" });
    }

    const validEmail = validator.isEmail(data.email);
    if (validEmail === false){
      return res.status(400).send({ status: false, message: "Please enter valid email"})
    }


    const checkEmail = await internModel.findOne({ email:data.email });
    if (checkEmail){
      return res.status(400).send({ status: false, message: "This email already exist"})
    } 
    if(data.mobile.length !== 10) return res.status(400).send({status:false ,message:"enter valid mobile no"})
  
   
    if ( !isValidMobile.test(data.mobile)){
      return res.status(400).send({ status: false, message: "Mobile no. should be a digit"})
    }
    let uniqueNo = await internModel.findOne({ mobile: data.mobile });
     if(uniqueNo) return res.status(400).send({status:false ,message:"mobileNo. already exist"})

    
  

    let collegedata = await collegeModel.findOne({name:data.collegeName})
    if(!collegedata) {
      return res.status(400).send({ status: false, message: "Please Provide valid CollegeName" });
    }
     data["collegeId"] = collegedata._id
     delete data.collegeName

    const internCreation = await internModel.create(data)
    return res.status(201).send({ status: true, data: internCreation });
    }
    
catch(err){
return res.status(500).send({satus:false,error:err.message})
 
}
}

  module.exports.createIntern = createIntern

  
 