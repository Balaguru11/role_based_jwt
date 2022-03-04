const nodemailer = require('nodemailer');
const { google } = require('googleapis');

// OAuth from Google
const OAuth2Client = new google.auth.OAuth2(
    process.env.OAUTH_CLIENTID,
    process.env.OAUTH_CLIENT_SECRET,
    process.env.REDIRECT_URI
);

OAuth2Client.setCredentials({
    refresh_token: process.env.OAUTH_REFRESH_TOKEN,
  });
  
  async function sendMail(mailSetup) {
    try {
      const accessToken = await OAuth2Client.getAccessToken();
  
      const transport = nodemailer.createTransport({
        service: "gmail",
        auth: {
          type: "OAuth2",
          user: process.env.MAIL_USERNAME,
          accessToken: accessToken,
          clientId: process.env.OAUTH_CLIENTID,
          clientSecret: process.env.OAUTH_CLIENT_SECRET,
          refreshToken: process.env.OAUTH_REFRESH_TOKEN,
        },
      });
  
      const result = transport.sendMail(mailSetup);
      return result;
    } catch (err) {
      return err;
    }
  }
  
  sendMail()
    .then((result) => {
      console.log("Email has been sent.", result);
    })
    .catch((err) => console.log(err.message));
  
  module.exports = sendMail;