const express = require('express');
const router = express.Router();
const models = require('./data_model_product');
const data_models = new models();

router.post('/get_product_data',(req, res)=>{
    data_models.fetchProductData(req, res);
});

router.post('/get_product_data_mat', (req, res) => {
    data_models.getProductDataMaterial(req, res);
});

router.post('/get_product_category_data',(req, res)=>{
    data_models.fetcProductCategoryData(req, res);
});

router.post('/get_product_category_mat_data', (req, res) => {
    data_models.fetcProductCategoryMatData(req, res);
});

router.post('/get_product_category_data_for_buffet',(req, res)=>{
    data_models.fetcProductCategoryDataForBuffet(req, res);
});

router.post('/get_product_group_data',(req, res)=>{
    data_models.fetchProductGroupData(req, res);
});

router.post('/get_product_group_mat_data', (req, res) => {
    data_models.fetchProductGroupMatData(req, res);
});

router.post('/get_product_group_data_for_buffet',(req, res)=>{
    data_models.fetchProductGroupDataForBuffet(req, res);
});

router.post('/get_department_data',(req, res)=>{
    data_models.fetcDepartmentData(req, res);
});

router.post('/get_unit_data',(req, res)=>{
    data_models.fetchUnitData(req, res);
});

router.post('/get_kitchen_data',(req, res)=>{
    data_models.fetchKitchenData(req, res);
});

router.post('/get_product_invoice_data',(req, res)=>{
    data_models.fetchProductInvoiceData(req, res);
});

router.post('/get_vat_group_data',(req, res)=>{
    data_models.fetchVatGroupData(req, res);
});

router.post('/get_vat_group_data_for_buffet',(req, res)=>{
    data_models.fetchVatGroupDataForBuffet(req, res);
});

router.post('/create_product_barcode',(req, res)=>{
    data_models.createProductBarcode(req, res);
});

// router.post('/save_product_data',(req, res)=>{
//     data_models.saveProductData(req, res);
// });

router.post('/get_product_data_for_edit',(req, res)=>{
    data_models.fetchProductDataForEdit(req, res);
});

router.post('/get_product_price_in_branch',(req, res)=>{
    data_models.fetchProductPriceInBranch(req, res);
});

// router.post('/update_product_data',(req, res)=>{
//     data_models.editProductData(req, res);
// });


router.post('/get_product_group_all', (req, res) => {
    data_models.fetchProductGroupAll(req, res);
});

router.post('/get_product_group_mat_all', (req, res) => {
    data_models.fetchProductMatGroupAll(req, res);
});

// router.post('/add_product_group', (req, res) => {
//     data_models.addProductGroup(req, res);
// });

router.post('/get_product_group_edit', (req, res) => {
    data_models.fetchProductGroupEdit(req, res);
});

router.get('/get_product_group_code', (req, res) => {
    data_models.getProductgroupCode(req, res);
});

// router.post('/update_product_group', (req, res) => {
//     data_models.updateProductGroup(req, res);
// });

router.post('/get_document_adjust_data', (req, res) => {
    data_models.fetcDocumentAdjustData(req, res);
});

router.post('/create_adjust_ducument_number', (req, res) => {
    data_models.createAdjustDocumentNumber(req, res);
});

router.post('/get_product_adjust_data', (req, res) => {
    data_models.fetcProductAdjustData(req, res);
});

router.post('/save_adjust_data', (req, res) => {
    data_models.saveAdjustData(req, res);
});

router.post('/get_adjust_data_for_edit', (req, res) => {
    data_models.fetcAdjustDocumentDataForEidt(req, res);
});

router.post('/update_adjust_data', (req, res) => {
    data_models.updateAdjustData(req, res);
});

router.post('/cancel_document_adjust', (req, res) => {
    data_models.cancelDocumentAdjust(req, res);
});

router.post('/create_adjust_count_ducument_number', (req, res) => {
    data_models.createAdjustCountDocumentNumber(req, res);
});

router.post('/save_count_adjust_data', (req, res) => {
    data_models.saveCountAdjustData(req, res);
});

router.post('/get_document_count_adjust_data', (req, res) => {
    data_models.fetcDocumentCountAdjustData(req, res);
});

router.post('/create_buffet_ducument_number', (req, res) => {
    data_models.createBuffetDocumentNumber(req, res);
});

router.post('/get_product_buffet_data', (req, res) => {
    data_models.fetcProductBuffetData(req, res);
});

// router.post('/save_buffet_data', (req, res) => {
//     data_models.saveBuffetData(req, res);
// });

router.post('/get_document_buffet_data', (req, res) => {
    data_models.fetcDocumentBuffetData(req, res);
});

router.post('/get_buffet_data_foredit', (req, res) => {
    data_models.fetcBuffetDataForEdit(req, res);
});

