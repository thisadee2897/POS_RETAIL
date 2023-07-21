const express = require('express');
const { json } = require('express/lib/response');
const router = express.Router();
const models = require('./data_models_sale');
const modelsale = require('./data_models_salereport');
const data_models = new models();
const dataSaleReport = new modelsale();


router.post('/getorderhd_for_sales',(req, res)=>{
    data_models.getOrderhd_for_sales(req, res);
});

router.post('/getsaledt_master_product', (req, res) => {
    data_models.getsaledt_master_product(req, res);
});

router.post('/get_product_barcode_for_sale', (req, res) => {
    data_models.get_product_barcode_for_sale(req, res);
});

router.post('/get_product_barcode_for_sale_all', (req, res) => {
    data_models.get_product_barcode_for_sale_all(req, res);
});

router.post('/get_select_sale_transection_resale', (req, res) => {
    data_models.get_select_sale_transection_resale(req, res);
});

router.post('/getdata_bookbanktranfer', (req, res) => {
    data_models.getdata_bookbanktranfer(req, res);
});

router.post('/getdata_bookbankcredit', (req, res) => {
    data_models.getdata_bookbankcredit(req, res);
});

router.post('/getdata_currency', (req, res) => {
    data_models.getdata_currency(req, res);
});

router.post('/getdata_deposithd', (req, res) => {
    data_models.getdata_deposithd(req, res);
});

router.post('/getdata_voucher', (req, res) => {
    data_models.getdata_voucher(req, res);
});

router.post('/getdata_wht_category', (req, res) => {
    data_models.getdata_wht_category(req, res);
});

router.post('/getdata_promotion_point', (req, res) => {
    data_models.getdata_promotion_point(req, res);
});

router.post('/getdata_pointtype', (req, res) => {
    data_models.getdata_pointtype(req, res);
});

router.post('/getdata_vat', (req, res) => {
    data_models.getdata_vat(req, res);
});

router.post('/getdata_vat_data', (req, res) => {
    data_models.getdata_vat_data(req, res);
});

router.post('/getsalehd_discount', (req, res) => {
    data_models.getsalehd_discount(req, res);
});

router.post('/getservice_charge', (req, res) => {
    data_models.getservice_charge(req, res);
});

router.post('/getservice_chargetakeaway', (req, res) => {
    data_models.getservice_chargetakeaway(req, res);
});

router.post('/getdata_customer_default', (req, res) => {
    data_models.getdata_customer_default(req, res);
});

router.post('/getcustomer_points', (req, res) => {
    data_models.getcustomer_points(req, res);
});

router.post('/getcustomer_pointstransection', (req, res) => {
    data_models.getcustomer_pointstransection(req, res);
});

router.post('/getbranch_rounding', (req, res) => {
    data_models.getbranch_rounding(req, res);
});

router.post('/get_document_code', (req, res) => {
    data_models.get_document_code(req, res);
});

router.post('/add_salehd_order', (req, res) => {
    data_models.add_salehd_order(req, res);
});

router.post('/update_orderstatus', (req, res) => {
    data_models.update_orderstatus(req, res);
});

router.post('/get_partner', (req, res) => {
    data_models.getPartner(req, res);
});

router.post('/get_salePreview', (req, res) => {
    data_models.get_salePreview(req, res);
});

router.post('/get_vouchercode', (req, res) => {
    data_models.get_vouchercode(req, res);
});

router.post('/get_salehd_transections', (req, res) => {
    data_models.get_salehd_transections(req, res);
});

router.post('/get_salehd', (req, res) => {
    data_models.get_salehd(req, res);
});

router.post('/get_saledt', (req, res) => {
    data_models.get_saledt(req, res);
});

router.post('/get_salecash', (req, res) => {
    data_models.get_salecash(req, res);
});

router.post('/get_salevoucher', (req, res) => {
    data_models.get_salevoucher(req, res);
});

router.post('/get_saletranfer', (req, res) => {
    data_models.get_saletranfer(req, res);
});

router.post('/get_salecredit', (req, res) => {
    data_models.get_salecredit(req, res);
});

router.post('/get_salepartner', (req, res) => {
    data_models.get_salepartner(req, res);
});

router.post('/get_salechange', (req, res) => {
    data_models.get_salechange(req, res);
});

router.post('/update_cancel_sale', (req, res) => {
    data_models.update_cancel_sale(req, res);
});

router.post('/get_cancel_reason', (req, res) => {
    data_models.get_cancel_reason(req, res);
});

router.post('/get_check_option_menu', (req, res) => {
    data_models.get_check_option_menu(req, res);
});


router.post('/get_data_call_employee', (req, res) => {
    data_models.get_data_call_employee(req, res);
});

router.post('/save_data_call_employee', (req, res) => {
    data_models.save_data_call_employee(req, res);
});

router.post('/updateCallEmpData', (req, res) => {
    data_models.updateCallEmpData(req, res);
});

router.post('/get_callemp_data_for_edit', (req, res) => {
    data_models.fetchCallEmpDataForEdit(req, res);
});

