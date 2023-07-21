const express = require('express');
const { json } = require('express/lib/response');
const router = express.Router();
const models = require('./data_models_sidebar');
const data_models = new models();


router.post('/get_sidebar_data', (req, res) => {
    data_models.getSidebarData(req, res);
});

module.exports = router;