const nodemailer = require('nodemailer');

const transport = nodemailer.createTransport({
    host: "smtp.mailtrap.io",
    port: 2525,
    auth: {
      user: "849a09ae33dad2",
      pass: "fe5249aeffa720"
    }
});

const sendConfirmationMail = async (email, link) => {
    const message = {
        from: 'noreply@tiff.ro', // Sender address
        to: email, // List of recipients
        subject: 'Tiff Confirmation Mail', // Subject line
        html: `<!doctype html>
        <html ⚡4email>
          <head>
            <meta charset="utf-8">
          </head>
          <body>
            <img src="https://tiff.ro/sites/libraries/ckfinder/userfiles/images/logo_premii_tiff.jpg" width="50%" height="50%"/>
            <h1>You\'re so close to finishing having your account registered!</h1>
            <h2>Please click on this <a href="${link}">link</a> to confirm you e-mail address</h2>
          </body>
        </html>`,
    };
    
    transport.sendMail(message, function(err, info) {
        if (err) {
          console.log(err)
        } else {
          console.log(info);
        }
    });
}

//sendConfirmationMail('test@test.com', 'www.test.com')

module.exports = {
    sendConfirmationMail,
}