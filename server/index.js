// server/index.js
require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');

const productsRouter = require('./routes/products');
const ordersRouter = require('./routes/orders');
const leadsRouter = require('./routes/leads');
const servicesRouter = require('./routes/services');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, '..', 'public')));

app.use('/api/products', productsRouter);
app.use('/api/orders', ordersRouter);
app.use('/api/leads', leadsRouter);
app.use('/api/services', servicesRouter);

app.get('/health', (req, res) => res.json({ status: 'ok' }));

app.listen(PORT, () => {
  console.log(`ShepherdTech server running on port ${PORT}`);
});
