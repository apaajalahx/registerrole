module.exports = {
    host: process.env.MAIL_HOST,
    port: process.env.MAIL_PORT,
    user: process.env.MAIL_USER,
    pass: process.env.MAIL_PASS,
    from: process.env.MAIL_FROM || 'noreply@example.com',
    name: process.env.FROM_MAIL || 'Register Users Example.'
}