const express = require('express');
const router = express.Router();
const models = require('./data_model_report');
const data_models = new models();

router.post('/report_payment', (req, res) => {
    data_models.getdataPayment(req, res);
});

router.post('/report_paymentdetail', (req, res) => {
    data_models.getdataPaymentDetail(req, res);
});
``
router.post('/realtime', (req, res) => {
    data_models.realtime(req, res);
});

router.post('/realtime_order', (req, res) => {
    data_models.realtimeOrder(req, res);
});

router.post('/realtime_order_sub', (req, res) => {
    data_models.realtimeOrderSub(req, res);
});

router.post('/closed_products_count', (req, res) => {
    data_models.closedProductsCount(req, res);
});

router.post('/closed_products', (req, res) => {
    data_models.closed_products(req, res);
});

router.post('/select_branch', (req, res) => {
    data_models.select_branch(req, res);
});

router.post('/sales_bill', (req, res) => {
    data_models.salesBill(req, res);
});

router.post('/sales_bill_detail', (req, res) => {
    data_models.salesBillDetail(req, res);
});

router.post('/sales_bill_detail_sub', (req, res) => {
    data_models.salesBillDetailSub(req, res);
});

router.post('/duration', (req, res) => {
    data_models.duration(req, res);
});

router.post('/duration_detail', (req, res) => {
    data_models.durationDetail(req, res);
});

router.post('/duration_all', (req, res) => {
    data_models.durationAll(req, res);
});

router.post('/get_user_data', (req, res) => {
    data_models.fecthUserData(req, res);
});

router.post('/payment_method', (req, res) => {
    data_models.paymentMethod(req, res);
});

router.post('/payment_branch', (req, res) => {
    data_models.paymentBranch(req, res);
});

router.post('/payment_detail', (req, res) => {
    data_models.paymentDetail(req, res);
});

router.post('/eating_type', (req, res) => {
    data_models.eatingType(req, res);
});

router.post('/service_charge', (req, res) => {
    data_models.serviceCharge(req, res);
});

router.post('/payment_sum_creditcard', (req, res) => {
    data_models.paymentSumCreditCard(req, res);
});

router.post('/payment_creditcard_detail', (req, res) => {
    data_models.paymentCreditCardDetail(req, res);
});

router.post('/payment_best_seller', (req, res) => {
    data_models.paymentBestSeller(req, res);
});

router.post('/payment_best_seller_detail', (req, res) => {
    data_models.paymentBestSellerDetail(req, res);
});

router.post('/payment_best_seller_graph', (req, res) => {
    data_models.paymentBestSellerGraph(req, res);
});


router.post('/get_menu_report_data', (req, res) => {
    data_models.fechMenuReportData(req, res);
});

router.post('/sumarize', (req, res) => {
    data_models.Sumarize(req, res);
});

router.post('/sumarize_graph', (req, res) => {
    data_models.SumarizeGraph(req, res);
});

router.post('/sumarize_graphSecond', (req, res) => {
    data_models.SumarizeGraphSecond(req, res);
});

router.post('/sumarize_graphThird', (req, res) => {
    data_models.SumarizeGraphThird(req, res);
});

router.post('/sumarize_customer', (req, res) => {
    data_models.SumarizeCustomer(req, res);
});

router.post('/sumarize_company_value', (req, res) => {
    data_models.SumarizeCompanyValue(req, res);
});

router.post('/sumarize_saleAmnt', (req, res) => {
    data_models.SumarizeSaleAmnt(req, res);
});

router.post('/sumarize_bill_cancle', (req, res) => {
    data_models.SumarizeBillCancel(req, res);
});

router.post('/sumarize_week', (req, res) => {
    data_models.SumarizeWeek(req, res);
});

router.post('/dashboard_sales', (req, res) => {
    data_models.DashboardSales(req, res);
});

router.post('/dashboard_sales_bill', (req, res) => {
    data_models.DashboardSalesBill(req, res);
});

router.post('/dashboard_sales_Everyday', (req, res) => {
    data_models.DashboardSalesEveryday(req, res);
});

router.post('/dashboard_sales_hours', (req, res) => {
    data_models.DashboardSalesHours(req, res);
});

router.post('/dashboard_sales_weeks', (req, res) => {
    data_models.DashboardSalesWeeks(req, res);
});
router.post('/report_payment', (req, res) => {
    data_models.getdataPayment(req, res);
});

router.post('/report_paymentdetail', (req, res) => {
    data_models.getdataPaymentDetail(req, res);
});

router.post('/cancellation_detail', (req, res) => {
    data_models.Cancellation_detail(req, res);
});

router.post('/movemenu_detail', (req, res) => {
    data_models.getmovemenu_detail(req, res);
});

