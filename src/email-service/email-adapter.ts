import * as nodemailer from 'nodemailer';
import { google } from 'googleapis';
const OAuth2 = google.auth.OAuth2;

const clientId =
  '328302860494-kdbj3h233ut5g5t5jg47raivoovbl3lo.apps.googleusercontent.com';
const clientSecret = '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';
const refreshToken =
  '1//04Knk1Rvmn5AlCgYIARAAGAQSNwF-L9Irl5iV-JxLH0cPDVLg8ib43zR1IpM2DMyc3ZHk8K_jPsBMVMS3Ir3BsoXHlVZx_c0jBqc';

const myOAuth2Client = new OAuth2(
  clientId,
  clientSecret,
  'https://developers.google.com/oauthplayground',
);

myOAuth2Client.setCredentials({
  refresh_token: refreshToken,
});

const myAccessToken = myOAuth2Client.getAccessToken();

export const EmailAdapter = {
  async sendEmail(email: string, subject: string, message: string) {
    const transport = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        type: 'OAuth2',
        user: 'den9182@gmail.com', //your gmail account you used to set the project up in google cloud console"
        clientId: clientId,
        clientSecret: clientSecret,
        refreshToken: refreshToken,
        accessToken: myAccessToken, //access token variable we defined earlier
      },
    });

    try {
      const info = await transport.sendMail({
        from: `Denis <den9182@gmail.com>`,
        to: email,
        subject: subject,
        html: message,
      });

      return info;
    } catch (e) {
      console.log(e);
    }
  },
};
