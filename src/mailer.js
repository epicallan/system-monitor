const nodemailer = require('nodemailer');
const { user, pass } = require('./configs/config');

const transporter = nodemailer.createTransport(`smtps://${user}%40gmail.com:${pass}@smtp.gmail.com`);

const mailOptions = (message, { emails, link }) => ({
  from: '"datahub system monitor server" <epicallan.al@gmail.com>', // sender address
  to: emails.join(','), // list of receivers
  subject: `Domain Status for ${link}`, // Subject line
  text: message, // plaintext body
  html: `<p>${message}</p>` // html body
});

function emailer(msg, domain) {
  // we dont send emails while in development environment
  if (process.env.NODE_ENV === 'development') return console.log(domain.link, `in mailer: ${msg}`);
  const options = mailOptions(msg, domain);
  // send mail with defined transport object
  return transporter.sendMail(options, (error, info) => {
    if (error) console.log(error);
    console.log(`Message sent: ${info.response}`);
  });
}
module.exports = emailer;
