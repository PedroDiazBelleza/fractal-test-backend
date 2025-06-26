const express = require('express');
const OrdersController = require('../controllers/OrdersController');

const router = express.Router();
const ordersController = new OrdersController();

router.get('/', ordersController.findAll);
router.get('/:id', ordersController.findById); 
router.post('/', ordersController.create);
router.post('/createDetails', ordersController.createDetails);
router.put('/:id', ordersController.update);
router.put("/updateDetails", ordersController.updateDetails);
router.patch("/changeStatus/:id", ordersController.changeStatus);
router.delete('/:id', ordersController.delete);

module.exports = router;
