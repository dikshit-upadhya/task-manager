const sendgrid = require('@sendgrid/mail')
const mailKey = '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 '
sendgrid.setApiKey(mailKey)

const sendWelcomeEmail = (email, name) => {
    sendgrid.send({
        to: email,
        from: 'diksupadhya1234@gmail.com',
        subject: 'Welcome Email :-)',
        text: `Welcome to use the task app ${name}, hope that you like the use of this task app`
    })
}

const sendCancelationEmail = (email, name) => {
    sendgrid.send({
        to: email,
        from: 'diksupadhya1234@gmail.com',
        subject: 'Cancelation Email!',
        text: `Sad to see you go ${name}, hope to see you again soon!`
    })
}

module.exports = {
    sendWelcomeEmail,
    sendCancelationEmail
}