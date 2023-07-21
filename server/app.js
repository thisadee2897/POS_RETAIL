const express = require('express');
const cors = require('cors');
const app = express();
const loginRouter = require('./api/login/login_api');
const CustomerRouter = require('./api/customer/customer_api');
const ProductRouter = require('./api/product/product_api');
const ReportRouter = require('./api/report/report_api');
const RoleRouter = require('./api/role/role_api');
const SaleManagementRouter = require('./api/sale_management/sale_management_api');
const ExpensesRouter = require('./api/expenses/expenses_api');
const SideBarRouter = require('./api/sidebar/sidebar_api');
const SaleRouter = require('./api/sale/sale_api');
const PromotionRouter = require('./api/promotion/promotion_api');
const MemberReportRouter = require('./api/member_report/member_report_api');
const DepositRouter = require('./api/deposit/deposit_api');
const SaleOrderRouter = require('./api/sale_order/sale_order_api');
const ReasonRouter = require('./api/reason/reason_api')
const StoreManagement = require('./api/store_management/store_management_api')
const PaymentManagement = require('./api/payment_management/payment_api')


app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ limit: "50mb", extended: true }));
app.use(`/images`, express.static('upload'));
app.use(cors());
app.use(loginRouter);
app.use(CustomerRouter);
app.use(StoreManagement);
app.use(ProductRouter);
app.use(ReportRouter);
app.use(RoleRouter);
app.use(SaleManagementRouter);
app.use(ExpensesRouter);
app.use(SideBarRouter);
app.use(SaleRouter);
app.use(PromotionRouter);
app.use(MemberReportRouter);
app.use(DepositRouter);
app.use(SaleOrderRouter);
app.use(ReasonRouter);
app.use(PaymentManagement);


module.exports = app;