const express = require('express');
const app = express();
const cors = require('cors');
require('dotenv').config();

// const PORT = 8000;

app.use(cors());
app.use(express.json());

require('./routes/v1/routes')(app);

app.listen(process.env.PORT, () => {
    console.log(`App is running on ${process.env.PORT}`);
});

module.exports = app;
