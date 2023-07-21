const pool = require('../../connectdb.js');

class modelSaleManagement {  


    getmastershifjobtData(req, res) {
        let company_id = req.body.company_id;
        let branch_id = req.body.branch_id;
        pool.query(`select * from master_data.master_shift_job x
                    where x.master_company_id = ${company_id}
                    and x.master_shift_job_branch_id = ${branch_id} `,
            (err, result) => {
                if (err) {
                    throw err;
                }
                res.json(result.rows);
            });
    }

    getShifttransectionDataBranch(req, res) {
        let company_id = req.body.company_id;
        let branch_id = req.body.branch_id;
        pool.query(`select * from saledata.shift_transaction_hd`,
            (err, result) => {
                if (err) {
                    throw err;
                }
                res.json(result.rows);
            });
    }

    getShifttransectionData(req, res) {
        const company_id = req.body.company_id;
        const branch_id = req.body.branch_id;
        pool.query(`select * from "saledata"."fn_get_shift_transaction_data"(${company_id}, ${branch_id})`,
            (err, result) => {
                if (err) {
                    throw err;
                }
                res.json(result.rows);
        });
    }


    addShifttransection(req, res) {
        let company_id = req.body.company_id;
        let branch_id = req.body.branch_id;
        let shift_transaction_hd_open_cash_amount = req.body.shift_transaction_hd_open_cash_amount;
        let shift_transaction_docudate = req.body.shift_transaction_docudate;
        let master_pos_cashier_machine_id = req.body.master_pos_cashier_machine_id;
        let shift_transaction_open_emp_id = req.body.shift_transaction_open_emp_id;
        let shift_transaction_status_id = req.body.shift_transaction_status_id;
        let master_shift_job_id = req.body.master_shift_job_id;
        let master_currency_id = req.body.master_currency_id;
        let pos_cashier_machine_emp_id = req.body.pos_cashier_machine_emp_id;
        pool.query(`insert into saledata.shift_transaction_hd
                (       shift_transaction_hd_docuno,
                        master_branch_id,
                        master_company_id,
                        master_pos_cashier_machine_id,
                        master_shift_job_id,
                        shift_transaction_hd_open_emp_id,
                        shift_transaction_hd_open_cash_amount,
                        pos_cashier_machine_emp_id
                    )
                    values (
                        (select saledata.fn_app_shift_transaction_docuno( ${company_id}, ${branch_id})),
                        ${branch_id},
                        ${company_id},
                        ${master_pos_cashier_machine_id},
                        ${master_shift_job_id},
                        ${shift_transaction_open_emp_id},
                        ${shift_transaction_hd_open_cash_amount},
                        ${pos_cashier_machine_emp_id}
                    )`,
            (err, result) => {
                if (err) {
                    throw err;
                }
                res.json(result.rows);
            });
    }

    updateShifttransection(req, res) {
        const shift_transaction_hd_id = req.body.shift_transaction_hd_id;
        const shift_transaction_hd_status_id = req.body.shift_transaction_status_id;
        const shift_transaction_hd_cancel_emp_id = req.body.user_data.emp_employeemasterid;
        pool.query(`UPDATE saledata.shift_transaction_hd
                    SET shift_transaction_hd_status_id = ${shift_transaction_hd_status_id},
                        shift_transaction_hd_cancel_emp_id = ${shift_transaction_hd_cancel_emp_id},
                        shift_transaction_hd_cancel_savetime = now()
                    WHERE  shift_transaction_hd_id  = ${shift_transaction_hd_id}
                     `,
            (err, result) => {
                if (err) {
                    throw err;
                }
                res.json(result.rows);
        });
    }

    closeShifttransection(req, res) {
        const shift_transaction_hd_id = req.body.shift_transaction_hd_id;
        const shift_transaction_status_id = req.body.shift_transaction_status_id;
        const shift_transaction_close_emp_id = req.body.shift_transaction_close_emp_id;
        const shift_transaction_hd_close_cash_amount = req.body.shift_transaction_hd_close_cash_amount;
        pool.query(`UPDATE saledata.shift_transaction_hd
                    SET shift_transaction_hd_status_id = 2,
                        shift_transaction_hd_close_emp_id = ${shift_transaction_close_emp_id},
                        shift_transaction_hd_close_savetime = now(),
                        shift_transaction_hd_close_cash_amount = ${shift_transaction_hd_close_cash_amount}
                    WHERE shift_transaction_hd_id  = ${shift_transaction_hd_id}
                     `,
            (err, result) => {
                if (err) {
                    throw err;
                }
                res.json(result.rows);
            });
    }

