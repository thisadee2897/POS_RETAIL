const pool = require('../../connectdb.js');

class modelRole {

    getRolegroupdata(req, res) {
        let company_id = req.body.company_id;
        pool.query(`SELECT *
                    FROM security.role_group
                    WHERE  master_company_id = ${company_id}
                    ORDER BY role_group_name ASC
                        `,
            (err, result) => {
                if (err) {
                    throw err;
                }
                res.json(result.rows);
            });
    }

    addRolegroupdata(req, res) {
        let company_id = req.body.company_id;
        let role_name = req.body.role_name;
        let role_active = req.body.role_active;
        let role_back = req.body.role_back;
        pool.query(`insert into security.role_group
                    ( role_group_name,
                     role_group_active,
                     role_group_back_date_active,
                     master_company_id
                    )
                    values (
                        '${role_name}',
                         ${role_active},
                         ${role_back},
                        '${company_id}'
                    )`,
            (err, result) => {
                if (err) {
                    throw err;
                }
                res.json(result.rows);
            });
    }


    updateRolegroupdata(req, res) {
        let role_id = req.body.role_id;
        let role_name = req.body.role_name;
        let role_active = req.body.role_active;
        pool.query(`update security.role_group
                    SET role_group_name =  '${role_name}',
                       role_group_active = ${role_active}
                    WHERE  role_group_id = ${role_id}
                        `,
            (err, result) => {
                if (err) {
                    throw err;
                }
                res.json(result.rows);
            });
    }

    getRolegroupEdit(req, res) {
        let company_id = req.body.company_id;
        let role_id = req.body.role_id;
        pool.query(`SELECT *
                    FROM security.role_group
                    WHERE  master_company_id = ${company_id} and
                       role_group_id = ${role_id}
                        `,
            (err, result) => {
                if (err) {
                    throw err;
                }
                res.json(result.rows);
            });
    }

    getRoleMenudata(req, res) {
        let company_id = req.body.company_id;
        let role_group_id = req.body.role_group_id;
        pool.query(`SELECT x.master_company_id,
                        x.master_company_name,
                        x.master_menu_id,
                        x.master_menu_code,
                        x.master_menu_name,
                        x.master_form_module_id,
                        x.master_form_module_name,
                        x.role_group_id,
                        x.role_group_name,
                        x.role_group_menu_active,
                        x.role_group_menu_back_date_active,
                        x.master_form_id,
                        x.master_form_name,
                        x.master_software_id,
                        x.master_software_name
        FROM security.fn_set_role_group_menu(${company_id}, ${role_group_id}) x;`,
            (err, result) => {
                if (err) {
                    throw err;
                }
                res.json(result.rows);
            });
    }



    getRoleMenudataShow(req, res) {
        let company_id = req.body.company_id;
        let role_group_id = req.body.role_group_id;
        pool.query(`select * from security.fn_report_vw_set_role_group_menu_posmanagement( ${company_id},${role_group_id})`,
            (err, result) => {
                if (err) {
                    throw err;
                }
                res.json(result.rows);
            });
    }



    addRoleMenudata(req, res) {
        let company_id = req.body.company_id;
        let role_id = req.body.role_id;
        let menu_id = req.body.menu_id;
        let role_menu_active = req.body.role_menu_active;
        let role_group_menu_back_date_active = req.body.role_group_menu_back_date_active
        pool.query(`insert into security.role_group_menu
                    ( role_group_id,
                     master_menu_id,
                     role_group_menu_active,
                     master_company_id,
                     role_group_menu_back_date_active
                    )
                    values (
                         ${role_id},
                         ${menu_id},
                         ${role_menu_active},
                        '${company_id}',
                        ${role_group_menu_back_date_active}
                    )`,
            (err, result) => {
                if (err) {
                    throw err;
                }
                res.json(result.rows);
            });
    }


