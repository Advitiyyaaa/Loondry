const validator = require('validator')

const Validate = (data)=>{
    const mandatoryFields = ['firstName','emailId', 'password']
    const isAllowed = mandatoryFields.every((k)=>Object.keys(data).includes(k))
    if(!isAllowed)
        throw new Error("Fields Missing")
    if(!validator.isEmail(data.emailId)){
            throw new Error("Invalid Email")
        }
    // Allow only Bennett emails
    if (!data.emailId.toLowerCase().endsWith("@bennett.edu.in")) {
        throw new Error("Only college email addresses are allowed");
    }
    if(!validator.isStrongPassword(data.password)){
        throw new Error("Weak Password")
    }
    if((data.firstName.length<=2 || data.firstName.length>=40)){
        throw new Error("Name should be between 2-40 characters")
    }
}

module.exports=Validate;