router.post('/billorder_detail', (req, res) => {
    data_models.getbillorder_detail(req, res);
});

router.post('/billcancle_detail', (req, res) => {
    data_models.getbillcancle_detail(req, res);
});

router.post('/returnstatus_detail', (req, res) => {
    data_models.getreturnstatus_detail(req, res);
});

router.post('/shift_transaction', (req, res) => {
    data_models.getshift_transaction(req, res);
});

router.post('/report_expense_dt', (req, res) => {
    data_models.getreport_expense_dt(req, res);
});

router.post('/report_expense_hd', (req, res) => {
    data_models.getreport_expense_hd(req, res);
});

router.post('/get_product_barcode', (req, res) => {
    data_models.getproduct_barcode(req, res);
});


router.post('/report_stockcard_by_product', (req, res) => {
    data_models.getreportreport_stockcard_by_product(req, res);
});

router.post('/report_stockcard_balance', (req, res) => {
    data_models.getreport_stockcard_balance(req, res);
});


router.post('/report_sale_summary_cash', (req, res) => {
    data_models.getreport_sale_summary_cash(req, res);
});

router.post('/report_sale_summary_cash_detail', (req, res) => {
    data_models.getreport_sale_summary_cash_detail(req, res);
});

router.post('/get_report_sport_check_all', (req, res) => {
    data_models.getSportCheckAll(req, res);
});

router.post('/get_report_sport_check_saledt', (req, res) => {
    data_models.getSportCheckSaledt(req, res);
});

router.post('/get_report_shift_close_all', (req, res) => {
    data_models.getShiftCloseAll(req, res);
});

router.post('/get_report_shift_close_saledt', (req, res) => {
    data_models.getShiftCloseSaledt(req, res);
});

router.post('/get_report_check_shift_open', (req, res) => {
    data_models.getCheckShiftOpen(req, res);
});

router.post('/get_report_check_shift_close', (req, res) => {
    data_models.getCheckShiftClose(req, res);
});

router.post('/get_receiveby_credit', (req, res) => {
    data_models.getReceivebyCredit(req, res);
});

router.post('/get_cardtype', (req, res) => {
    data_models.getCardType(req, res);
});

router.post('/get_cardtype_id', (req, res) => {
    data_models.getCardTypeID(req, res);
});

router.post('/get_value_category', (req, res) => {
    data_models.getValueCategory(req, res);
});

router.post('/get_customer_data2', (req, res) => {
    data_models.getCustomerData(req, res);
});

router.post('/get_monthly_sales', (req, res) => {
    data_models.getMonthlySales(req, res);
});

router.post('/get_cancle_bill', (req, res) => {
    data_models.getCancleBill(req, res);
});

router.post('/get_sales_per_day', (req, res) => {
    data_models.getSalesPerDay(req, res);
});

router.post('/get_cost_and_spend', (req, res) => {
    data_models.getCostAndSpend(req, res);
});

router.post('/get_costAmnt_and_spendAmnt', (req, res) => {
    data_models.getCostAmntAndSpendAmnt(req, res);
});

router.post('/get_receiveby_transfer', (req, res) => {
    data_models.getReceivebyTransfer(req, res);
});

router.post('/get_bank', (req, res) => {
    data_models.getBank(req, res);
});

router.post('/move_table_report', (req, res) => {
    data_models.moveTableReport(req, res);
});

router.post('/employee_sales', (req, res) => {
    data_models.employeeSales(req, res);
});

router.post('/promotion_type', (req, res) => {
    data_models.promotionType(req, res);
});

router.post('/promotion_hd', (req, res) => {
    data_models.promotionHd(req, res);
});

router.post('/promotion_report', (req, res) => {
    data_models.promotionReport(req, res);
});

router.post('/report_stockcard_minmax', (req, res) => {
    data_models.report_stockcard_minmax(req, res);
});

router.post('/report_stockcard_by_product_new', (req, res) => {
    data_models.getreport_stockcard_by_product_new(req, res);
});

router.post('/report_stockcard_balance_new', (req, res) => {
    data_models.getreport_stockcard_balance_new(req, res);
});

router.post('/report_sale_sumdaily', (req, res) => {
    data_models.getreport_sale_sumdaily(req, res);
});

router.post('/report_saleamount_byemployee', (req, res) => {
    data_models.getreport_saleamount_byemployee(req, res);
});

router.post('/report_sale_bill_v1', (req, res) => {
    data_models.getreport_sale_bill_v1(req, res);
});

router.post('/report_sale_product_explain', (req, res) => {
    data_models.getreport_sale_product_explain(req, res);
});

router.post('/report_sale_product_explain_summarize', (req, res) => {
    data_models.getreport_sale_product_explain_summarize(req, res);
});


module.exports = router;