    updateRoleMenudata(req, res) {
        let role_menu_id = req.body.role_menu_id;
        let role_id = req.body.role_id;
        let menu_id = req.body.menu_id;
        let role_menu_active = req.body.role_menu_active;
        let role_group_menu_back_date_active = req.body.role_group_menu_back_date_active
        pool.query(`update security.role_group_menu
                    SET role_group_id =  ${role_id},
                        master_menu_id = ${menu_id},
                        role_group_menu_active =  ${role_menu_active},
                        role_group_menu_back_date_active = ${role_group_menu_back_date_active}
                    WHERE   role_group_menu_id = ${role_menu_id}
                        `,
            (err, result) => {
                if (err) {
                    throw err;
                }
                res.json(result.rows);
            });
    }

    getRoleMenuEdit(req, res) {
        let company_id = req.body.company_id;
        let role_menu_id = req.body.role_menu_id;
        pool.query(`SELECT * FROM security.role_group_menu as rolemenu
                    INNER JOIN security.role_group as role ON
                                rolemenu.role_group_id = role.role_group_id
                    INNER JOIN master_data_all.master_menu  as menu
                    ON  rolemenu.master_menu_id = menu.master_menu_id
                    WHERE  rolemenu.master_company_id  = ${company_id}
                    AND rolemenu.role_group_menu_id = ${role_menu_id}
                        `,
            (err, result) => {
                if (err) {
                    throw err;
                }
                res.json(result.rows);
            });
    }


    getcheckMenuGroup(req, res) {
        let company_id = req.body.company_id;
        let role_group_id = req.body.role_group_id;
        let menu_id = req.body.menu_id;
        pool.query(`SELECT * FROM security.role_group_menu
                    WHERE master_company_id  = ${company_id}
                    AND role_group_id = ${role_group_id}
                    AND master_menu_id = ${menu_id}
                        `,
            (err, result) => {
                if (err) {
                    throw err;
                }
                res.json(result.rows);
            });
    }

    getMenudata(req, res) {
        pool.query(`SELECT *
                    FROM master_data_all.master_menu
                    ORDER BY master_menu_name ASC
                        `,
            (err, result) => {
                if (err) {
                    throw err;
                }
                res.json(result.rows);
            });
    }


    getMenudatapath(req, res) {
        const path_name = req.body.path_name;
        pool.query(`select menu.* ,modules.master_form_module_name
                            from master_data_all.master_menu  as menu
                            left join master_data_all.master_form_module  modules
                            on menu.master_form_module_id = modules.master_form_module_id
                            where menu.master_menu_path = '${path_name}'`,
            (err, result) => {
                if (err) {
                    throw err;
                }
                res.json(result.rows);
            });
    }

    getformModule(req, res) {
        pool.query(`SELECT *
                    FROM master_data_all.master_form_module
                    ORDER BY master_form_module_name ASC
                        `,
            (err, result) => {
                if (err) {
                    throw err;
                }
                res.json(result.rows);
            });
    }

    getformModuleSub(req, res) {
        let module_id = req.body.module_id;
        pool.query(`SELECT *
                    FROM master_data_all.master_form_module_sub
                    WHERE master_form_module_id =  ${module_id}
                        `,
            (err, result) => {
                if (err) {
                    throw err;
                }
                res.json(result.rows);
            });
    }

