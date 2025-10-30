require('dotenv').config();
const express = require('express');
const cors = require('cors');
const codingRoutes = require('./routes/codingroutes');

const app = express();
app.use(cors());

app.use('/api', codingRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
