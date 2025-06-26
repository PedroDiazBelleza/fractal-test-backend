const express = require('express');
const ProductsController = require('../controllers/ProductsController');

const router = express.Router();
const productsController = new ProductsController();

router.get('/', productsController.findAll);
router.get('/:id', productsController.findById); 
router.get('/findByOrderId/:id', productsController.findByOrderId); 
router.post('/', productsController.create);
router.put('/:id', productsController.update);
router.delete('/:id', productsController.delete);

module.exports = router;
