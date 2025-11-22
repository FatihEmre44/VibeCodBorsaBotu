import YahooFinance from 'yahoo-finance2';
import chalk from 'chalk';
import nodemailer from 'nodemailer';
import dotenv from 'dotenv';

dotenv.config();

const yahooFinance = new YahooFinance();

const symbols = process.env.SYMBOLS ? process.env.SYMBOLS.split(',') : ['THYAO.IS', 'GARAN.IS'];
const interval = process.env.UPDATE_INTERVAL || 60000;

// Email Transporter
const transporter = nodemailer.createTransport({
    service: process.env.EMAIL_SERVICE || 'gmail',
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
    }
});
const lastAlertTime = {};
const ALERT_COOLDOWN = 60 * 60 * 1000; // 1 hour
async function sendEmail(symbol, price, change, alertType) {
    if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) return;

    const now = Date.now();
    if (lastAlertTime[symbol] && (now - lastAlertTime[symbol] < ALERT_COOLDOWN)) {
        return;
    }
    const mailOptions = {
        from: process.env.EMAIL_USER,
        to: process.env.EMAIL_TO || process.env.EMAIL_USER,
        subject: `🚨 BorsaBot Alert: ${symbol} ${alertType}`,
        text: `Stock: ${symbol}\nPrice: ${price.toFixed(2)}\nChange: ${change.toFixed(2)}%\n\n${alertType}`
    };

    try {
        await transporter.sendMail(mailOptions);
        console.log(chalk.magenta(`📧 Email sent for ${symbol}`));
        lastAlertTime[symbol] = now;
    } catch (error) {
        console.error(chalk.red(`Error sending email: ${error.message}`));
    }
}

console.log(chalk.blue.bold('🇹🇷 Turkish Borsa Bot Started...'));
console.log(chalk.gray(`Tracking: ${symbols.join(', ')}`));
console.log(chalk.gray(`Update Interval: ${interval}ms`));
console.log('-'.repeat(50));

async function fetchPrices() {
    console.log(chalk.yellow(`\n[${new Date().toLocaleTimeString()}] Fetching data...`));

    for (const symbol of symbols) {
        try {
            const quote = await yahooFinance.quote(symbol);
            const price = quote.regularMarketPrice;
            const change = quote.regularMarketChangePercent;
            const color = change >= 0 ? chalk.green : chalk.red;
            const arrow = change >= 0 ? '🔼' : '🔽';

            let alert = '';
            if (Math.abs(change) > 1) {
                const alertType = change >= 0 ? 'SURGE > 1%' : 'DROP > 1%';
                alert = change >= 0
                    ? chalk.bgGreen.black.bold(` 🚀 ${alertType} `)
                    : chalk.bgRed.white.bold(` 📉 ${alertType} `);
                await sendEmail(symbol, price, change, alertType);
            }
            console.log(
                `${chalk.bold(symbol.padEnd(10))} ` +
                `Price: ${chalk.white(price.toFixed(2))} TRY ` +
                color(`${arrow} ${change.toFixed(2)}%`) +
                alert
            );
        } catch (error) {
            console.error(chalk.red(`Error fetching ${symbol}: ${error.message}`));
        }
    }
}

// Initial fetch
fetchPrices();

// Interval fetch
// Interval fetch
const intervalId = setInterval(fetchPrices, interval);

async function sendSystemNotification(subject, message) {
    if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) return;

    const mailOptions = {
        from: process.env.EMAIL_USER,
        to: process.env.EMAIL_TO || process.env.EMAIL_USER,
        subject: subject,
        text: message
    };

    try {
        await transporter.sendMail(mailOptions);
        console.log(chalk.magenta(`📧 System Notification sent: ${subject}`));
    } catch (error) {
        console.error(chalk.red(`Error sending system email: ${error.message}`));
    }
}

async function handleExit(signal, error = null) {
    console.log(chalk.red.bold(`\n🛑 Bot stopping due to: ${signal}`));
    clearInterval(intervalId);

    let message = `The BorsaBot has stopped running.\nTime: ${new Date().toLocaleString()}\nReason: ${signal}`;
    if (error) {
        message += `\nError: ${error.message}\nStack: ${error.stack}`;
        console.error(error);
    }

    await sendSystemNotification(`🚨 BorsaBot Stopped: ${signal}`, message);
    process.exit(error ? 1 : 0);
}

// Handle graceful shutdown
process.on('SIGINT', () => handleExit('Manual Stop (SIGINT)'));
process.on('SIGTERM', () => handleExit('Termination Signal (SIGTERM)'));

// Handle uncaught errors
process.on('uncaughtException', (error) => handleExit('Uncaught Exception', error));
process.on('unhandledRejection', (reason, promise) => {
    handleExit('Unhandled Rejection', reason instanceof Error ? reason : new Error(String(reason)));
});

