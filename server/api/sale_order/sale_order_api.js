const express = require('express');
const router = express.Router();
const models = require('./data_models_sale_order');
const data_models = new models();

router.post('/get_orderhd_docuno', (req, res) => {
    data_models.fetchOrderHdDocuno(req, res);
});

router.post('/save_orderhd_data',(req, res)=>{
    data_models.saveOrderHdData(req, res);
});

router.post('/get_orderhd_data',(req, res)=>{
    data_models.fetchOrderHdData(req, res);
});

router.post('/get_orderhd_id_for_edit',(req, res)=>{
    data_models.fetcSaleOrderForEdit(req, res);
});

router.post('/update_orderhd_data',(req, res)=>{
    data_models.updateHdData(req, res);
});

router.post('/get_sale_order_data',(req, res)=>{
    data_models.getSaleOrderData(req, res);
});


module.exports = router;
