const express = require('express');
const app = express();

const fortunes = [
    "Conquer your fears or they will conquer you.",
    "Rivers need springs.",
    "Do not fear what you don't know.",
    "You will have a pleasant surprise.",
    "Whenever possible, keep it simple.",
];

// set up handlebars view engine
var handlebars = require('express3-handlebars')
    .create({ defaultLayout:'main' });
app.engine('handlebars', handlebars.engine);
app.set('view engine', 'handlebars');

app.set('port', process.env.PORT || 3000);

app.use(express.static(__dirname + './../public'));

app.listen(app.get('port'), () => {
    console.log(`Server started on http://localhost:${app.get('port')}.`)
});

app.get('/', (req, res) => {
    res.render('home');
});

app.get('/about', (req, res) => {
    const selectedFortune = fortunes[Math.floor(Math.random() * fortunes.length)];
    res.render('about', { fortune: selectedFortune });
});

// custom 404
app.use((req, res) => {
    res.status(404);
    res.render('404');
});

// custom 505
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500);
    res.render('500');
});