router.post('/get_data_move_order', (req, res) => {
    data_models.get_data_move_order(req, res);
});

router.post('/save_data_move_order', (req, res) => {
    data_models.save_data_move_order(req, res);
});

router.post('/updateMoveOrderData', (req, res) => {
    data_models.updateMoveOrderData(req, res);
});

router.post('/get_moveorder_data_for_edit', (req, res) => {
    data_models.fetchMoveOrderDataForEdit(req, res);
});


router.post('/get_data_cancel_order', (req, res) => {
    data_models.get_data_cancel_order(req, res);
});

router.post('/save_data_cancel_order', (req, res) => {
    data_models.save_data_cancel_order(req, res);
});

router.post('/updateCancelOrderData', (req, res) => {
    data_models.updateCancelOrderData(req, res);
});

router.post('/get_cancelorder_data_for_edit', (req, res) => {
    data_models.fetchCancelOrderDataForEdit(req, res);
});


router.post('/get_data_move_table', (req, res) => {
    data_models.get_data_move_table(req, res);
});

router.post('/save_data_move_table', (req, res) => {
    data_models.save_data_move_table(req, res);
});

router.post('/updateMoveTableData', (req, res) => {
    data_models.updateMoveTableData(req, res);
});

router.post('/get_movetable_data_for_edit', (req, res) => {
    data_models.fetchMoveTableDataForEdit(req, res);
});

router.post('/get_pointcus_report', (req, res) => {
    data_models.get_pointcus_report(req, res);
});

router.post('/get_discount_type_for_report', (req, res) => {
    data_models.get_discount_type_for_report(req, res);
});

router.get('/get_salediscounttype', (req, res) => {
    data_models.get_salediscounttype(req, res);
});

router.post('/get_report_discount', (req, res) => {
    data_models.get_report_discount(req, res);
});

router.post('/filter_product', (req, res) => {
    data_models.filter_product(req, res);
});

router.post('/report_SaleVat',(req, res)=>{
    dataSaleReport.report_salevat(req, res);
});

router.post('/report_SaleSumdaily',(req, res)=>{
    dataSaleReport.report_SaleSumdaily(req, res);
});

router.post('/report_SumProduct',(req, res)=>{
    dataSaleReport.report_SumProduct(req, res);//
});

router.post('/report_CancelBill',(req, res)=>{
    dataSaleReport.report_CancelBill(req, res);
});

router.post('/get_MasterPartner',(req, res)=>{
    dataSaleReport.get_MasterPartner(req, res);
});

router.post('/report_ReceivebyPartner',(req, res)=>{
    dataSaleReport.report_ReceivebyPartner(req, res);
});

router.post('/get_MasterVoucher',(req, res)=>{
    dataSaleReport.get_MasterVoucher(req, res);
});

router.post('/report_ReceivebyVoucher',(req, res)=>{
    dataSaleReport.report_ReceivebyVoucher(req, res);
});

router.post('/report_SumProductDetail',(req,res)=>{
    dataSaleReport.report_SumProductDetail(req,res);
});


router.post('/report_SumProductGroup',(req,res)=>{
    dataSaleReport.report_SumProductGroup(req,res);
});

router.post('/report_SumAmountByTablePerBill',(req,res)=>{
    dataSaleReport.report_SumAmountByTablePerBill(req,res);
});

router.post('/report_SumByTable',(req,res)=>{
    dataSaleReport.report_SumByTable(req,res);
});

router.post('/report_CountCusByTable',(req,res)=>{
    dataSaleReport.report_CountCusByTable(req,res);
});

router.post('/get_deposit_sale', (req, res) => {
    data_models.get_deposit_sale(req, res);
});

router.post('/get_deposit_sale_doc', (req, res) => {
    data_models.get_deposit_sale_doc(req, res);
});

router.post('/get_filter_salehd', (req, res) => {
    data_models.get_filter_salehd(req, res);
});

router.post('/get_returnproducthd_docuno', (req, res) => {
    data_models.get_returnproducthd_docuno(req, res);
});
 
router.post('/get_returnproducthd_docuno', (req, res) => {
    data_models.get_returnproducthd_docuno(req, res);
});

router.post('/get_returnproducthd_reason', (req, res) => {
    data_models.get_returnproducthd_reason(req, res);
});

router.post('/save_returnproduct', (req, res) => {
    data_models.save_returnproduct(req, res);
});

router.post('/get_saledt_remaining', (req, res) => {
    data_models.get_saledt_remaining(req, res);
});

router.post('/getsalehd_return', (req, res) => {
    data_models.getsalehd_return(req, res);
});

router.post('/getdata_roinding', (req, res) => {
    data_models.getdata_roinding(req, res);
});

router.post('/get_product_barcode_for_sale_order', (req, res) => {
    data_models.get_product_barcode_for_sale_order(req, res);
});

router.post('/get_sale_order_detail', (req, res) => {
    data_models.getSaleOrderDetail(req, res);
});



module.exports = router;
