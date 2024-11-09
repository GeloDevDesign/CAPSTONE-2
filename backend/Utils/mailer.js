import nodemailer from 'nodemailer';
import dotenv from 'dotenv';

dotenv.config();

const transporter = nodemailer.createTransport({
  host: 'smtp.gmail.com',
  port: 465,
  secure: true,
  auth: {
    user: process.env.EMAIL,
    pass: process.env.EMAIL_PASSWORD,
  },
});
 

const sendOTPEmail = async (email, otp) => {
  const mailOptions = {
    from: process.env.EMAIL,
    to: email,
    subject: 'Password Reset OTP - Nid\'s Balot sa Dahon',
    text: `Your OTP for password reset is: ${otp}. This code will expire in 15 minutes.`,
    html: `
        <!DOCTYPE html>
        <html>
        <head>
            <meta charset="UTF-8">
            <style>
                /* General styling for high contrast */
                body, p, h1, h2 {
                    color: #333333; 
                }
                .otp-container {
                    background-color: #e0e7ff; /* Light blue for better visibility */
                    padding: 20px;
                    text-align: center;
                }
                .otp-code {
                    font-family: monospace;
                    font-size: 32px;
                    color: #111827;
                    font-weight: bold;
                    letter-spacing: 5px;
                }
                .footer-text {
                    color: #555555;
                    font-size: 14px;
                    width: 100%;
                }
            </style>
        </head>
        <body style="margin: 0; padding: 0; font-family: Arial, sans-serif; background-color: #ffffff;">
            <table width="100%" border="0" cellspacing="0" cellpadding="0">
                <tr>
                    <td align="center" style="padding: 20px 0; background-color: #052e16;">
                        <h1 style="color: #fde047; margin: 0; font-size: 20px;">Nid's Balot sa Dahon</h1>
                    </td>
                </tr>
                <tr>
                    <td align="center">
                        <table width="600" border="0" cellspacing="0" cellpadding="0" style="background-color: #ffffff; margin: 20px 0;">
                            <tr>
                                <td style="padding: 40px 30px;">
                                    <h2 style="color: #333333; margin: 0 0 20px; font-size: 20px;">Password Reset Request</h2>
                                    <p style="color: #666666; margin: 0 0 25px; line-height: 1.5;">We received a request to reset your password. Use the OTP code below to complete your password reset:</p>
                                    
                                    <div class="otp-container">
                                        <span class="otp-code">${otp}</span>
                                    </div>
                                    
                                    <p style="color: #666666; margin-top:10px; line-height: 1.5;">This code will expire in <strong>15 minutes</strong>.</p>
                                </td>
                            </tr>
                            <tr>
                                <td style="background-color: #f8f8f8; padding: 20px 30px;">
                                    <p class="footer-text" style="text-align: center;">
                                        &copy; ${new Date().getFullYear()} Nid's Balot sa Dahon. All rights reserved.
                                    </p>
                                </td>
                            </tr>
                        </table>
                    </td>
                </tr>
            </table>
        </body>
        </html>
    `
};
  await transporter.sendMail(mailOptions);
};

export default sendOTPEmail;