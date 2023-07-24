const pool = require('../../connectdb.js');
const poolFile = require('../../connectfiledb');
const fs = require('fs-extra');

class ModelStoreManagement {

    getShiftdata(req, res) {
        const company_id = req.body.company_id;
        const branch_id = req.body.branch_id;
        pool.query(`select shift_job.* ,
                        case
                             when shift_job.master_shift_job_active = true then 'เปิดการใช้งาน'  else 'ปิดการใช้งาน' end
                             as master_shift_job_active_name,
                        case
                             when shift_job.master_shift_job_last_day_active = true then 'เปิดการใช้งาน'  else 'ปิดการใช้งาน' end
                             as master_shift_job_last_day_active_name
                        from master_data.master_shift_job  shift_job
                                where shift_job.master_company_id = ${company_id}
                                and shift_job.master_shift_job_branch_id = ${branch_id}
		                        ORDER BY shift_job.master_shift_job_id desc`,
            (err, result) => {
                if (err) {
                    throw err;
                }
                res.json(result.rows);
            });
    }
    addShiftdata(req, res) {
        const branch_id = req.body.branch_id;
        const company_id = req.body.company_id;
        const job_name = req.body.master_shift_job_name;
        const job_remark = req.body.master_shift_job_remark;
        const job_empsave_id = req.body.master_shift_job_empsave_id;
        const job_last_day_active = req.body.master_shift_job_last_day_active;
        const active = req.body.master_shift_job_active;
        pool.query(`insert into master_data.master_shift_job
        (
            master_shift_job_name,
            master_shift_job_remark,
            master_shift_job_empsave_id,
            master_shift_job_savetime,
            master_shift_job_branch_id,
            master_company_id,
            master_shift_job_last_day_active,
            master_shift_job_active
        )
        VALUES
        (
            '${job_name}',
            '${job_remark}',
            ${job_empsave_id},
            now(),
            ${branch_id},
            ${company_id},
            ${job_last_day_active},
            ${active}
        )RETURNING master_shift_job_id;`,
            (err, result) => {
                if (err) {
                    throw err;
                } else if (job_last_day_active == true) {
                    // ${result.rows[0]['cq_bankbook_id']}
                    pool.query(`UPDATE master_data.master_shift_job SET
                    master_shift_job_last_day_active = false 
                    WHERE master_shift_job_id != ${result.rows[0]['master_shift_job_id']}`, (err, result) => {
                        if (err) {
                            throw err;
                        } else {
                            res.json(result.rows);
                        }
                    })
                } else {
                    res.json(result.rows);
                }
            });
    }
    updateShiftdata(req, res) {
        const id = req.body.master_shift_job_id;
        const job_name = req.body.master_shift_job_name;
        const job_remark = req.body.master_shift_job_remark;
        const empsave_id = req.body.master_shift_job_empsave_id;
        const last_day_active = req.body.master_shift_job_last_day_active;
        const active = req.body.master_shift_job_active;
        const company_id = req.body.company_id;
        const branch_id = req.body.branch_id;
        pool.query(`UPDATE master_data.master_shift_job
                    SET master_shift_job_name = '${job_name}',
                    master_shift_job_remark = '${job_remark}',
                    master_shift_job_empsave_id = ${empsave_id},
                    master_shift_job_savetime = now(),
                    master_shift_job_last_day_active =  ${last_day_active},
                    master_shift_job_active = ${active}
                    WHERE master_shift_job_id = ${id};`,
            (err, result) => {
                if (err) {
                    throw err;
                } else if (last_day_active === true) {
                    pool.query(`UPDATE master_data.master_shift_job SET
                    master_shift_job_last_day_active = false WHERE master_company_id = ${company_id} AND master_shift_job_branch_id = ${branch_id} AND master_shift_job_id != ${id}
                    `, (err, result) => {
                        if (err) {
                            throw err;
                        } else {
                            res.json({ message: 1 });
                        }
                    })
                } else {
                    res.json({ message: 1 });
                }

            });
    }

