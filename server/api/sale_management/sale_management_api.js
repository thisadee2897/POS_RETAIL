const express = require('express');
const { json } = require('express/lib/response');
const router = express.Router();
const models = require('./data_models_sale_management');
const data_models = new models();


router.post('/getshift_transaction_branch', (req, res) => {
    data_models.getShifttransectionDataBranch(req, res);
});

router.post('/getshift_transaction_data', (req, res) => {
    data_models.getShifttransectionData(req, res);
});

router.post('/getshift_transaction_data_edit', (req, res) => {
    data_models.getShifttransectionDataEdit(req, res);
});

router.post('/add_shift_transaction', (req, res) => {
    data_models.addShifttransection(req, res);
});

router.post('/update_shift_transaction', (req, res) => {
    data_models.updateShifttransection(req, res);
});

router.post('/close_shift_transaction', (req, res) => {
    data_models.closeShifttransection(req, res);
});

router.post('/get_salehd_cashamnt', (req, res) => {
    data_models.getSalehdCashamnt(req, res);
});

router.post('/get_shift_code', (req, res) => {
    data_models.getShiftCode(req, res);
});

router.post('/get_employee_filter_data', (req, res) => {
    data_models.getEmployeeDataFilter(req, res);
});

router.post('/get_order_status', (req, res) => {
    data_models.getOrderStatus(req, res);
});

router.post('/getshift_transaction_date', (req, res) => {
    data_models.getshift_transaction_date(req, res);
});

router.post('/save_shift_transection_dt', (req, res) => {
    data_models.saveShiftTransectionDt(req, res);
});

router.post('/get_shift_transaction_dt', (req, res) => {
    data_models.getShiftTransectionDt(req, res);
});

router.post('/cancel_shift_transection_dt', (req, res) => {
    data_models.cancelShiftTransectionDt(req, res);
});





module.exports = router;
