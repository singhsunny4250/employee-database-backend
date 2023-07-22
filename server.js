const express = require('express');
const mysql = require('mysql2');
const cors = require('cors');
const bodyParser = require('body-parser');
const router = require('./router'); 

const app = express();
const port = process.env.PORT || 3000;

app.use(cors());
app.use(bodyParser.json());

app.use('/api', router);

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
