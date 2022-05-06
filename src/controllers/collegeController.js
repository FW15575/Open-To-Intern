const collegeModel = require("../models/collegeModel")

const validator = require('validator')

const internModel = require("../models/internModel")

let isValid= /\d/           //regex for  validation

let isValidLink = /^(?:http(s)?:\/\/)?[\w.-]+(?:\.[\w\.-]+)+[\w\-\._~:/?#[\]@!\$&'\(\)\*\+,;=.]+$/  //regex use for validation of  logo link

const createColleges = async function (req, res) {
    try {
        const data = req.body
        if (Object.keys(data).length == 0) {
            return res.status(400).send({ status: false, message: "Invalid request parameters please provide Collage details" })
        }
        if (!data.name){
            return res.status(400).send({ status: false, message: " Please Provide  name" });
        }

         //use here validation for name,fullName,logolink

        if(isValid.test(data.name)){       
            return res.status(400).send({status:false,message:'Name Should not contain Numbers'})
        }

        const checkName = await collegeModel.findOne({ name:data.name });
        if (checkName){
          return res.status(400).send({ status: false, message: "This name is already exist"})
        } 

        if (!data.fullName) {
            return res.status(400).send({ status: false, message: " Please Provide  fullName" });
        }
        
         //check weather string contain a number 

        if(isValid.test(data.fullName)){
            return res.status(400).send({status:false,message:'fullName Should not contain Numbers'})
        }


        if (!data.logoLink) {
            return res.status(400).send({ status: false, message: " Please Provide  logolink" });
        }

        if(!isValidLink.test(data.logoLink)){      //logolink validation
            return res.status(400).send({status:false,message:"Please enter valid logoLink"})
        }
        

        const collegeCreation = await collegeModel.create(data)
        return res.status(201).send({ status: true, data: collegeCreation })



    }

    catch (err){
    return res.status(500).send({ status: false, error: err.message })
    }
}


const getCollegeDetails = async function(req,res){
    try{
        let data =req.query.collegeName   //getting the data from query

        if(!data) return res.status(400).send({status:true,message:"please provide query"})

        let saveId = await collegeModel.findOne({name:data,isDeleted:false}).select({name:1,fullName:1,logoLink:1})    // find the college by the condition
        if(!saveId) return res.status(404).send({status:false,message:"college Not Found"})
       
       let intrested = await internModel.find({collegeId:saveId._id, isDeleted:false}).select({name:1,email:1,mobile:1})  //find the college intern by condition
       if(intrested.length !==0) {
             let info = {                 
                 name : saveId.name,
               fullName : saveId.fullName,
               logoLink : saveId.logoLink,
               interests: intrested
           }
           return res.status(200).send({status:true ,data:info})
       }
        


    }catch(err){
        return res.status(500).send({status:false , error:err.message})
    }
    
}












module.exports.createColleges = createColleges
module.exports.getCollegeDetails =getCollegeDetails