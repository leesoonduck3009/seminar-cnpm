import * as nodemailer from "nodemailer";
import dotenv from "dotenv";
dotenv.config;
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: "taskly.noreply@gmail.com",
    pass: "ofwb dhaz fgir beae",
  },
});
export const sendLoginEmail = async (email: string, url: string) => {
  try {
    await transporter.sendMail({
      from: `"Taskly Support Team " <taskly.noreply@gmail.com>`,
      to: email,
      subject: "Welcome to Taskly – Your Task Management Tool!",
      html: `<!DOCTYPE html>
        <html lang="en">
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>Welcome to Taskly</title>
            <style>
                body {
                    font-family: 'Arial', sans-serif;
                    background-color: #f4f4f4;
                    margin: 0;
                    padding: 0;
                    display: flex;
                    justify-content: center;
                    align-items: center;
                    height: 100vh;
                }
                .email-container {
                    background-color: #ffffff;
                    padding: 40px;
                    border-radius: 10px;
                    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
                    max-width: 500px;
                    text-align: center;
                    border-top: 6px solid #4CAF50; /* Taskly green color */
                }
                .email-container h2 {
                    color: #4CAF50;
                    font-size: 2rem;
                    margin-bottom: 15px;
                }
                .email-container p {
                    color: #333;
                    font-size: 1.1rem;
                    margin-bottom: 20px;
                }
                .button {
                    display: inline-block;
                    background-color: #007BFF;
                    color: #ffffff;
                    text-decoration: none;
                    padding: 15px 25px;
                    border-radius: 8px;
                    font-size: 1.1rem;
                    font-weight: bold;
                    box-shadow: 0 4px 10px rgba(0, 123, 255, 0.3);
                    transition: background-color 0.3s ease, box-shadow 0.3s ease;
                }
                .button:hover {
                    background-color: #0056b3;
                    box-shadow: 0 6px 12px rgba(0, 123, 255, 0.5);
                }
                .footer-text {
                    font-size: 0.85rem;
                    color: #888;
                    margin-top: 25px;
                }
                .footer-text a {
                    color: #4CAF50;
                    text-decoration: none;
                }
                .footer-text a:hover {
                    text-decoration: underline;
                }
            </style>
        </head>
        <body>
    
            <div class="email-container">
                <h2>Welcome to Taskly!</h2>
                <p>We're excited to have you on board. Manage your tasks effectively and stay organized with Taskly. Click the button below to log in and get started!</p>
    
                <a href="${url}" class="button">Login to Taskly</a>
    
                <div class="footer-text">
                    <p>Need assistance? <a href="mailto:support@taskly.com">Contact Taskly Support</a></p>
                </div>
            </div>
    
        </body>
        </html>`,
    });
  } catch (e) {
    console.log(e);
  }
  console.log(`From ${process.env.EMAIL} To ${email}`);
};
export const sendMailOTP = async (email: string, OTP: string) => {
  await transporter.sendMail({
    from: `"Taskly Support Team " <${process.env.EMAIL}>`,
    to: email,
    subject: "This is your OTP Code",
    html:
      '<div style="font-family: Helvetica, Arial, sans-serif; ' +
      'min-width: 1000px; overflow: auto; line-height: 2">' +
      '  <div style="margin: 50px auto; width: 70%; padding: 20px 0">' +
      '    <div style="border-bottom: 1px solid #eee">' +
      '      <a href="" style="font-size: 1.4em; color: #007BFF; text-decoration: none; ' +
      ' font-weight: 600">Taskly</a>' +
      "    </div>" +
      '    <p style="font-size: 1.1em">Xin chào,</p>' +
      "    <p>Đây là thư tự động gửi vào email. " +
      "Vui lòng không trả lời thư này.<br> Dưới đây là mã OTP của bạn!</p>" +
      '    <h2 style="background: #007BFF; margin: 0 auto; width: max-content; ' +
      'padding: 0 10px; color: #fff; border-radius: 4px;">' +
      `      ${OTP}` +
      "    </h2>" +
      '    <p style="font-size: 0.9em;">Xin cảm ơn,<br />Taskly</p>' +
      '    <hr style="border: none; border-top: 1px solid #eee" />' +
      '    <div style="float: right; padding: 8px 0; color: #aaa; font-size: 0.8em;' +
      ' line-height: 1; font-weight: 300">' +
      "    </div>" +
      "  </div>" +
      "</div>",
  });
};
