
module.exports = (site) => {
    
    site.get('/', (req, res) => {
        res.render('home');
    });
    
    site.get('/', (req, res) => {
        res.render('about');
    })
    
    site.get('/about', (req, res) => {
        const { getFortune } = require('../lib/fortune');
        res.render('about', { fortune: getFortune() });
    });
    
    site.get('/newsletter', (req, res) => {
        res.render('newsletter');
    });
    
    site.get('/request/headers', function(req,res){
        console.log(req.params)
        console.log(req.query)
        console.log(req.body)
        console.log(req.route)
        console.log(req.cookies)
        console.log(req.signedCookies)
        console.log(req.accepted)
        res.set('Content-Type','text/plain');
        var s = '';
        for(var name in req.headers) s += name + ': ' + req.headers[name] + '\n';
        res.send(s);
    });
    
    site.get('/contest/vacation-photo', (req,res) => {
        const now = new Date();
        res.render('contest/vacation-photo', {
            year: now.getFullYear(),
            month: now.getMonth(),
        });
    });
    
    site.get('/fail', () => {
        throw new Error('Nope!');
    });
    
    site.get('/epic-fail', () => {
        process.nextTick(() => {
            throw new Error('Kaboom!');
        });
    });
}