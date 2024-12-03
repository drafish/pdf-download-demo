var express = require('express');
var path = require('path');
var logger = require('morgan');

var receiptRouter = require('./routes/receipt');
var receiptTradeRouter = require('./routes/receipt-trade');
var receiptFundsRouter = require('./routes/receipt-funds');

var app = express();

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use('/', receiptRouter);
app.use('/', receiptTradeRouter);
app.use('/', receiptFundsRouter);

module.exports = app;
