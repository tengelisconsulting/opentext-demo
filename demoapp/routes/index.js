const express = require('express');
const helmet = require("helmet");
const { searchProducts } = require("../db/products");

const app = express();
const router = express.Router();

app.use(helmet());

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

router.get('/products', function(req, res, next) {
  searchProducts(req, res, next);
});

module.exports = router;
