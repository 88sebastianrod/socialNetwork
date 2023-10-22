require('dotenv').config();
const path = require('path');

const express = require('express');
const cors = require('cors');

const { dbConnection } = require('./database/config');
const app = express();
app.use( cors() );
app.use( express.json() );

dbConnection();

// Public directory
app.use( express.static('public') );

// Routes
app.use( '/api/users', require('./routes/users') );
app.use( '/api/thoughts', require('./routes/thoughts') );


app.get('*', (req, res) => {
    res.sendFile( path.resolve( __dirname, 'public/index.html' ) );
});

app.listen( process.env.PORT, () => {
    console.log('Server is running on port ' + process.env.PORT );
});

