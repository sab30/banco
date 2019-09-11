const express = require('express');
const path = require('path');

const app = express();

// Middleware
app.use(express.json({ extended: false }));

app.use('/api/users', require('./routes/api/users'));

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => console.log(`Server started on port ${PORT}`));
