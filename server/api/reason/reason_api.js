const express = require('express');
const router = express.Router();
const models = require('./data_models_reason');
const data_models = new models();

router.post('/get_returnproducthd_reason_all',(req, res)=>{
    data_models.get_returnproducthd_reason_all(req, res);
});

router.post('/add_returnproducthd_reason', (req, res) => {
    data_models.add_returnproducthd_reason(req, res);
});

router.post('/update_returnproducthd_reason', (req, res) => {
    data_models.update_returnproducthd_reason(req, res);
});

router.post('/get_data_cancel_bill', (req, res) => {
    data_models.get_data_cancel_bill(req, res);
});

router.post('/save_data_cancel_bill', (req, res) => {
    data_models.save_data_cancel_bill(req, res);
});

router.post('/updateCancelBillData', (req, res) => {
    data_models.updateCancelBillData(req, res);
});



module.exports = router;
