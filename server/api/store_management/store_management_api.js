const express = require('express');
const router = express.Router();
const models = require('./data_model_store_management');
const data_models = new models();

router.post('/get_shift_data', (req, res) => {
    data_models.getShiftdata(req, res);
});
router.post('/add_shift_data', (req, res) => {
    data_models.addShiftdata(req, res);
});
router.post('/update_shift_data', (req, res) => {
    data_models.updateShiftdata(req, res);
});
router.post('/get_cashier_machine_data', (req, res) => {
    data_models.getCashierMachineData(req, res);
});
router.post('/add_cashier_machine_data', (req, res) => {
    data_models.addCashierMachineData(req, res);
});
router.post('/update_cashier_machine_data', (req, res) => {
    data_models.updateCashierMachineData(req, res);
});

//type_product_management
router.post('/get_type_product_management', (req, res) => {
    data_models.getTypeProductManagement(req, res);
});
router.post('/add_type_product_management', (req, res) => {
    data_models.addTypeProductManagement(req, res);
});
router.post('/update_type_product_management', (req, res) => {
    data_models.updateTypeProductManagement(req, res);
});

//category_product_management
router.post('/get_category_product_management', (req, res) => {
    data_models.getCategoryProductManagement(req, res);
});
router.post('/add_category_product_management', (req, res) => {
    data_models.addCategoryProductManagement(req, res);
});
router.post('/update_category_product_management', (req, res) => {
    data_models.updateCategoryProductManagement(req, res);
});

//product_group_management
router.post('/get_product_group_management', (req, res) => {
    data_models.getProductGroupManagement(req, res);
});
router.post('/add_product_group_management', (req, res) => {
    data_models.addProductGroupManagement(req, res);
});
router.post('/update_product_group_management', (req, res) => {
    data_models.updateProductGroupManagement(req, res);
});

//product_unit_management
router.post('/get_product_unit_management', (req, res) => {
    data_models.getProductUnitManagement(req, res);
});
router.post('/add_product_unit_management', (req, res) => {
    data_models.addProductUnitManagement(req, res);
});
router.post('/update_product_unit_management', (req, res) => {
    data_models.updateProductUnitManagement(req, res);
});

//product_brand_management
router.post('/get_product_brand_management', (req, res) => {
    data_models.getBrandManagement(req, res);
});
router.post('/add_product_brand_management', (req, res) => {
    data_models.addBrandManagement(req, res);
});
router.post('/update_product_brand_management', (req, res) => {
    data_models.updateBrandManagement(req, res);
});

//product_management
router.post('/get_product_management', (req, res) => {
    data_models.getShiftdata(req, res);
});
router.post('/add_product_management', (req, res) => {
    data_models.addTypeProductManagement(req, res);
});
router.post('/update_product_management', (req, res) => {
    data_models.updateTypeProductManagement(req, res);
});

module.exports = router;