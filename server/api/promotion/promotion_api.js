const express = require('express');
const router = express.Router();
const models = require('./data_model_promotion');
const data_models = new models();


router.post('/get_sethd_data', (req, res) => {
    data_models.getSetHDData(req, res);
});

router.post('/get_set_hd_document', (req, res) => {
    data_models.getSetHdDocument(req, res);
});

router.post('/add_product_set_data', (req, res) => {
    data_models.addProductSetData(req, res);
});

router.post('/get_product_set_foredit_data', (req, res) => {
    data_models.fetcProductSetDataForEdit(req, res);
});

router.post('/update_product_set_data', (req, res) => {
    data_models.updateProductSetData(req, res);
});

router.post('/get_promotion_docuno', (req, res) => {
    data_models.getPromotionDocuno(req, res);
});

router.get('/get_promotiontype_data', (req, res) => {
    data_models.getPromotionTypeData(req, res);
});

router.get('/get_discount_value_data', (req, res) => {
    data_models.getDiscountValueData(req, res);
});

router.get('/get_discount_type_data', (req, res) => {
    data_models.getDiscountTypeData(req, res);
});

router.get('/get_promotion_every_data', (req, res) => {
    data_models.getPromotionEveryData(req, res);
});

router.post('/get_promotionHD_data', (req, res) => {
    data_models.getPromotionHDData(req, res);
});

router.post('/get_promotionDT_data', (req, res) => {
    data_models.getPromotionDTData(req, res);
});

router.post('/get_promotionDT_branch', (req, res) => {
    data_models.getPromotionDTBranch(req, res);
});

router.post('/get_promotionDT_customergroup', (req, res) => {
    data_models.getPromotionDTCustomerGroup(req, res);
});

router.post('/get_promotionDT_membettype', (req, res) => {
    data_models.getPromotionDTMemberType(req, res);
});

router.post('/add_promotion_data', (req, res) => {
    data_models.addPromotionData(req, res);
});
 
router.post('/cancel_promotion', (req, res) => {
    data_models.cancelPromotion(req, res);
});

router.post('/get_promotion_discount', (req, res) => {
    data_models.getPromotionDiscount(req, res);
});

router.post('/add_promotion_discount', (req, res) => {
    data_models.addPromotionDiscount(req, res);
});





module.exports = router;