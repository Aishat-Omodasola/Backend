import nodemailer from "nodemailer";
import pug from "pug";
import htmlToText from "html-to-text" 

new Email(user, url).sendWelcome();

export default class Email {
    constructor() {
        this.to = user.email;
        this.firstName = user.name.split(' ')[0]; // Assuming the user's name is "FirstName LastName"
        this.url = url;
        this.from = `Aishat O <${process.env.EMAIL_FROM}>`;
    }
    newTransport() {
        if (process.env.NODE_ENV === "production") {
            // Use SendGrid or another email provider in production
            return nodemailer.createTransport({
                service: 'SendGrid',
                auth: {
                    user: process.env.SENDGRID_USERNAME,
                    pass: process.env.SENDGRID_PASSWORD
                }
            });
        }
        // Default transport (like for development)
        return nodemailer.createTransport({
            host: process.env.EMAIL_HOST,
            port: process.env.EMAIL_PORT,
            auth: {
                user: process.env.EMAIL_USERNAME,
                pass: process.env.EMAIL_PASSWORD
            }
        });
    }
    
        //send the actual email
     async send(template, subject) {
         // 1) render HTML base on a pug template
         const html = pug.renderFile(
             `${__dirname}/..views/emails/${template}.pug`, 
             {
             firstName: this.firstName,
             url: this.url,
             subject
             }
         );

         // 2) Define email options
         const mailOptions = {
            from: this.from,
            to: this.to,
            subject,
            html,
            text: htmlToText.fromString(html)
        };

        // Create a transport and send email
        await this.newTransport().sendMail(mailOptions);
         
     }
     async sendWelcome() {
         await this.send("welcome", "Welcome to the examinations site!");
     }
     async sendPasswordReset() {
         await this.send(
             'passwordReset', 
             "Your password reset token (valid for only 10 minute)"
             );
     }
};