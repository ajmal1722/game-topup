import nodemailer from "nodemailer";
import dotenv from "dotenv";
dotenv.config();

export const sendPasswordResetEmail = async (email, token) => {
    const url = `${process.env.CLIENT_URL}/reset-password/${token}`;

    // Create transporter for local testing (Ethereal)
    const testAccount = await nodemailer.createTestAccount();

    const transporter = nodemailer.createTransport({
        host: "smtp.ethereal.email",
        port: 587,
        secure: false,
        auth: {
            user: testAccount.user,
            pass: testAccount.pass,
        },
    });

    const htmlContent = `
        <h2>Password Reset Request</h2>
        <p>You requested a password reset for your Game Topup account.</p>
        <p>
            <a href="${url}" style="background-color: #007bff; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px; display: inline-block;">
                Reset Password
            </a>
        </p>
        <p>Or copy this link: ${url}</p>
        <p style="color: #666; font-size: 12px;">
            This link expires in 15 minutes.<br>
            If you did not request this, please ignore this email.
        </p>
    `;

    const info = await transporter.sendMail({
        from: '"Game Topup" <noreply@gametopup.com>',
        to: email,
        subject: "Password Reset Request",
        html: htmlContent,
    });
    

    // Log preview URL for development
    console.log("📧 Email sent! Preview URL:", nodemailer.getTestMessageUrl(info));

    return info;
};
