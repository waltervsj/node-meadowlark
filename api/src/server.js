const express = require('express');
const cors = require('cors')
const formidable = require('formidable');
const morganBody = require('morgan-body');
const https = require('https');
const fs = require('fs');

const app = express();

const urlEncoded = express.urlencoded({ extended: true});

app.set('port', process.env.PORT || 8090);

app.use(urlEncoded);
app.use(express.json());
app.use(cors());

app.use((req, res, next) => {
    const cluster = require('cluster');
    if(cluster.isWorker) console.log(`Worker ${cluster.worker.id} received request`);
    next();
});

morganBody(app);

function startServer() {

    const options = {
        key: fs.readFileSync('D:/Projetos/nodejs/meadowlark/security/ssl/meadowlark.pem'),
        cert: fs.readFileSync('D:/Projetos/nodejs/meadowlark/security/ssl/meadowlark.crt'),
    }

    https.createServer(options, app).listen(app.get('port'), () => {
        console.log(`[${app.get('env').toUpperCase()}] Running API on localhost: ${app.get('port')}`);
    });

}

if(require.main === module){
    // application run directly; start app server
    startServer();
} else {
    // application imported as a module via "require": export function
    // to create server
    module.exports = startServer;
}

app.post('/api/process', (req, res) => {
    console.log(`Is XHR? ${req.xhr}`)
    console.log(req.accepts('json'))
    
    // console.log(`Form (from querystring): ${req.query.form}`);
    // console.log(`CSRF token (from hidden form field): ${req.body._csrf}`);
    // console.log(`Name (from input): ${req.body.name}`);
    // console.log(`E-mail (from input): ${req.body.email}`);
    // res.status(200).json({ok: true});
    
    if(req.xhr || req.accepts('json,html')==='json'){
        // if there were an error, we would send { error: 'error description' }
        res.send({ success: true });
    } else {
        // if there were an error, we would redirect to an error page
        res.redirect('google.com')
    }
});

app.post('/api/contest/vacation-photo/:year/:month', (req, res) => {
    var form = new formidable.IncomingForm();
    form.parse(req, (err, fields, files) => {
    if(err) return res.redirect(303, '/error');
        console.log('received fields: ');
        console.log(fields);
        console.log('received files:');
        console.log(files);
        res.send(true);
        // res.redirect(303, '/thank-you');
    });
});

var tours = [
    { id: 0, name: 'Hood River', price: 99.99 },
    { id: 1, name: 'Oregon Coast', price: 149.95 },
];

app.get('/api/tours', ({ res }) => {
    res.json(tours);
});

app.post('/api/mail/:to', (req, res) => {
    const nodemailer = require('nodemailer');
    const credentials = require('./lib/mailCredentials');

    // login
    const mailTransport = 
        nodemailer.createTransport(
            `smtps://
            ${credentials.gmail.user}
            :
            ${req.body.password}
            @smtp.gmail.com`
        );
    
    const mailOptions = {
        from: '"Meadowlark Travel" <info@meadowlarktravel.com>',
        subject: req.body.subject,
        to: req.params.to,
        text: req.body.text,
    }

    mailTransport.sendMail(mailOptions, (err) => {
        if (err) console.error(`Unable to send e-mail: ${err}`);
    });

    res.sendStatus(204);
});
   