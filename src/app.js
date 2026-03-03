const express = require('express');
const routes = require('./routes');
const errorHandler = require('./middleware/errorHandler');
const logger = require('./middleware/logger');

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(logger);
app.use('/uploads', express.static('uploads'));

app.use('/api', routes);

app.use((req, res) => {
  res.status(404).json({ success: false, message: 'Không tìm thấy endpoint' });
});

app.use(errorHandler);

module.exports = app;