// router.post('/update_buffet_data', (req, res) => {
//     data_models.updateBuffetData(req, res);
// });

router.post('/get_product_group_type', (req, res) => {
    data_models.fetchProductGrouptype(req, res);
});


router.post('/get_product_topping', (req, res) => {
    data_models.getproduct_Topping(req, res);
});


router.post('/get_product_topping_edit', (req, res) => {
    data_models.getproduct_Topping_Edit(req, res);
});

router.post('/get_product_topping_edit_default', (req, res) => {
    data_models.getproduct_Topping_Edit_Default(req, res);
});

router.post('/add_product_topping', (req, res) => {
    data_models.addproduct_Topping(req, res);
});

router.post('/update_product_topping', (req, res) => {
    data_models.updateproduct_Topping(req, res);
});

router.post('/delete_product_topping', (req, res) => {
    data_models.deleteproduct_Topping(req, res);
});

router.post('/get_product_group_options', (req, res) => {
    data_models.getProductgroupOption(req, res);
});

router.post('/get_product_options', (req, res) => {
    data_models.getProductOption(req, res);
});

router.post('/get_product_options_edit', (req, res) => {
    data_models.getProductOptionEdit(req, res);
});

router.post('/get_product_options_edit_all', (req, res) => {
    data_models.getProductOptionEditAll(req, res);
});


router.post('/add_product_group_options', (req, res) => {
    data_models.addProductgroupOption(req, res);
});

router.post('/update_product_group_options', (req, res) => {
    data_models.updateProductgroupOption(req, res);
});

router.post('/add_product_options', (req, res) => {
    data_models.addProductOption(req, res);
});

router.post('/update_product_options', (req, res) => {
    data_models.update_product_options(req, res);
});

router.post('/get_option_data', (req, res) => {
    data_models.fetchOptionData(req, res);
});

router.post('/save_option_data', (req, res) => {
    data_models.saveOptionData(req, res);
});

router.post('/get_option_data_item', (req, res) => {
    data_models.get_option_data_item(req, res);
});

router.post('/get_option_data_for_edit', (req, res) => {
    data_models.fetchOptionDataForEdit(req, res);
});

router.post('/update_option_data', (req, res) => {
    data_models.updateOptionData(req, res);
});

router.post('/get_prounit_data', (req, res) => {
    data_models.get_prounit_data(req, res);
});

router.post('/get_unit_data_edit', (req, res) => {
    data_models.get_unit_data_edit(req, res);
});

router.post('/add_unit_data', (req, res) => {
    data_models.add_unit_data(req, res);
});

router.post('/update_unit_data', (req, res) => {
    data_models.update_unit_data(req, res);
});

router.post('/get_product_setting', (req, res) => {
    data_models.get_product_setting(req, res);
});

router.post('/update_product_setting', (req, res) => {
    data_models.update_product_setting(req, res);
});

router.post('/add_product_setting_log', (req, res) => {
    data_models.add_product_setting_log(req, res);
});

router.post('/get_product_data_matmultiunit', (req, res) => {
    data_models.get_product_data_matmultiunit(req, res);
});

router.post('/get_productbom_data_edit', (req, res) => {
    data_models.get_productbom_data_edit(req, res);
});

router.post('/get_productbom_data_edit_default', (req, res) => {
    data_models.get_productbom_data_edit_default(req, res);
});

router.post('/add_productbom_data', (req, res) => {
    data_models.add_productbom_data(req, res);
});

router.post('/update_productbom_data', (req, res) => {
    data_models.update_productbom_data(req, res);
});

router.post('/get_unitmulti_data', (req, res) => {
    data_models.get_unitmulti_data(req, res);
});

router.post('/get_unitmulti_data_edit', (req, res) => {
    data_models.get_unitmulti_data_edit(req, res);
});

router.post('/add_unitmulti_data', (req, res) => {
    data_models.add_unitmulti_data(req, res);
});

router.post('/update_unitmulti_data', (req, res) => {
    data_models.update_unitmulti_data(req, res);
});

router.post('/get_adjuststock_data', (req, res) => {
    data_models.get_adjuststock_data(req, res);
});

router.post('/get_adjuststockcard_data', (req, res) => {
    data_models.get_adjuststockcard_data(req, res);
});


router.post('/get_adjuststockunit_data', (req, res) => {
    data_models.get_adjuststockunit_data(req, res);
});

router.post('/add_adjuststockunit_data', (req, res) => {
    data_models.add_adjuststockunit_data(req, res);
});

router.post('/add_adjuststockcard_data', (req, res) => {
    data_models.add_adjuststockcard_data(req, res);
});

router.post('/get_safety_stock_data', (req, res) => {
    data_models.fetchSafetyStockData(req, res);
});


module.exports = router;