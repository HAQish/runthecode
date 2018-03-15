const express = require('express');
const path = require('path');
const mongoose = require('mongoose');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');


let app = express();

let PORT = process.env.PORT || 3000;

// Parses JSON, urls and cookies
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());

// Serves static files to client
app.use(express.static(path.join(__dirname, '../client/dist')));



//creates server, function runs once upon creation
app.listen(PORT, function() {
  console.log(`listening on port ${PORT}`);
});


//jasmine, mocha
//travisCI
//