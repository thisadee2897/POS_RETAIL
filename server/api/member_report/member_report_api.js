const express = require('express');
const router = express.Router();
const models = require('./data_model_member_report');
const data_models = new models();

router.post('/get_service_history_data', (req, res) => {
    data_models.fetcServiceHistoryData(req, res);
});


module.exports = router;