    getSalehdCashamnt(req, res) {
        let company_id = req.body.company_id;
        let branch_id = req.body.branch_id;
        let emp_id = req.body.emp_id;
        pool.query(`SELECT SUM(salehd.salehd_cashamnt) AS  salehd_cashamnt
                       FROM saledata.salehd as salehd
                       WHERE salehd.master_company_id = ${company_id}
                       AND salehd.master_branch_id = ${branch_id}
                       AND salehd.salehd_savetime::date = now()
                       AND salehd.empemployeemaster_id = ${emp_id}`,
            (err, result) => {
                if (err) {
                    throw err;
                }
                res.json(result.rows);
            });
    }

    getShiftCode(req, res) {
        let company_id = req.body.company_id;
        let branch_id = req.body.branch_id;
        pool.query(`select "saledata"."fn_generate_shift_transaction_hd_docuno"( ${company_id},  ${branch_id})`,
            (err, result) => {
                if (err) {
                    throw err;
                }
                res.json(result.rows);
            });
    }

    getEmployeeDataFilter(req, res) {
        let company_id = req.body.company_id;
        let branch_id = req.body.branch_id;
        let textfilter = req.body.textfilter;
        pool.query(`select * from  security.fn_select_employeemaster(${company_id},${branch_id},'${textfilter}')`,
            (err, result) => {
                if (err) {
                    throw err;
                }
                res.json(result.rows);
            });
    }

    getOrderStatus(req, res) {
        let company_id = req.body.company_id;
        let branch_id = req.body.branch_id;
        pool.query(`SELECT * FROM saledata.orderhd
                    where orderhd_status_id = 1
                    and master_branch_id = ${branch_id}
                    and master_company_id = ${company_id}`,
            (err, result) => {
                if (err) {
                    throw err;
                }
                res.json(result.rows);
            });
    }

    getshift_transaction_date(req, res) {
        let company_id = req.body.company_id;
        let branch_id = req.body.branch_id;
        let dates = req.body.dates;
        pool.query(`SELECT * from saledata.shift_transaction
                        WHERE shift_transaction_docudate <= '${dates}'
                        AND master_company_id = ${company_id} 
                        AND master_branch_id = ${branch_id}
                        AND shift_transaction_status_id = 1`,
            (err, result) => {
                if (err) {
                    throw err;
                }
                res.json(result.rows);
            });
    }

    saveShiftTransectionDt(req, res) {
        const company_id = req.body.company_id;
        const branch_id = req.body.shift_transaction_hd_id;
        const shift_transaction_hd_id = req.body.shift_transaction_hd_id;
        const emp_id = req.body.emp_id;
        const shift_transaction_hd_dt = JSON.stringify(req.body.shift_transaction_hd_dt);
        pool.query(`SELECT "saledata"."fn_app_insert_shift_transection_dt"(${company_id}, ${branch_id}, ${shift_transaction_hd_id}, ${emp_id}, '${shift_transaction_hd_dt}')`,
            (err, result) => {
                if (err) {
                    throw err;
                }
                res.json(result.rows);
            });
    }

    getShiftTransectionDt(req, res) {
        const company_id = req.body.company_id;
        const branch_id = req.body.shift_transaction_hd_id;
        const shift_transaction_hd_id = req.body.shift_transaction_hd_id;
        pool.query(`select dt.shift_transaction_dt_id,
                           to_char(dt.shift_transaction_dt_savetime, 'DD/MM/YYYY HH24:MI:ss') as shift_transaction_dt_date,                                            
                           dt.shift_transaction_dt_amount,
                           dt.shift_transaction_dt_status_id,
                           hd.shift_transaction_hd_status_id
                    from saledata.shift_transaction_dt dt
                    left join saledata.shift_transaction_hd hd on dt.shift_transaction_hd_id = hd.shift_transaction_hd_id
                    where dt.shift_transaction_hd_id = ${shift_transaction_hd_id}`,
            (err, result) => {
                if (err) {
                    throw err;
                }
                res.json(result.rows);
            });
    }

    cancelShiftTransectionDt(req, res) {
        const company_id = req.body.company_id;
        const branch_id = req.body.shift_transaction_hd_id;
        const shift_transaction_dt_id = req.body.shift_transaction_dt_id;
        const shift_transaction_hd_id = req.body.shift_transaction_hd_id;
        const emp_id = req.body.emp_id;
        pool.query(`select "saledata"."fn_app_cancel_shift_transection_dt"(${company_id}, ${branch_id}, ${shift_transaction_dt_id}, ${shift_transaction_hd_id}, ${emp_id})`,
            (err, result) => {
                if (err) {
                    throw err;
                }
                res.json(result.rows);
            });
    }
}

module.exports = modelSaleManagement;