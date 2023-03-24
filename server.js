require('dotenv').config();

// importing dependencies
const express = require('express');
const cors = require('cors');

// importing custom middlewares
const connectDB = require('./src/utils/database');
// const timestamp = require('./src/utils/timestamp'); // use this for timestamp purpose - timestamp()

// global variables
const app = express();
const port = process.env.PORT;

// cors settings
var corsOptions = {
    origin: '*',
    methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
    optionsSuccessStatus: 200 // some legacy browsers (IE11, various SmartTVs) choke on 204
}

// middlewares
app.use(cors(corsOptions));
app.use(express.json({limit: "50mb"}));
app.use(express.urlencoded({limit:"50mb", extended: false }));    

// initialzing database
// connectDB();

// test Router
app.get('/', (req, res) => {
    let document = `https://documenter.getpostman.com/view/18344806/UVkgxe87`
    res.send({
        "mesage": `Go to this URL to view the API Documentation -> [ ${document} ] `
    });
});

// main routes

app.use('/api/player', require('./src/routers/player'));
app.use('/api/bot', require('./src/routers/bots'));
app.use('/api/banner', require('./src/routers/banner'));
app.use('/api/state', require('./src/routers/state'));
app.use('/api/tournament-category', require('./src/routers/tournamentCategory'));
app.use('/api/testimonial', require('./src/routers/testimonials'));
app.use('/api/admin', require('./src/routers/admin'));
app.use('/api/reported-problems', require('./src/routers/reportedProblems'));
app.use('/api/games', require('./src/routers/games'));
app.use('/api/tournament', require('./src/routers/tournament'));
app.use('/api/notification', require('./src/routers/offerNotification'));
app.use('/api/wallet', require('./src/routers/wallet'));

// exposing the application
app.listen(port, () => {
    connectDB();
    console.log(`server is up and running on ${port}`);
});