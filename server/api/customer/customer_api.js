const express = require('express');
const router = express.Router();
const models = require('./data_model_customer');
const data_models = new models();

router.post('/get_customercategory_data', (req, res) => {
    data_models.getCustomerCategorydata(req, res);
});

router.post('/add_customercategory_data', (req, res) => {
    data_models.addCustomerCategorydata(req, res);
});

router.post('/update_customercategory_data', (req, res) => {
    data_models.updateCustomerCategorydata(req, res);
});

router.post('/get_customergroup_data', (req, res) => {
    data_models.getCustomerGroupdata(req, res);
});

router.post('/add_customergroup_data', (req, res) => {
    data_models.addCustomerGroupData(req, res);
});

router.post('/update_customergroup_data', (req, res) => {
    data_models.updateCustomerGroupData(req, res);
});

router.post('/get_membertype_data', (req, res) => {
    data_models.getMemberTypedata(req, res);
});

router.post('/add_membertype_data', (req, res) => {
    data_models.addMemberTypedata(req, res);
});

router.post('/update_membertype_data', (req, res) => {
    data_models.updateMemberTypedata(req, res);
});

router.post('/get_customer_data', (req, res) => {
    data_models.getCustomerData(req, res);
});

router.post('/get_customer_code', (req, res) => {
    data_models.getCustomeCode(req, res);
});

router.get('/get_title_data', (req, res) => {
    data_models.getTitleData(req, res);
});

router.get('/get_person_type_data', (req, res) => {
    data_models.getPersonTypeData(req, res);
});

router.get('/get_price_data', (req, res) => {
    data_models.getPriceData(req, res);
});

router.get('/get_district_data', (req, res) => {
    data_models.getDistrictData(req, res);
});

router.post('/get_prefecture_data', (req, res) => {
    data_models.getPrefectureData(req, res);
})

router.post('/get_province_data', (req, res) => {
    data_models.getProvinceData(req, res);
});

router.post('/get_postcode_data', (req, res) => {
    data_models.getPostCodeData(req, res);
});

router.post('/add_customer_data', (req, res) => {
    data_models.addCustomerData(req, res);
});

router.post('/update_customer_data', (req, res) => {
    data_models.updateCustomerData(req, res);
});


router.post('/get_point_type_data', (req, res) => {
    data_models.get_point_type_data(req, res);
});

router.post('/add_point_type_data', (req, res) => {
    data_models.add_point_type_data(req, res);
});

router.post('/update_point_type_data', (req, res) => {
    data_models.update_point_type_data(req, res);
});

router.get('/get_point_cal_type_data', (req, res) => {
    data_models.get_point_cal_type_data(req, res);
});

router.post('/get_promotion_point_data', (req, res) => {
    data_models.get_promotion_point_data(req, res);
});

router.post('/add_promotion_point_data', (req, res) => {
    data_models.add_promotion_point_data(req, res);
});

router.post('/update_promotion_point_data', (req, res) => {
    data_models.update_promotion_point_data(req, res);
});


router.post('/filter_customer_data', (req, res) => {
    data_models.filterCustomerData(req, res);
});

router.post('/get_customer_data_for_edit', (req, res) => {
    data_models.fetchCustomerDataEdit(req, res);
});

module.exports = router;