    getEmployeedata(req, res) {
        let company_id = req.body.company_id;
        if (company_id) {
            pool.query(`select
em.emp_employeemasterid,em.employeecode,em.emp_title_id,em.firstname,
em.lastname,em.master_branch_id,em.nickname,em.master_company_id,em.employee_tel,em.fullname,
emtitle.emp_title_name,emtitle.emp_title_name_eng,company.master_company_name,
branch.master_branch_name,login.user_login_id,loginmul.role_group_id,loginmul.role_group_active
from  security.emp_employeemaster  as em
Left JOIN security.emp_title as emtitle ON em.emp_title_id = emtitle.emp_title_id
Left JOIN master_data_all.master_company as company ON em.master_company_id = company.master_company_id
Left JOIN master_data.master_branch as branch ON em.master_branch_id  = branch.master_branch_id and company.master_company_id = branch.master_company_id
Left Join security.user_login as login ON em.emp_employeemasterid = login.emp_employeemasterid and em.master_company_id = login.master_company_id
Left Join security.user_login_multi_role_group as loginmul ON login.user_login_id = loginmul.user_login_id and loginmul.role_group_active = true
                    WHERE em.master_company_id  = ${company_id}
                    ORDER BY em.emp_employeemasterid asc
                        `,
                (err, result) => {
                    if (err) {
                        throw err;
                    }
                    res.json(result.rows);
                });

        } else {

            pool.query(`select em.emp_employeemasterid,em.employeecode,em.emp_title_id,em.firstname,
                            em.lastname,em.master_branch_id,em.nickname,em.master_company_id,em.employee_tel,em.fullname,
                            emtitle.emp_title_name,emtitle.emp_title_name_eng,company.master_company_name,branch.master_branch_name
                            from  security.emp_employeemaster  as em
                            INNER JOIN security.emp_title as emtitle
                            ON em.emp_title_id = emtitle.emp_title_id
                            INNER JOIN master_data_all.master_company as company
                            ON em.master_company_id = company.master_company_id
                            INNER JOIN master_data.master_branch as branch
                            ON em.master_branch_id  = branch.master_branch_id
                    ORDER BY em.emp_employeemasterid asc
                        `,
                (err, result) => {
                    if (err) {
                        throw err;
                    }
                    res.json(result.rows);
                });
        }
    }

    getCompanydata(req, res) {
        pool.query(`SELECT *
                    FROM master_data_all.master_company
                    ORDER BY master_company_name ASC
                        `,
            (err, result) => {
                if (err) {
                    throw err;
                }
                res.json(result.rows);
            });
    }

    getBranchsCode(req, res) {
        let company_id = req.body.company_id;
        let branch_id = req.body.branch_id;
        pool.query(`SELECT *
                    FROM master_data.master_branch
                    WHERE master_company_id  = '${company_id}' and
                    master_branch_id = '${branch_id}'
                    ORDER BY master_branch_id ASC
                        `,
            (err, result) => {
                if (err) {
                    throw err;
                }
                res.json(result.rows);
            });
    }

    getEmtitleata(req, res) {
        pool.query(`SELECT *
                    FROM security.emp_title
                    ORDER BY emp_title_name ASC
                        `,
            (err, result) => {
                if (err) {
                    throw err;
                }
                res.json(result.rows);
            });
    }

    addEmployeedata(req, res) {
        let company_id = req.body.company_id;
        let branch_id = req.body.branch_id;
        let em_code = req.body.em_code;
        let em_title_id = req.body.em_title_id;
        let em_name = req.body.em_name;
        let em_lastname = req.body.em_lastname;
        let em_nickname = req.body.em_nickname;
        let fullname = req.body.fullname;
        pool.query(`insert into security.emp_employeemaster
                    ( master_company_id,
                     master_branch_id,
                     employeecode,
                     emp_title_id,
                     firstname,
                     lastname,
                     nickname,
                     fullname
                    )
                    values (
                        '${company_id}',
                        '${branch_id}',
                        '${em_code}',
                        '${em_title_id}',
                        '${em_name}',
                        '${em_lastname}',
                        '${em_nickname}',
                        '${fullname}'
                    )RETURNING emp_employeemasterid;`,
            (err, result) => {
                if (err) {
                    throw err;
                }
                res.json(result.rows);
            });
    }

    addEmployeedataMutil(req, res) {
        let company_id = req.body.company_id;
        let active = req.body.active;
        let em_id = req.body.em_id;
        pool.query(`insert into security.emp_employeemaster_multi_company
                    ( master_company_id,
                     emp_employeemasterid,
                     master_company_active
                    )
                    values (
                        '${company_id}',
                        '${em_id}',
                        '${active}'
                    )`,
            (err, result) => {
                if (err) {
                    throw err;
                }
                res.json(result.rows);
            });
    }

