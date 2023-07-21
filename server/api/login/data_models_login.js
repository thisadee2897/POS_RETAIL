const pool = require('../../connectdb.js');
const poolFile = require('../../connectfiledb');
const secretkey = 'TechCareSolutionSecret';
const jwt = require('jsonwebtoken');

class modelLogin{
     login(req, res){
        let username = req.body.username;
        let password;
        pool.query(`SELECT pass_word FROM security.fn_encrypt_password('${req.body.password.trim()}')`, (err, result)=>{
            if(err){
                throw err;
            }
            password = result.rows[0].pass_word;
            pool.query(`SELECT user_login.user_login_id,
                                 user_login.emp_employeemasterid,
                                 user_login.user_name,
                                 user_login.role_group_id,
                                 user_login.master_company_id,
								 roles.flag_system,
                                 emp_master.firstname,
                                 emp_master.lastname,
                                 emp_master.master_branch_id
                        FROM security.user_login AS user_login
                        INNER JOIN security.emp_employeemaster AS emp_master ON user_login.employeecode = emp_master.employeecode
						left join security.role_group as roles
						on user_login.role_group_id = roles.role_group_id
                        WHERE user_login.user_name = '${username.trim()}' AND user_login.pass_word = '${password.trim()}'
                        AND user_login.user_active = true
                        LIMIT 1         
                        `, 
                (err, result) => {
                  
                if(err){
                    throw err;
                } else if (result.rows.length > 0) {
                    var token = jwt.sign({ username: username.trim() }, secretkey, {expiresIn: '1h'});
                    res.json({ status: 200, message: 'Login Success', userinfo: result.rows, token });
                } else {
                    res.json({ status: 400, message: 'Login Failed', userinfo: result.rows, token: '' });
                }

            }); 
        });

    }

    authentions(req, res) {
        try {
            const token = req.headers.authorization.split(' ')[1];
            var decoded = jwt.verify(token, secretkey);
            res.json({ status: 'ok', decoded })
        } catch (error) {
            res.json({ status: 'error', message: error.message })
        }
    }


    fetchCompanyData(req, res){
        const company_id = req.body.company_id;
        pool.query(`SELECT * FROM master_data_all.master_company WHERE master_company_id = ${company_id}            
                        `, 
        (err, result)=>{
            if(err){
                throw err;
            }
                res.json(result.rows);
            });
    }

    getBranchData(req, res) {
        const company_id = req.body.company_id;
        const user_id = req.body.user_id;
        pool.query(`SELECT * FROM  master_data.fn_select_branch_from_user(${company_id},${user_id})`,
            (err, result) => {
                if (err) {
                    throw err;
                }
                res.json(result.rows);
            });
    }

    fetchChooseBranchData(req, res) {
        const company_id = req.body.company_id;
        const user_id = req.body.user_id;
        pool.query(`select  master_branch_id ,
                    master_branch_name ,
                    master_branch_prefix ,
                    master_branch_ho_flag ,
                    role_group_id ,
                    addr_name ,
                    master_branch_addr ,
                    master_addr_district_name ,
                    master_addr_prefecture_name ,
                    master_addr_province_name ,
                    master_addr_postcode_code ,
                    master_branch_tel,
                    master_branch_image_name  
                from security.fn_app_return_branch(${company_id}, ${user_id})`,
            (err, result) => {
                if (err) {
                    throw err;
                }            
                res.json(result.rows);
            });
    }

    getImageCompany(req, res) {
        const company_id = req.body.company_id;
        poolFile.query(`SELECT x.master_company_file_base64 as base64File, x.master_company_file_extention as extensionFile 
        FROM master_data_all.master_companypos_attachfile x WHERE x.master_company_id = ${company_id}`,
            (err, result) => {
                if (err) {
                    throw err;
                }
                res.json(result.rows);
            });
    }


}

module.exports = modelLogin;