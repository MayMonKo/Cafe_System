require('dotenv').config();
const app = require('./app');
const pool = require('./config/db');

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`🐻 Bear's Bakery backend running on port ${PORT}`);
});