    getEmployeedataEdit(req, res) {
        let em_id = req.body.em_id;
        pool.query(`select em.emp_employeemasterid,em.employeecode,em.emp_title_id,em.firstname,
                            em.lastname,em.master_branch_id,em.nickname,em.master_company_id,em.employee_tel,em.fullname,
                            emtitle.emp_title_name,emtitle.emp_title_name_eng,company.master_company_name,branch.master_branch_name,
							login.user_login_id,login.user_name,login.pass_word,  loginmul.role_group_id,loginmul.role_group_active
                            from  security.emp_employeemaster  as em
                            Left JOIN security.emp_title as emtitle
                            ON em.emp_title_id = emtitle.emp_title_id
                            Left JOIN master_data_all.master_company as company
                            ON em.master_company_id = company.master_company_id
                            Left JOIN master_data.master_branch as branch
                            ON em.master_branch_id  = branch.master_branch_id
							Left Join security.user_login as login
							ON em.emp_employeemasterid = login.emp_employeemasterid
							Left Join security.user_login_multi_role_group as loginmul
							ON login.user_login_id = loginmul.user_login_id
                    WHERE em.emp_employeemasterid  = ${em_id}
                        `,
            (err, result) => {
                if (err) {
                    throw err;
                }
                res.json(result.rows);
            });
    }

    updateEmployeedata(req, res) {
        let company_id = req.body.company_id;
        let branch_id = req.body.branch_id;
        let em_code = req.body.em_code;
        let em_title_id = req.body.em_title_id;
        let em_name = req.body.em_name;
        let em_lastname = req.body.em_lastname;
        let em_nickname = req.body.em_nickname;
        let em_id = req.body.em_id;
        let fullname = req.body.fullname;
        pool.query(`UPDATE  security.emp_employeemaster
                    SET master_company_id =  '${company_id}',
                        master_branch_id =  '${branch_id}',
                        employeecode =  '${em_code}',
                        emp_title_id =  '${em_title_id}',
                        firstname =  '${em_name}',
                        lastname =  '${em_lastname}',
                        nickname =  '${em_nickname}',
                        fullname =  '${fullname}'
                   WHERE emp_employeemasterid  = ${em_id}
                   `,
            (err, result) => {
                if (err) {
                    throw err;
                }
                res.json(result.rows);
            });
    }

    getCompanydataID(req, res) {
        let company_id = req.body.company_id;
        pool.query(`select  * from master_data_all.master_company
                    where master_company_id = ${company_id}`,
            (err, result) => {
                if (err) {
                    throw err;
                }
                res.json(result.rows);
            });
    }

    getCompanymulti(req, res) {
        let em_id = req.body.em_id;
        pool.query(`select  * from security.emp_employeemaster_multi_company as emmulti
                    inner join master_data_all.master_company as cm on
                    emmulti.master_company_id = cm.master_company_id
                    where emmulti.emp_employeemasterid = ${em_id}`,
            (err, result) => {
                if (err) {
                    throw err;
                }
                res.json(result.rows);
            });
    }

    getRoleuserData(req, res) {
        let company_id = req.body.company_id;
        let em_id = req.body.em_id;
        pool.query(`select * from security.fn_report_vw_user_set_role_branch('${company_id}', '${em_id}')`,
            (err, result) => {
                if (err) {
                    throw err;
                }
                res.json(result.rows);
            });
    }

    getRolemultiuserData(req, res) {
        let em_id = req.body.em_id;
        pool.query(`select * from security.user_login_multi_role_group as us
                    left  join security.role_group  as role
                    on us.role_group_id = role.role_group_id
					left  join security.user_login  as users
					on users.user_login_id = us.user_login_id
					left join master_data_all.master_company as cm
					on us.master_company_id = cm.master_company_id
                    where users.emp_employeemasterid = ${em_id}`,
            (err, result) => {
                if (err) {
                    throw err;
                }
                res.json(result.rows);
            });
    }

