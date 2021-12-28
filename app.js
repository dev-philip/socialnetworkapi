const express = require('express');
const app = express();
const mongoose = require('mongoose');
const morgan = require('morgan');
const cookieParser = require('cookie-parser');
const fs = require('fs');
const cors = require('cors');
const expressValidator = require('express-validator');
const dotenv = require('dotenv');
//use as middileware for bodyparser
app.use(express.json())
    //initialise .env file
dotenv.config();

const port = process.env.SERVER_PORT;
//connecting to db
mongoose.connect(process.env.MONGO_URI, {
        useNewUrlParser: true,
        useUnifiedTopology: true
    })
    .then(() => console.log('DB Connected'))

mongoose.connection.on('error', err => {
    console.log(`DB connection error: ${err.message}`);
})

//import routes
const postRoutes = require('./routes/post');
const authRoutes = require('./routes/auth');
const userRoutes = require('./routes/user');
//apiDocs
app.get('/', (req, res) => {
    fs.readFile('docs/apiDocs.json', (err, data) => {
        if (err) {
            res.status(400).json({
                error: err
            })
        }
        const docs = JSON.parse(data)
        res.json(docs)
    })
})

//use as middleware
app.use(morgan('dev'));
//use as middleware
app.use(cookieParser());
//use as middleware
app.use(expressValidator());
//use as middileware
app.use(cors());
//use as middleware
app.use('/', postRoutes);
app.use('/', authRoutes);
app.use('/', userRoutes);

app.use(function(err, req, res, next) {
    if (err.name === "UnauthorizedError") {
        res.status(401).json({
            error: "Unauthorized!"
        })
    }
})


app.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`)
})