    getCashierMachineData(req, res) {
        let company_id = req.body.company_id;
        let branch_id = req.body.branch_id;
        pool.query(`SELECT * FROM master_data.master_pos_cashier_machine 
                    WHERE master_company_id = ${company_id}
                    AND   master_pos_cashier_machine_branch_id = ${branch_id}
                    ORDER BY master_pos_cashier_machine_id DESC`,
            (err, result) => {
                if (err) {
                    throw err;
                }
                res.json(result.rows);
            });
    }
    addCashierMachineData(req, res) {
        let master_company_id = req.body.master_company_id;
        let master_pos_cashier_machine_branch_id = req.body.master_pos_cashier_machine_branch_id;
        let master_pos_cahier_machine_active = req.body.master_pos_cahier_machine_active;
        let master_pos_cashier_machine_empsave_id = req.body.master_pos_cashier_machine_empsave_id;
        let master_pos_cashier_machine_name = req.body.master_pos_cashier_machine_name;
        let master_pos_cashier_machine_remark = req.body.master_pos_cashier_machine_remark;
        pool.query(`INSERT INTO master_data.master_pos_cashier_machine 
                    (  master_company_id,
                       master_pos_cashier_machine_branch_id,
                        master_pos_cahier_machine_active,
                        master_pos_cashier_machine_empsave_id,
                        master_pos_cashier_machine_name,
                        master_pos_cashier_machine_remark )
                  VALUES ( ${master_company_id},
                        ${master_pos_cashier_machine_branch_id},
                        ${master_pos_cahier_machine_active},
                        ${master_pos_cashier_machine_empsave_id},
                        '${master_pos_cashier_machine_name}',
                        '${master_pos_cashier_machine_remark}') `,
            (err, result) => {
                if (err) {
                    throw err;
                }
                res.json(result.rows);
            });
    }
    updateCashierMachineData(req, res) {
        let master_pos_cashier_machine_id = req.body.master_pos_cashier_machine_id;
        let master_pos_cahier_machine_active = req.body.master_pos_cahier_machine_active;
        let master_pos_cashier_machine_name = req.body.master_pos_cashier_machine_name;
        let master_pos_cashier_machine_remark = req.body.master_pos_cashier_machine_remark;
        pool.query(`UPDATE  master_data.master_pos_cashier_machine
                    SET     master_pos_cahier_machine_active = ${master_pos_cahier_machine_active},
                            master_pos_cashier_machine_name = '${master_pos_cashier_machine_name}',
                            master_pos_cashier_machine_remark =  '${master_pos_cashier_machine_remark}'
                    WHERE   master_pos_cashier_machine_id = ${master_pos_cashier_machine_id} `,
            (err, result) => {
                if (err) {
                    throw err;
                }
                res.json(result.rows);
            });
    }




    getTypeProductManagement(req, res) {
        const company_id = req.body.company_id;
        const branch_id = req.body.branch_id;
        pool.query(`select * from master_data.fn_get_master_product_type(${company_id},${branch_id})`,
            (err, result) => {
                if (err) {
                    console.error(err);
                    res.status(500).json(err);
                    throw err;
                }
                res.status(200).json(result.rows);
            }
        );
    }
    addTypeProductManagement(req, res) {
        const company_id = req.body.company_id;
        const code = req.body.master_product_type_code;
        const name = req.body.master_product_type_name;
        const active = req.body.master_product_type_active;
        console.log(req.body)
        const query = {
            text: 'SELECT master_data.fn_add_master_product_type($1, $2, $3, $4)',
            values: [company_id, code, name, active],
        };
        pool.query(query, (err, result) => {
            if (err) {
                console.error(err);
                res.status(500).json(err);
                throw err;
            }
            // console.log(result.rows);
            res.status(200).json(result.rows);
        });
    }
    updateTypeProductManagement(req, res) {
        let company_id = req.body.company_id;
        let code = req.body.master_product_type_code;
        let name = req.body.master_product_type_name;
        let active = req.body.master_product_type_active;
        let master_product_type_id = req.body.master_product_type_id;
        let query = {
            text: 'SELECT master_data.fn_update_master_product_type($1, $2, $3, $4,$5)',
            values: [company_id, code, name, active, master_product_type_id],
        };
        pool.query(query, (err, result) => {
            if (err) {
                console.error(err);
                res.status(500).json(err);
                throw err;
            }
            console.log(result.rows);
            res.status(200).json({ message: 'Data updated successfully.' });
        });
    }




