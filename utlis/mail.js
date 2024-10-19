const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  service:"gmail",
  auth: {
    user: "rw8.diwakar.us@gmail.com",
    pass: "dayyunenucyenjwx",
  },
});

// async..await is not allowed in global scope, must use a wrapper
async function SendOtp(useremail,htmltemplate) {
  // send mail with defined transport object
 try {
    const info = await transporter.sendMail({
        from: 'rw8.diwakar.us@gmail.com', // sender address
        to: useremail, // list of receivers
        subject: "VerificationEmail", // Subject line
        html:htmltemplate, // html body
      });
    
      console.log("Message sent: %s", info.messageId);
      return 
 } catch (error) {
    console.log(error);
    
 }
  // Message sent: <d786aa62-4e0a-070a-47ed-0b0666549519@ethereal.email>
}

module.exports=SendOtp
