const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const { extend } = require('joi');

require('dotenv').config();

const app = express();
const port = process.env.PORT || 5000;

//CONNECT TO DB
mongoose.connect(process.env.ATLAS_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true
})
.then( () => console.log("Connected to DB!"))
.catch( error => console.log("DB connectection error: " + error.message));

//MIDDLEWARE
app.use(express.json());
app.use(express.urlencoded({extended: true}));

//ROUTE MIDDLEWARE
app.use('/api/posts', require('./routes/posts'));
app.use('/api/user', require('./routes/authRoutes'));

//root route, will change later
app.get('/', (req, res) => {
    res.send("Whats up");
})

app.listen(port, () => {console.log(`The server is listing on port ${port}`);});