const pool = require('../../connectdb.js');

class modelSidebar {

    getSidebarData(req, res) {
        const company_id = req.body.company_id;
        const user_login_id = req.body.user_login_id;
        pool.query(`SELECT y.role_group_id from "security".user_login x 
                    LEFT JOIN "security".user_login_multi_role_group y ON x.user_login_id = y.user_login_id WHERE y.user_login_id = ${user_login_id} AND y.role_group_active = TRUE`,
            (err, result) => {
                if (err) {
                    throw err;
                } else {
                    pool.query(`SELECT * FROM security.fn_set_role_group_menu_json(${company_id}, ${result.rows[0].role_group_id});`,
                        (err, result) => {
                            if (err) {
                                throw err;
                            }
                            res.json(result.rows);
                        });
                }

            });
    }

}

module.exports = modelSidebar;