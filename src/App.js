import React, { useEffect, useState } from "react";
import PathRouter from './PathRouter/PathRouter';
import './App.css';
import { BrowserRouter as Router, Routes, Route, Link} from "react-router-dom";
import Login from './pages/Login/Login';
import Main from './pages/Main/Main';
import MainSetting from './pages/Main/MainSetting';
import SelectBranch from './pages/SelectBranch/SelectBranch';
import ChangePassword from './pages/ChangePassword/ChangePassword';
import Dashboard from './pages/SaleDashboard/Dashboard';
import SaleDashboard from './pages/SaleDashboard/SaleDashboard';
import ReportRealtime from './pages/SaleDashboard/RealtimeOrder/Realtime';
import ReportRealtimeOrder from './pages/SaleDashboard/RealtimeOrder/RealtimeOrder';
import ReportRealtimeOrderSub from './pages/SaleDashboard/RealtimeOrder/RealtimeOrderSub';
import Duration from './pages/SaleDashboard/Durations/Duration';
import DurationDetail from './pages/SaleDashboard/Durations/DurationDetail';
import DurationsByPay from './pages/SaleDashboard/DurationsByPay/DurationsByPay';
import DurationsByPayDetail from './pages/SaleDashboard/DurationsByPay/DurationsByPayDetail';
import DurationsByPayDetailSub from './pages/SaleDashboard/DurationsByPay/DurationsByPayDetailSub';
import BestSeller from './pages/SaleDashboard/BestSeller/Bestseller';
import BestSellerDetail from './pages/SaleDashboard/BestSeller/BestsellerDetail';
import CloseProduct from './pages/SaleDashboard/CloseProduct/CloseProduct';
import CloseProductSub from './pages/SaleDashboard/CloseProduct/CloseProductSub';
import OpenShiftTransection from './pages/SaleManagement/ShiftTransection/OpenShiftTransection';
import CloseShiftTransection from './pages/SaleManagement/ShiftTransection/CloseShiftTransection';
import DropCashTransection from './pages/SaleManagement/ShiftTransection/DropCashTransection';
import SaleOrder from './pages/SaleManagement/SaleOrder/SaleOrder';
import Sale from './pages/SaleManagement/Sale/Sale';
import DocumentSaleHD from './pages/SaleManagement/SaleDocument/DocumentSaleHD';
import DocumentSaleView from './pages/SaleManagement/SaleDocument/DocumentSaleView';
import Deposit from './pages/SaleManagement/Deposit/Deposit';
import DocumentDepositHD from './pages/SaleManagement/Deposit/DocumentDepositHD';
import DocumentDepositDetail from './pages/SaleManagement/Deposit/DocumentDepositDetail';
import ReturnSale from './pages/SaleManagement/ReturnSale/ReturnSale'
import DocumentSaleHDReturn from './pages/SaleManagement//ReturnSale/DocumentSaleHDReturn'
import DocumentSaleVeiwReturn from './pages/SaleManagement//ReturnSale/DocumentSaleVeiwReturn'
import ShiftSetting from './pages/StoreMangement/ShiftSetting';
import CashierSetting from './pages/StoreMangement/CashierSetting'
import CategorySetting from './pages/PaymentManagement/CategorySetting';
import PartnerSetting from './pages/PaymentManagement/PartnerSetting';
import VoucherSetting from './pages/PaymentManagement/VoucherSetting';
import ReasonReturnProduct from './pages/SettingReason/ReasonReturnProduct';
import ReasonCancleSale from './pages/SettingReason/ReasonCancleSale';
import ProductSet from './pages/PromotionManagement/ProductSet';
import Promotionproduct from './pages/PromotionManagement/Promotionproduct';
import PromotionDiscount from './pages/PromotionManagement/PromotionDiscount';
import PromotionproductGiveAway from './pages/PromotionManagement/PromotionproductGiveAway';
import PromotionDiscountBill from './pages/PromotionManagement/PromotionDiscountBill';
import CutomerGroupSetting from './pages/CustomerManagement/CutomerGroupSetting';
import CustomerCategorySetting from './pages/CustomerManagement/CustomerCategorySetting';
import MemberTypeSetting from './pages/CustomerManagement/MemberTypeSetting'
import CustomerSetting from './pages/CustomerManagement/CustomerSetting';
import PointSetting from './pages/CustomerManagement/PointSetting';
import PointPromotion from './pages/CustomerManagement/PointPromotion';
import SaleReportSumdaily from './pages/SaleReport/SaleReportSumdaily';
import SaleEmployeeReport from './pages/SaleReport/SaleEmployeeReport';
import SaleReportSumProduct from './pages/SaleReport/SaleReportSumProduct';
import SaleReportSumProductGroup from './pages/SaleReport/SaleReportSumProductGroup';
import ReceiptCredit from './pages/SaleReport/ReceiptCredit';
import ReceiveTransfer from './pages/SaleReport/ReceiveTransfer';
import SaleReportReceiveByVoucher from './pages/SaleReport/SaleReportReceiveByVoucher';
import SaleReportSumProductDetail from './pages/SaleReport/SaleReportSumProductDetail';
import SaleReportProductBestSeller from './pages/SaleReport/SaleReportProductBestSeller';
import SaleReportSumAmountByTable from './pages/SaleReport/SaleReportSumAmountByTable';
import SaleReportPayment from './pages/SaleReport/SaleReportPayment';
import SaleReportDocumentDetail from './pages/SaleReport/SaleReportDocumentDetail';
import CloseShiftReport from './pages/SaleReport/CloseshiftReport';
import SaleReportCancelBill from './pages/SaleReport/SaleReportCancelBill';
import Discount from './pages/PromotionReport/Discount';
import PromotionReport from './pages/PromotionReport/PromotionReport';
import MemberData from './pages/MemberReport/MemberData';
import ServiceHistoryReport from './pages/MemberReport/ServiceHistoryReport';
import CustomerPoint from './pages/MemberReport/CustomerPoint';
import Expensedetail from './pages/InventoryReport/Expensedetail';
import Expensesum from './pages/InventoryReport/Expensesum';
import StockReport from './pages/InventoryReport/StockReport_New';
import CollectCashWithinDays from "./pages/SaleManagement/ShiftTransection/CollectCashWithinDays";
import TypeProductManagement from "./pages/StoreMangement/TypeProductManagement/TypeProductManagement";
import CategoryProductManagement from "./pages/StoreMangement/CategoryProductManagement/CategoryProductManagement";
import ProductGroupManagement from "./pages/StoreMangement/ProductGroupManagement/ProductGroupManagement";
import ProductUnitManagement from "./pages/StoreMangement/ProductUnitManagement/ProductUnitManagement";
import ProductBrandManagement from "./pages/StoreMangement/ProductBrandManagement/ProductBrandManagement";
import ProductManagement from "./pages/StoreMangement/ProductManagement/ProductManagement";
function App() {
  return (
    <>
      <Router basename={`${PathRouter()}`}>
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/login" element={<Login />} />
          <Route path="/page-set" element={<MainSetting />} >
            <Route path='select-branch' element={<SelectBranch />} />
            <Route path="change-pass" element={<ChangePassword />} />
          </Route>
          <Route path="/main" element={<Main />} >
            <Route path="change-pass" element={<ChangePassword />} />
                      //Menu Sale Dashboard
            <Route path='dashboard' element={<Dashboard />} />
            <Route path="saledashboard" element={<SaleDashboard />} />
            <Route path="realorder" element={<ReportRealtime />} />
            <Route path="realorder/detail" element={<ReportRealtimeOrder />} />
            <Route path="realorder/detail/Sub" element={<ReportRealtimeOrderSub />} />
            <Route path="duration" element={<Duration />} />
            <Route path="duration/detail" element={<DurationDetail />} />
            <Route path="durationpay" element={<DurationsByPay />} />
            <Route path="durationpay/detail" element={<DurationsByPayDetail />} />
            <Route path="durationpay/detail/sub" element={<DurationsByPayDetailSub />} />
            <Route path="bestseller" element={<BestSeller />} />
            <Route path="bestseller/detail" element={<BestSellerDetail />} />
            <Route path="closePro" element={<CloseProduct />} />
            <Route path="closePro/detail" element={<CloseProductSub />} />
                      //SaleManagement
            <Route path="openshift" element={<OpenShiftTransection />} />
            <Route path="closeshift" element={<CloseShiftTransection />} />
            <Route path="collect-cash" element={<CollectCashWithinDays />} />
            <Route path="dropcash" element={<DropCashTransection />} />
            <Route path="sale" element={<Sale />} />
            <Route path='saleorder' element={<SaleOrder />} />
            <Route path="deposit" element={<Deposit />} />
            <Route path="document/deposit" element={<DocumentDepositHD />} />
            <Route path="document/deposit/view" element={<DocumentDepositDetail />} />
            <Route path="sale-credit" element={<Sale />} />
            <Route path="return-product-cash" element={<ReturnSale />} />
            <Route path="return-product-credit" element={<ReturnSale />} />
            <Route path="document/returnproduct/cash" element={<DocumentSaleHDReturn />} />
            <Route path="document/return-product-credit" element={<DocumentSaleHDReturn />} />
            <Route path="document/return-product-cash" element={<DocumentSaleHDReturn />} />
            <Route path="document/returnproduct/cash/view" element={<DocumentSaleVeiwReturn />} />
            <Route path="document/returnproduct/credit/view" element={<DocumentSaleVeiwReturn />} />
            <Route path="document/salehd" element={<DocumentSaleHD />} />
            <Route path="document/sale-credit" element={<DocumentSaleHD />} />
            <Route path="document/salehd/view" element={<DocumentSaleView />} />
            <Route path="document/sale-credit/view" element={<DocumentSaleView />} />
                      //StoreManagement
            <Route path='cashiermanagement' element={<CashierSetting />} /> //SettingRole
            <Route path='shiftmanagement' element={<ShiftSetting />} />
            <Route path='type-product-management' element={<TypeProductManagement />} />
            <Route path='category-product-management' element={<CategoryProductManagement />} />
            <Route path='product-group-management' element={<ProductGroupManagement />} />
            <Route path='product-unit-management' element={<ProductUnitManagement />} />
            <Route path='product-brand-management' element={<ProductBrandManagement />} />
            <Route path='product-management' element={<ProductManagement />} />
                      //PaymentManagement
            <Route path="sale-partner" element={<PartnerSetting />} />
            <Route path="sale-voucher" element={<VoucherSetting />} />
            <Route path="sale-category" element={<CategorySetting />} />
                      //SettingReason
            <Route path="reason-cancelsale-setting" element={<ReasonCancleSale />} />
            <Route path="reason/return-product" element={<ReasonReturnProduct />} />
                      //PromotionsManageMent
            <Route path='promotion-set-setting' element={<ProductSet />} />
            <Route path='promotion-discount-setting' element={<Promotionproduct />} />
            <Route path='promotion-discount-total-setting' element={<PromotionDiscount />} />
            <Route path="promotion-giveaway-setting" element={<PromotionproductGiveAway />} />
            <Route path='promotion-giveaway-total-setting' element={<PromotionproductGiveAway />} />
            <Route path="discount-setting" element={<PromotionDiscountBill />} />
                      //CustomerManagement
            <Route path="setting-customer-type" element={<CutomerGroupSetting />} />
            <Route path="setting-member-type" element={<CustomerCategorySetting />} />
            <Route path="customer/member" element={<MemberTypeSetting />} />//SettingRole
            <Route path="customer-data" element={<CustomerSetting />} />
            <Route path="sale-point" element={<PointSetting />} />
            <Route path="sale-pointpromotion" element={<PointPromotion />} />
                      //SaleReport
            <Route path="sales-summary-today-report" element={<SaleReportSumdaily />} />
            <Route path="employee-sales-report" element={<SaleEmployeeReport />} />
            <Route path="sales-product-detail" element={<SaleReportSumProductDetail />} />
            <Route path="sales-product-summary" element={<SaleReportSumProduct />} />
            <Route path="sales-payment" element={<SaleReportPayment />} />
            <Route path="sales-doc-detail" element={<SaleReportDocumentDetail />} />


            <Route path="sales-byproductgroup-report" element={<SaleReportSumProductGroup />} />
            <Route path='sales-receiveby-creditcard-report' element={<ReceiptCredit />} />
            <Route path='sales-receiveby-transfer-report' element={<ReceiveTransfer />} />
            <Route path="sales-receiveby-voucher-report" element={<SaleReportReceiveByVoucher />} />


            <Route path="sales-report_bestseller" element={<SaleReportProductBestSeller />} />
            <Route path="sale-average-bytable-report" e lement={<SaleReportSumAmountByTable />} />

            <Route path="check/closeshift" element={<CloseShiftReport />} />
            <Route path="sales-cancel-bill-report" element={<SaleReportCancelBill />} />
                      //PromotionReport
            <Route path='discount-report' element={<Discount />} />
            <Route path='promotion-report' element={<PromotionReport />} />
                      //MemberReport
            <Route path="member-data" element={<MemberData />} />
            <Route path='sales-service-history-report' element={<ServiceHistoryReport />} />
            <Route path="remaining-points-report" element={<CustomerPoint />} />
                      //InventoryReport
            <Route path="check/expensedetail" element={<Expensedetail />} />
            <Route path="check/expensesum" element={<Expensesum />} />
            <Route path="check/stock" element={<StockReport />} />
          </Route>
        </Routes>
      </Router>
    </>
  );
}

export default App;