    updateRolemultiuserData(req, res) {
        let user_role_id = req.body.user_role_id;
        let role_group_id = req.body.role_group_id;
        pool.query(`UPDATE security.user_login_multi_role_group
                    SET role_group_id =  ${role_group_id}
                   WHERE user_login_multi_role_group_id  = ${user_role_id}
                   `,
            (err, result) => {
                if (err) {
                    throw err;
                }
                res.json(result.rows);
            });
    }

    addRolemultiuserData(req, res) {
        let user_id = req.body.user_id;
        let role_group_id = req.body.role_group_id;
        let active = req.body.active;
        let company_id = req.body.company_id;
        pool.query(`insert into security.user_login_multi_role_group (
                       user_login_id,
                        role_group_id,
                        role_group_active,
                        master_company_id
                    )
                    values (
                        ${user_id},
                        ${role_group_id},
                        ${active},
                        ${company_id}
                    ) `,
            (err, result) => {
                if (err) {
                    throw err;
                }
                res.json(result.rows);
            });
    }

    getUserlogin(req, res) {
        let em_id = req.body.em_id;
        let user_id = req.body.user_id;
        if (em_id) {
            pool.query(`select * from security.user_login as users
                        inner join security.emp_employeemaster as emps
                        on  users.emp_employeemasterid  = emps.emp_employeemasterid
                        WHERE  users.emp_employeemasterid  = '${em_id}'
                   `,
                (err, result) => {
                    if (err) {
                        throw err;
                    }
                    res.json(result.rows);
                });
        } else if (user_id) {
            pool.query(`SELECT * from security.user_login as users
                                left join security.emp_employeemaster as emps
                                on users.emp_employeemasterid = emps.emp_employeemasterid
                                left join security.role_group as roles
                                on users.role_group_id = roles.role_group_id
                        WHERE   user_login_id  = '${user_id}'
                   `,
                (err, result) => {
                    if (err) {
                        throw err;
                    }
                    res.json(result.rows);
                });
        } else {
            pool.query(`select * from security.user_login as users
                        inner join security.emp_employeemaster as emps
                        on users.emp_employeemasterid = emps.emp_employeemasterid`,
                (err, result) => {
                    if (err) {
                        throw err;
                    }
                    res.json(result.rows);
                });
        }
    }

    addUserlogin(req, res) {
        let em_id = req.body.em_id;
        let user_name = req.body.user_name;
        let pass_word = req.body.pass_word;
        let user_active = req.body.user_active;
        let role_group_id = req.body.role_group_id;
        let em_code = req.body.em_code;
        let config_active = req.body.config_active;
        let company_id = req.body.company_id;
        pool.query(`insert into security.user_login (
                        emp_employeemasterid,
                        user_name,
                        pass_word,
                        user_active,
                        role_group_id,
                        master_company_id,
                        employeecode,
                        system_config_active
                    )
                    values (
                        ${em_id},
                        '${user_name}',
                        '${pass_word}',
                        ${user_active},
                        ${role_group_id},
                        ${company_id},
                        '${em_code}',
                        ${config_active}
                    )RETURNING user_login_id;`,
            (err, result) => {
                if (err) {
                    throw err;
                }
                res.json(result.rows);
            });
    }


    updateUserlogin(req, res) {
        let em_id = req.body.em_id;
        let user_name = req.body.user_name;
        let user_id = req.body.user_id;
        let old_pass_word = req.body.old_pass_word;
        let pass_word = req.body.pass_word;
        let user_active = req.body.user_active;
        let role_group_id = req.body.role_group_id;
        let em_code = req.body.em_code;
        let config_active = req.body.config_active;
        let company_id = req.body.company_id;
        pool.query(`update security.user_login
                     set   emp_employeemasterid = ${em_id},
                        user_name = '${user_name}',
                        pass_word = '${pass_word}',
                        old_pass_word = '${old_pass_word}',
                        user_active = ${user_active},
                        role_group_id = ${role_group_id},
                        master_company_id = ${company_id},
                        employeecode = '${em_code}',
                        system_config_active = ${config_active}
                    where user_login_id = ${user_id}
                    `,
            (err, result) => {
                if (err) {
                    throw err;
                }
                res.json(result.rows);
            });
    }


