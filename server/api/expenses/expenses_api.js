const express = require('express');
const { json } = require('express/lib/response');
const router = express.Router();
const models = require('./data_models_expenses');
const data_models = new models();


router.post('/get_expenses_data',(req, res)=>{
    data_models.getExpensesData(req, res);
});

router.post('/get_expenses_code', (req, res) => {
    data_models.getExpensesCode(req, res);
});

router.post('/get_expenses_codedoc', (req, res) => {
    data_models.getExpensesCodeDoc(req, res);
});

router.post('/add_expenses_data', (req, res) => {
    data_models.addExpensesData(req, res);
});

router.post('/get_expenses_edit', (req, res) => {
    data_models.getExpensesEdit(req, res);
});

router.post('/update_expenses_data', (req, res) => {
    data_models.updateExpensedata(req, res);
});

router.post('/get_expenses_hd', (req, res) => {
    data_models.getExpensesHD(req, res);
});

router.post('/get_expenses_hd_edit', (req, res) => {
    data_models.getExpensesHDEdit(req, res);
});

router.post('/get_expenses_detail_edit', (req, res) => {
    data_models.getExpensesDetailEdit(req, res);
});

router.post('/add_expenses_hd', (req, res) => {
    data_models.addExpensesHD(req, res);
});

router.post('/update_expenses_hd', (req, res) => {
    data_models.updateExpensesHD(req, res);
});

router.post('/update_expenses_dt', (req, res) => {
    data_models.updateExpensesDetail(req, res);
});

router.post('/get_expenses_check', (req, res) => {
    data_models.getExpensesCheck(req, res);
});

router.post('/add_expenses_detail', (req, res) => {
    data_models.addExpensesDetail(req, res);
});

module.exports = router;
