const express = require('express');
const vhost = require('vhost');
const app = express();
const site = express.Router();
const siteRoutes = require('./routes/site');

app.disable('X-Powered-By');

// set up handlebars view engine
var handlebars = require('express3-handlebars')
    .create({
        defaultLayout:'main',
        helpers: {
            section: function(name, options){
                if(!this._sections) this._sections = {};
                this._sections[name] = options.fn(this);
                return null;
            }
        }
    });

app.engine('handlebars', handlebars.engine);

app.set('view engine', 'handlebars');

app.set('port', process.env.PORT || 8081);

app.use(vhost('site.*', site));


app.use((req, res, next) => {
    // create a domain for this request
    const domain = require('domain').create();
    // handle errors on this domain
    domain.on('error', function (err) {
        console.error('DOMAIN ERROR CAUGHT\n', err.stack);
        try {
            // failsafe shutdown in 5 seconds
            setTimeout(function () {
                console.error('Failsafe shutdown.');
                process.exit(1);
            }, 5000);
            // disconnect from the cluster
            var worker = require('cluster').worker;
            if (worker) worker.disconnect();
            // stop taking new requests
            server.close();
            try {
                // attempt to use Express error route
                next(err);
            } catch (err) {
                // if Express error route failed, try
                // plain Node response
                console.error('Express error mechanism failed.\n', err.stack);
                res.statusCode = 500;
                res.setHeader('content-type', 'text/plain');
                res.end('Server error.');
            }
        } catch (err) {
            console.error('Unable to send 500 response.\n', err.stack);
        }
    });
    // add the request and response objects to the domain
    domain.add(req);
    domain.add(res);
    // execute the rest of the request chain in the domain
    domain.run(next);
});

site.use((req, res, next) => {
    if (req.headers.authorization !== 'noix') {
        res.statusCode = 403;
        res.setHeader('content-type', 'text/plain');
        res.end('Forbidden!');
    } else {
        next();
    }
})

app.use(express.static(__dirname + './../public'));

app.listen(app.get('port'), () => {
    console.log(`Server started on http://localhost:${app.get('port')}.`)
});

app.use(function(req, res, next){
    res.locals.showTests = app.get('env') !== 'production' && req.query.test === '1';
    next();
});
   
site.use(require('csurf')());

site.use(function(req, res, next){
    res.locals._csrfToken = req.csrfToken();
    console.log(req.csrfToken());
    next();
});

siteRoutes(app);

// custom 404
app.use((req, res) => {
    res.status(404);
    res.render('404');
});

// custom 500
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).render('500');
});
