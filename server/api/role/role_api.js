const express = require('express');
const { json } = require('express/lib/response');
const router = express.Router();
const models = require('./data_models_role');
const data_models = new models();

router.post('/get_rolegroup_data', (req, res) => {
    data_models.getRolegroupdata(req, res);
});

router.post('/add_rolegroup_data', (req, res) => {
    data_models.addRolegroupdata(req, res);
});

router.post('/update_rolegroup_data', (req, res) => {
    data_models.updateRolegroupdata(req, res);
});

router.post('/get_rolegroup_edit', (req, res) => {
    data_models.getRolegroupEdit(req, res);
});

router.post('/get_rolemenu_data', (req, res) => {
    data_models.getRoleMenudata(req, res);
});

router.post('/get_rolemenu_show', (req, res) => {
    data_models.getRoleMenudataShow(req, res);
});

router.post('/add_rolemenu_data', (req, res) => {
    data_models.addRoleMenudata(req, res);
});

router.post('/update_rolemenu_data', (req, res) => {
    data_models.updateRoleMenudata(req, res);
});

router.post('/get_rolemenu_edit', (req, res) => {
    data_models.getRoleMenuEdit(req, res);
});

router.post('/get_rolemenu_check', (req, res) => {
    data_models.getcheckMenuGroup(req, res);
});

router.get('/get_menu_data', (req, res) => {
    data_models.getMenudata(req, res);
});

router.post('/get_menu_data_path', (req, res) => {
    data_models.getMenudatapath(req, res);
});

router.get('/get_form_module', (req, res) => {
    data_models.getformModule(req, res);
});

router.post('/get_form_modulesub', (req, res) => {
    data_models.getformModuleSub(req, res);
});

router.post('/get_employee_data', (req, res) => {
    data_models.getEmployeedata(req, res);
});

router.get('/get_company_data', (req, res) => {
    data_models.getCompanydata(req, res);
});

router.get('/get_emtitle_data', (req, res) => {
    data_models.getEmtitleata(req, res);
});

router.post('/get_branchs_code', (req, res) => {
    data_models.getBranchsCode(req, res);
});


router.post('/add_employee_data', (req, res) => {
    data_models.addEmployeedata(req, res);
});

router.post('/add_employee_data_muti', (req, res) => {
    data_models.addEmployeedataMutil(req, res);
});

router.post('/get_employee_edit', (req, res) => {
    data_models.getEmployeedataEdit(req, res);
});

router.post('/update_employee_data', (req, res) => {
    data_models.updateEmployeedata(req, res);
});

router.post('/get_company_data_id', (req, res) => {
    data_models.getCompanydataID(req, res);
});

router.post('/get_company_multi', (req, res) => {
    data_models.getCompanymulti(req, res);
});

router.post('/get_roleuser_data', (req, res) => {
    data_models.getRoleuserData(req, res);
});

router.post('/get_roleusermulti_data', (req, res) => {
    data_models.getRolemultiuserData(req, res);
});

router.post('/get_role_group_menu', (req, res) => {
    data_models.getRoleGroupMenu(req, res);
});

router.post('/check_role_group_menu_action', (req, res) => {
    data_models.checkRoleGroupMenuAction(req, res);
});

router.post('/get_role_group_menu_action', (req, res) => {
    data_models.getRoleGroupMenuAction(req, res);
});

router.get('/get_menu_action', (req, res) => {
    data_models.get_menu_action(req, res);
});

router.post('/add_role_group_menu_action', (req, res) => {
    data_models.addRoleGroupMenuAction(req, res);
});

router.post('/update_role_group_menu_action', (req, res) => {
    data_models.updateRoleGroupMenuAction(req, res);
});

router.post('/update_roleusermulti_data', (req, res) => {
    data_models.updateRolemultiuserData(req, res);
});

router.post('/add_roleusermulti_data', (req, res) => {
    data_models.addRolemultiuserData(req, res);
});

router.post('/get_user_login', (req, res) => {
    data_models.getUserlogin(req, res);
});

router.post('/add_user_login', (req, res) => {
    data_models.addUserlogin(req, res);
});

router.post('/update_user_login', (req, res) => {
    data_models.updateUserlogin(req, res);
});

router.post('/encode_user_login', (req, res) => {
    data_models.enCodeUserlogin(req, res);
});

router.post('/get_user_login_set_branch', (req, res) => {
    data_models.getUserloginSetbranch(req, res);
});

router.post('/add_user_login_set_branch', (req, res) => {
    data_models.addUserloginSetbranch(req, res);
});

router.post('/update_user_login_set_branch', (req, res) => {
    data_models.updateUserloginSetbranch(req, res);
});

router.post('/get_check_user_Permission', (req, res) => {
    data_models.checkUserPermission(req, res);
});

router.get('/get_master_filter', (req, res) => {
    data_models.get_master_filter(req, res);
});

router.post('/get_master_filterreport', (req, res) => {
    data_models.get_master_filterreport(req, res);
});

module.exports = router;