    enCodeUserlogin(req, res) {
        let pass = req.body.pass;
        pool.query(`select * from security.fn_encrypt_password('${pass}')`,
            (err, result) => {
                if (err) {
                    throw err;
                }
                res.json(result.rows);
            });
    }

    getUserloginSetbranch(req, res) {
        let user_role_id = req.body.user_role_id;
        pool.query(`select * from security.user_login_set_branch
                   WHERE user_login_id  = '${user_role_id}'
                   `,
            (err, result) => {
                if (err) {
                    throw err;
                }
                res.json(result.rows);
            });
    }

    addUserloginSetbranch(req, res) {
        let company_id = req.body.company_id;
        let branch_id = req.body.branch_id;
        let em_code = req.body.em_code;
        let user_id = req.body.user_id;
        let active = req.body.active;
        pool.query(`insert into security.user_login_set_branch
                    ( master_company_id,
                     master_branch_id,
                     employeecode,
                     user_login_id,
                     master_branch_active_flag
                     
                    )
                    values (
                        '${company_id}',
                        '${branch_id}',
                        '${em_code}',
                        '${user_id}',
                         ${active}
                    )`,
            (err, result) => {
                if (err) {
                    throw err;
                }
                res.json(result.rows);
            });
    }

    updateUserloginSetbranch(req, res) {
        let user_branch_set_id = req.body.user_branch_set_id;
        let company_id = req.body.company_id;
        let branch_id = req.body.branch_id;
        let em_code = req.body.em_code;
        let user_id = req.body.user_id;
        let active = req.body.active;
        pool.query(`UPDATE  security.user_login_set_branch
                    SET  master_company_id = ${company_id},
                         master_branch_id = ${branch_id},
                         employeecode = '${em_code}',
                         user_login_id = ${user_id},
                         master_branch_active_flag  = ${active}
                   WHERE user_login_set_branch_id  = ${user_branch_set_id}
                   `,
            (err, result) => {
                if (err) {
                    throw err;
                }
                res.json(result.rows);
            });
    }

    getRoleGroupMenu(req, res) {
        const company_id = req.body.company_id;
        const role_group_id = req.body.role_group_id;
        pool.query(`SELECT x.master_company_id,
                        x.master_company_name,
                        x.master_menu_id,
                        x.master_menu_code,
                        x.master_menu_name,
                        x.master_form_module_id,
                        x.master_form_module_name,
                        x.role_group_id,
                        x.role_group_name,
                        x.master_form_id,
                        x.master_form_name,
                        x.role_group_menu_id,
                        x.master_software_id,
                        x.master_software_name
                        FROM "security"."fn_set_role_group_menu_subject"(${company_id}, ${role_group_id}) x;`,
            (err, result) => {
                if (err) {
                    throw err;
                }
                res.json(result.rows);
            });
    }


    getRoleGroupMenuAction(req, res) {
        const role_group_id = req.body.role_group_id;
        const master_menu_id = req.body.master_menu_id;
        const master_company_id = req.body.master_company_id;
        pool.query(`SELECT role_menu_act.*,roles_menu.role_group_menu_back_date_active, actions.master_menu_action_name,actions.master_menu_action_name_eng
                       from security.role_group_menu_action as role_menu_act
                       left join master_data_all.master_menu_action as actions
                       on role_menu_act.master_menu_action_id = actions.master_menu_action_id
					   left join security.role_group_menu as roles_menu
					   on role_menu_act.role_group_id = roles_menu.role_group_id
                      where role_menu_act.master_menu_id = ${master_menu_id}
                      and role_menu_act.master_company_id = ${master_company_id}
                      and role_menu_act.role_group_id = ${role_group_id}
                      and roles_menu.master_menu_id= ${master_menu_id}`,
            (err, result) => {
                if (err) {
                    throw err;
                }
                res.json(result.rows);
            });
    }

