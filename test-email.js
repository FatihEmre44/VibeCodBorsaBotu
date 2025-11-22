import nodemailer from 'nodemailer';
import dotenv from 'dotenv';
import chalk from 'chalk';

dotenv.config();

console.log(chalk.blue('📧 Testing Email Configuration...'));
console.log(`User: ${process.env.EMAIL_USER}`);
console.log(`To: ${process.env.EMAIL_TO}`);

const transporter = nodemailer.createTransport({
    service: process.env.EMAIL_SERVICE || 'gmail',
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
    }
});

async function sendTestEmail() {
    try {
        console.log('Attempting to send email...');
        const info = await transporter.sendMail({
            from: process.env.EMAIL_USER,
            to: process.env.EMAIL_TO || process.env.EMAIL_USER,
            subject: '✅ BorsaBot Test Email',
            text: 'If you see this, your email configuration is working correctly!'
        });
        console.log(chalk.green('✅ Email sent successfully!'));
        console.log('Message ID:', info.messageId);
    } catch (error) {
        console.error(chalk.red('❌ Email failed to send.'));
        console.error(error);
        console.log(chalk.yellow('\nTroubleshooting Tips:'));
        console.log('1. Check if EMAIL_USER and EMAIL_PASS are correct in .env');
        console.log('2. If using Gmail, make sure you are using an **App Password**, not your login password.');
        console.log('   Go to: https://myaccount.google.com/apppasswords');
    }
}

sendTestEmail();