    getCategoryProductManagement(req, res) {
        const company_id = req.body.company_id;
        pool.query(`select * from master_data.fn_get_category_product_management(${company_id})`,
            (err, result) => {
                if (err) {
                    console.error(err);
                    res.status(500).json(err);
                    throw err;
                }
                res.status(200).json(result.rows);
            }
        );
    }
    addCategoryProductManagement(req, res) {
        const company_id = req.body.company_id;
        const type_id = req.body.master_product_type_id
        const code = req.body.master_product_category_code;
        const nameTH = req.body.master_product_category_name;
        const nameEN = req.body.master_product_category_name_eng;
        const active = req.body.master_product_category_active;
        console.log(req.body)
        const query = {
            text: 'SELECT master_data.fn_add_category_product_management($1, $2, $3, $4, $5, $6)',
            values: [company_id, type_id, code, nameTH, nameEN, active],
        };
        pool.query(query, (err, result) => {
            if (err) {
                console.error(err);
                res.status(500).json(err);
                throw err;
            }
            // console.log(result.rows);
            res.status(200).json(result.rows);
        });
    }
    updateCategoryProductManagement(req, res) {
        const company_id = req.body.company_id;
        const type_id = req.body.master_product_type_id;
        const category_id = req.body.master_product_category_id;
        const code = req.body.master_product_category_code;
        const nameTH = req.body.master_product_category_name;
        const nameEN = req.body.master_product_category_name_eng;
        const active = req.body.master_product_category_active;

        console.log(req.body);

        pool.query(
            `UPDATE master_data.master_product_category
            SET
            master_product_type_id = $1,
            master_product_category_name = $2,
            master_product_category_name_eng = $3,
            master_product_category_code = $4,
            master_product_category_active = $5
            WHERE
            master_product_category_id = $6;`,
            [type_id, nameTH, nameEN, code, active, category_id],
            (err, result) => {
                if (err) {
                    console.error(err);
                    res.status(500).json(err);
                } else {
                    res.json({ message: 1 });
                }
            }
        );
    }



    getProductGroupManagement(req, res) {
        const company_id = req.body.company_id;
        pool.query(`select * from master_data.fn_get_product_group(${company_id})`,
            (err, result) => {
                if (err) {
                    console.error(err);
                    res.status(500).json(err);
                    throw err;
                }
                res.status(200).json(result.rows);
            }
        );
    }
    addProductGroupManagement(req, res) {
        const company_id = req.body.company_id;
        const ategory_id = req.body.master_product_category_id;
        const code = req.body.master_product_group_code;
        const name = req.body.master_product_group_name;
        const name_neg = req.body.master_product_group_name_eng;
        const active = req.body.sale_active;
        console.log(req.body)
        const query = {
            text: 'SELECT master_data.fn_add_product_group($1, $2, $3, $4, $5, $6)',
            values: [company_id, ategory_id, code, name, name_neg, active],
        };
        pool.query(query, (err, result) => {
            if (err) {
                console.error(err);
                res.status(500).json(err);
                throw err;
            }
            // console.log(result.rows);
            res.status(200).json(result.rows);
        });
    }
    updateProductGroupManagement(req, res) {
        const company_id = req.body.company_id;
        const ategory_id = req.body.master_product_category_id;
        const code = req.body.master_product_group_code;
        const name = req.body.master_product_group_name;
        const name_neg = req.body.master_product_group_name_eng;
        const active = req.body.sale_active;
        const group_id = req.body.master_product_group_id;
        console.log(req.body);

        pool.query(
            `UPDATE master_data.master_product_group
            SET
            master_company_id = $1,
            master_product_category_id = $2,
            master_product_group_code = $3,
            master_product_group_name = $4,
            master_product_group_name_eng = $5,
            sale_active = $6
            WHERE
            master_product_group_id = $7;`,
            [company_id, ategory_id, code, name, name_neg, active, group_id],
            (err, result) => {
                if (err) {
                    console.error(err);
                    res.status(500).json(err);
                } else {
                    res.json({ message: 1 });
                }
            }
        );
    }