    get_menu_action(req, res) {
        pool.query(`select * from master_data_all.master_menu_action`,
            (err, result) => {
                if (err) {
                    throw err;
                }
                res.json(result.rows);
            });

    }

    checkRoleGroupMenuAction(req, res) {
        const role_group_id = req.body.role_group_id;
        const master_menu_id = req.body.master_menu_id;
        const master_company_id = req.body.master_company_id;
        const master_menu_action_id = req.body.master_menu_action_id;
        const role_group_menu_id = req.body.role_group_menu_id;
        pool.query(`SELECT * from security.role_group_menu_action 
                    WHERE role_group_id = ${role_group_id} 
                    AND master_menu_id = ${master_menu_id} 
                    AND master_company_id = ${master_company_id} 
                    AND master_menu_action_id = ${master_menu_action_id}
                    AND role_group_menu_id = ${role_group_menu_id}`,
            (err, result) => {
                if (err) {
                    throw err;
                }
                res.json(result.rows);
            });
    }

    addRoleGroupMenuAction(req, res) {
        const master_company_id = req.body.master_company_id;
        const master_menu_id = req.body.master_menu_id;
        const role_group_id = req.body.role_group_id;
        const role_group_menu_action_active = req.body.role_group_menu_action_active;
        const role_group_menu_id = req.body.role_group_menu_id;
        const master_menu_action_id = req.body.master_menu_action_id;
        pool.query(`INSERT INTO "security".role_group_menu_action(
                        master_company_id, 
                        master_menu_id,
                        role_group_id,
                        role_group_menu_action_active,
                        role_group_menu_id,
                        master_menu_action_id
                        )
                    VALUES (
                        ${master_company_id}, 
                        ${master_menu_id},
                        ${role_group_id},
                        ${role_group_menu_action_active},
                        ${role_group_menu_id},
                        ${master_menu_action_id}
            );`,
            (err, result) => {
                if (err) {
                    throw err;
                }
                res.json(result.rows);
            });
    }

    updateRoleGroupMenuAction(req, res) {
        const role_group_menu_action_active = req.body.role_group_menu_action_active;
        const role_group_menu_action_id = req.body.role_group_menu_action_id;
        pool.query(`UPDATE "security".role_group_menu_action
        SET role_group_menu_action_active = ${role_group_menu_action_active}
        WHERE role_group_menu_action_id = ${role_group_menu_action_id};`,
            (err, result) => {
                if (err) {
                    throw err;
                }
                res.json(result.rows);
            });
    }

    checkUserPermission(req, res) {
        const company_id = req.body.company_id;
        const role_group_id = req.body.role_group_id;
        pool.query(`SELECT "master_data_all"."fn_check_menu_branch_setting"(${company_id}, ${role_group_id});`,
            (err, result) => {
                if (err) {
                    throw err;
                }
                res.json(result.rows);
            });
    }

    get_master_filter(req, res) {
        pool.query(`select * from  master_data_all.master_filter  
                        where master_filter_active = true
                       order by master_filter_id asc`,
            (err, result) => {
                if (err) {
                    throw err;
                }
                res.json(result.rows);
            });
    }

    get_master_filterreport(req, res) {
        const master_menu_id = req.body.master_menu_id;
        pool.query(`select * from master_data_all.master_filter_report as filterreport
                            left join master_data_all.master_filter  as filters
                            on filterreport.master_filter_id = filters.master_filter_id
                            where filterreport.master_menu_id = ${master_menu_id}
                            and filters.master_filter_active = true
                           and filterreport.master_filter_report_active = true
                   order by filterreport.master_filter_listno asc`,
            (err, result) => {
                if (err) {
                    throw err;
                }
                res.json(result.rows);
            });
    }
}

module.exports = modelRole;