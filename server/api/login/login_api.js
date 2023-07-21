const express = require('express');
const router = express.Router();
const models = require('./data_models_login');
const data_models = new models();
const jwt = require("jsonwebtoken");

router.post('/login',  (req, res) => {
    data_models.login(req, res);
});

router.post('/authen', (req, res) => {
    data_models.authentions(req, res);
});


router.post('/get_company_data',(req, res)=>{
    data_models.fetchCompanyData(req, res);
});

router.post('/get_branch_data', (req, res) => {
    data_models.getBranchData(req, res);
});

router.post('/get_choose_branch_data', (req, res) => {
    data_models.fetchChooseBranchData(req, res);
});

router.post('/get_image_company', (req, res) => {
    data_models.getImageCompany(req, res);
});

router.get('/',(req, res)=>{
    res.send('Hello');
});



module.exports = router;