    getProductUnitManagement(req, res) {
        const company_id = req.body.company_id;
        pool.query(`SELECT * FROM master_data.fn_get_product_unit(${company_id})`,
            (err, result) => {
                if (err) {
                    console.error(err);
                    res.status(500).json(err);
                    throw err;
                }
                res.status(200).json(result.rows);
            }
        );
    }
    addProductUnitManagement(req, res) {
        const company_id = req.body.company_id;
        const name = req.body.master_product_unit_name;
        const name_eng = req.body.master_product_unit_name_eng;
        const active = req.body.master_product_unit_active;
        console.log(req.body)
        const query = {
            text: 'SELECT master_data.fn_add_product_unit($1, $2, $3, $4)',
            values: [company_id, name, name_eng, active],
        };
        pool.query(query, (err, result) => {
            if (err) {
                console.error(err);
                res.status(500).json(err);
                throw err;
            }
            res.status(200).json(result.rows);
        });
    }
    updateProductUnitManagement(req, res) {
        const unit_id = req.body.master_product_unit_id;
        const name = req.body.master_product_unit_name;
        const name_eng = req.body.master_product_unit_name_eng;
        const active = req.body.master_product_unit_active;
        console.log(req.body);
        pool.query(
            `UPDATE master_data.master_product_unit
            SET
            master_product_unit_name = $1,
            master_product_unit_name_eng = $2,
            master_product_unit_active = $3
            WHERE
            master_product_unit_id = $4;`,
            [name, name_eng, active, unit_id],
            (err, result) => {
                if (err) {
                    console.error(err);
                    res.status(500).json(err);
                } else {
                    res.json({ message: 1 });
                }
            }
        );
    }


    getBrandManagement(req, res) {
        const company_id = req.body.company_id;
        pool.query(`SELECT * FROM master_data.fn_get_product_brand(${company_id})`,
            (err, result) => {
                if (err) {
                    console.error(err);
                    res.status(500).json(err);
                    throw err;
                }
                res.status(200).json(result.rows);
            }
        );
    }

    addBrandManagement(req, res) {
        const company_id = req.body.company_id;
        const name = req.body.master_product_brand_name;
        const active = req.body.master_product_brand_active;
        console.log(req.body);
        const query = {
            text: 'SELECT master_data.fn_add_product_brand($1, $2, $3)',
            values: [company_id, name, active],
        };
        pool.query(query, (err, result) => {
            if (err) {
                console.error(err);
                res.status(500).json(err);
                throw err;
            }
            res.status(200).json(result.rows);
        });
    }

    updateBrandManagement(req, res) {
        const name = req.body.master_product_brand_name;
        const active = req.body.master_product_brand_active;
        const brand_id = req.body.master_product_brand_id;
        console.log(req.body);
        pool.query(
            `UPDATE master_data.master_product_brand
            SET
            master_product_brand_name = $1,
            master_product_brand_active = $2
            WHERE
            master_product_brand_id = $3;`,
            [name ,active,brand_id],
            (err, result) => {
                if (err) {
                    console.error(err);
                    res.status(500).json(err);
                } else {
                    res.json({ message: 1 });
                }
            }
        );
    }

}
module.exports = ModelStoreManagement;