const express = require('express');
const { json } = require('express/lib/response');
const router = express.Router();
const models = require('./data_models_deposit');
const data_models = new models();


router.post('/get_product_deposit',(req, res)=>{
    data_models.get_product_deposit(req, res);
});

router.post('/get_deposit_codeDoc', (req, res) => {
    data_models.get_deposit_codeDoc(req, res);
});

router.post('/add_deposit', (req, res) => {
    data_models.add_deposit(req, res);
});

router.post('/get_deposit_transections', (req, res) => {
    data_models.get_deposit_transections(req, res);
});

router.post('/cancel_deposit_document', (req, res) => {
    data_models.cancel_deposit_document(req, res);
});

router.post('/get_depositHD', (req, res) => {
    data_models.get_depositHD(req, res);
});

router.post('/get_depositDT', (req, res) => {
    data_models.get_depositDT(req, res);
});

router.post('/get_deposittransfer', (req, res) => {
    data_models.get_deposittransfer(req, res);
});

router.post('/get_depositcreditcard', (req, res) => {
    data_models.get_depositcreditcard(req, res);
});

router.post('/update_deposit_print_bill', (req, res) => {
    data_models.update_deposit_print_bill(req, res);
});

router.post('/add_print_deposit', (req, res) => {
    data_models.add_print_deposit(req, res);
});


module.exports = router;
