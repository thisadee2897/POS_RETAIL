const express = require('express');
const { json } = require('express/lib/response');
const router = express.Router();
const models = require('./data_models_payment');
const data_models = new models();

router.post('/get_category_data', (req, res) => {
    data_models.get_category_data(req, res);
});

router.post('/add_category_data', (req, res) => {
    data_models.add_category_data(req, res);
});

router.post('/update_whtcategory_data', (req, res) => {
    data_models.update_whtcategory_data(req, res);
});

router.post('/get_partner_data', (req, res) => {
    data_models.get_partner_data(req, res);
});

router.post('/update_partner_data_edit', (req, res) => {
    data_models.update_partner_data_edit(req, res);
});

router.post('/add_partner_data', (req, res) => {
    data_models.add_partner_data(req, res);
});

router.post('/get_voucher_data', (req, res) => {
    data_models.get_voucher_data(req, res);
});

router.post('/add_voucher_data', (req, res) => {
    data_models.add_voucher_data(req, res);
});

router.post('/update_voucher_data', (req, res) => {
    data_models.update_voucher_data(req, res);
});

router.post('/get_cardtype_data', (req, res) => {
    data_models.getCardTypeData(req, res);
});

router.post('/update_cardtype_data', (req, res) => {
    data_models.updateCardTypeData(req, res);
});

router.post('/add_cardtype_data', (req, res) => {
    data_models.addCardTypeData(req, res);
});

module.exports = router;
