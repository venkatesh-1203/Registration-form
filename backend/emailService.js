const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
    host: process.env.EMAIL_HOST,
    port: process.env.EMAIL_PORT,
    secure: false, // true for 465, false for other ports
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
    },
});

const sendConfirmationEmail = async (to, registrationData) => {
    const { name, email, phone, college, department, year, id } = registrationData;

    const mailOptions = {
        from: `"Event Registration" <${process.env.EMAIL_FROM}>`,
        to: to,
        subject: 'Registration Confirmation - Event Registration',
        html: `
        <!DOCTYPE html>
        <html>
        <head>
            <meta charset="utf-8">
            <title>Registration Confirmation</title>
            <style>
                body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
                .container { max-width: 600px; margin: 0 auto; padding: 20px; }
                .header { background: linear-gradient(135deg, #0f9bfe, #4a68ff); color: white; padding: 20px; text-align: center; border-radius: 8px 8px 0 0; }
                .content { background: #f9f9f9; padding: 20px; border-radius: 0 0 8px 8px; }
                .details { background: white; padding: 15px; border-radius: 5px; margin: 15px 0; }
                .footer { text-align: center; margin-top: 20px; color: #666; font-size: 12px; }
            </style>
        </head>
        <body>
            <div class="container">
                <div class="header">
                    <h1>🎉 Registration Confirmed!</h1>
                    <p>Thank you for registering for our event</p>
                </div>
                <div class="content">
                    <h2>Hello ${name}!</h2>
                    <p>Your registration has been successfully completed. Here are your registration details:</p>

                    <div class="details">
                        <h3>Registration Details:</h3>
                        <p><strong>Registration ID:</strong> ${id}</p>
                        <p><strong>Name:</strong> ${name}</p>
                        <p><strong>Email:</strong> ${email}</p>
                        <p><strong>Phone:</strong> ${phone}</p>
                        <p><strong>College:</strong> ${college}</p>
                        <p><strong>Department:</strong> ${department}</p>
                        <p><strong>Year:</strong> ${year}</p>
                    </div>

                    <p>If you have any questions, please don't hesitate to contact us.</p>

                    <p>Best regards,<br>Event Registration Team</p>
                </div>
                <div class="footer">
                    <p>This is an automated email. Please do not reply to this message.</p>
                </div>
            </div>
        </body>
        </html>
        `,
    };

    try {
        const info = await transporter.sendMail(mailOptions);
        console.log('Confirmation email sent:', info.messageId);
        return { success: true };
    } catch (error) {
        console.error('Email sending failed:', error);
        return { success: false, error: error.message };
    }
};

module.exports = {
    sendConfirmationEmail,
};