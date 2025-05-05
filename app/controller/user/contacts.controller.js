const ContactUs = require("../../models/contactus")


class contactcontroller{
    contactCreate= async(req,res) => {
        const {name,email,message,phone,subject} = req.body

        const newcontact =  new ContactUs({
            name,
            email,
            message,
            phone,
            subject
        })

        await newcontact.save()



        res.json({success:true,message:"Thank you for your contacting Us."})
    }
}

module.exports=new contactcontroller()