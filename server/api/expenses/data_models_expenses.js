const pool = require('../../connectdb.js');

class modelExpenses{
  
    getExpensesData(req, res) {
        let company_id = req.body.company_id;
        let branch_id = req.body.branch_id;
        pool.query(`select ex.exp_expensemaster_id,ex.exp_expensemaster_code,ex.exp_expensemaster_name,
                    ex.exp_expensemaster_remark,ex.master_product_unit_id,ex.savetime,ex.exp_expensemaster_vat_active,
                    ex.employeemasterid,ex.exp_expensemaster_active,ex.master_product_unit_id,ex.savetime,
                    un.master_product_unit_name, em.fullname
                    from  master_data.exp_expensemaster   as ex
                    left join master_data.master_product_unit as un on
                    ex.master_product_unit_id = un.master_product_unit_id
                    left join security.emp_employeemaster as em on
                    ex.employeemasterid = em.emp_employeemasterid
                    where ex.master_company_id = ${company_id}
                    and ex.exp_expensemaster_active = true
                    order by exp_expensemaster_id desc`,
            (err, result) => {
                if (err) {
                    throw err;
                }
                res.json(result.rows);
            });
    }

    getExpensesCode(req, res) {
        let company_id = req.body.company_id;
        pool.query(`select master_data.fn_app_exp_expensemaster_docuno(${company_id})`,
            (err, result) => {
                if (err) {
                    throw err;
                }
                res.json(result.rows);
            });
    }


    addExpensesData(req, res) {
        let company_id = req.body.company_id;
        let branch_id = req.body.branch_id;
        let expense_name = req.body.expense_name;
        let expense_remark = req.body.expense_remark;
        let unit_id = req.body.unit_id;
        let employee_id = req.body.employee_id;
        let active = req.body.active;
        let vat_active = req.body.vat_active;
        pool.query(`insert into master_data.exp_expensemaster
            (   master_company_id,
                exp_expensemaster_code,
                exp_expensemaster_name,
                exp_expensemaster_remark,
                master_product_unit_id,
                savetime,
                employeemasterid,
                exp_expensemaster_active,
                exp_expensemaster_vat_active
            )
            values(
                ${company_id},
                (select master_data.fn_app_exp_expensemaster_docuno(${company_id})),
                '${expense_name}',
                '${expense_remark}',
                ${unit_id},
                now(),
                ${employee_id},
                ${active},
                ${vat_active}
           )`,
            (err, result) => {
                if (err) {
                    throw err;
                }
                res.json(result.rows);
            });
    }

    getExpensesEdit(req, res) {
        let company_id = req.body.company_id;
        let expense_id = req.body.expense_id;
        pool.query(`select * from  master_data.exp_expensemaster   
                    where master_company_id = ${company_id}
                    and exp_expensemaster_id = ${expense_id}`,
            (err, result) => {
                if (err) {
                    throw err;
                }
                res.json(result.rows);
            });
    }

    updateExpensedata(req, res) {
        let company_id = req.body.company_id;
        let expense_id = req.body.expense_id;
        let expense_code = req.body.expense_code;
        let expense_name = req.body.expense_name;
        let expense_remark = req.body.expense_remark;
        let unit_id = req.body.unit_id;
        let active = req.body.active;
        let vat_active = req.body.vat_active;
        pool.query(`update master_data.exp_expensemaster
            set master_company_id = ${company_id},
                exp_expensemaster_code = '${expense_code}',
                exp_expensemaster_name = '${expense_name}',
                exp_expensemaster_remark = '${expense_remark}',
                master_product_unit_id = ${unit_id},
                exp_expensemaster_active = ${active},
                exp_expensemaster_vat_active = ${vat_active}
                where exp_expensemaster_id = ${expense_id}
                     `,
            (err, result) => {
                if (err) {
                    throw err;
                }
                res.json(result.rows);
            });
    }

    getExpensesHD(req, res) {
        let company_id = req.body.company_id;
        let branch_id = req.body.branch_id;
        pool.query(`select * from purchase.fn_return_expense_hd(${company_id}, array[${branch_id}])
    q                   order by expense_hd_id asc`,
            (err, result) => {
                if (err) {
                    throw err;
                }
                res.json(result.rows);
            });
    }

    getExpensesHDEdit(req, res) {
        let expense_id = req.body.expense_id;
        pool.query(`select  hd.* ,ven.apvendor_name,ven.apvendor_credit_day
                            from purchase.expense_hd  as hd
                            left join master_data.apvendor as ven
                            on hd.expense_hd_apvendorid = ven.apvendorid
                      where hd.expense_hd_id = ${expense_id}`,
            (err, result) => {
                if (err) {
                    throw err;
                }
                res.json(result.rows);
            });
    }

    getExpensesDetailEdit(req, res) {
        let expense_id = req.body.expense_id;
        pool.query(`SELECT  * FROM purchase.expense_dt as dt
                    left join master_data.master_product_unit as un on
                     dt.exp_expensemaster_unit_id  = un.master_product_unit_id
                    where expense_hd_id = ${expense_id}
                    and expense_dt_active = true`,
            (err, result) => {
                if (err) {
                    throw err;
                }
                res.json(result.rows);
            });
    }

    getExpensesCodeDoc(req, res) {
        let company_id = req.body.company_id;
        let branch_id = req.body.branch_id;
        let date_doc = req.body.date_doc;
        pool.query(`select purchase.fn_app_expensehd_docuno(${company_id},${branch_id},'${date_doc}')`,
            (err, result) => {
                if (err) {
                    throw err;
                }
                res.json(result.rows);
            });
    }

    addExpensesHD(req, res) {
        let company_id = req.body.company_id;
        let branch_id = req.body.branch_id;
        let doc_date = req.body.doc_date;
        let amount = req.body.amount;
        let emp_id = req.body.emp_id;
        let remark = req.body.remark;
        let status = req.body.status;
        let vendor_id = req.body.vendor_id;
        pool.query(`insert into purchase.expense_hd
            (   expense_hd_master_company_id,
                expense_hd_master_branch_id,
                expense_hd_docuno,
                expense_hd_docudate,
                expense_hd_amount,
                expense_hd_empsave_id,
                expense_hd_remark,
                expense_status_id,
                expense_hd_apvendorid
            )
            values(
                ${company_id},
                ${branch_id},
                (select purchase.fn_app_expensehd_docuno(${company_id},${branch_id},'${doc_date}')),
                '${doc_date}',
                ${amount},
                ${emp_id},
                '${remark}',
                ${status},
                ${vendor_id}
           ) RETURNING expense_hd_id;`,
            (err, result) => {
                if (err) {
                    throw err;
                }
                res.json(result.rows);
            });
    }

    updateExpensesHD(req, res) {
        let hd_id = req.body.hd_id;
        let amount = req.body.amount;
        let emp_id = req.body.emp_id;
        let remark = req.body.remark;
        let status = req.body.status;
        let vendor_id = req.body.vendor_id;
        pool.query(`update  purchase.expense_hd
                 set    expense_hd_amount = ${amount},
                        expense_hd_empsave_id = ${emp_id},
                        expense_hd_remark = '${remark}',
                        expense_status_id = ${status},
                        expense_hd_apvendorid = ${vendor_id}
                 where  expense_hd_id = ${hd_id}`,
            (err, result) => {
                if (err) {
                    throw err;
                }
                res.json(result.rows);
            });
    }


    updateExpensesDetail(req, res) {
        let hd_id = req.body.hd_id;
        let expense_id = req.body.expense_id;
        let active = req.body.active;
        let quantity = req.body.quantity;
        let unit_price = req.body.unit_price;
        let amount = req.body.amount;
        pool.query(`update   purchase.expense_dt
                   set expense_dt_quantity= ${quantity},
                   expense_dt_unit_price= ${unit_price},
                   expense_dt_active= ${active},
                   expense_dt_amount= ${amount}
                   where expense_hd_id = ${hd_id}
                   and expense_dt_id = ${expense_id}`,
            (err, result) => {
                if (err) {
                    throw err;
                }
                res.json(result.rows);
            });
    }


    getExpensesDetail(req, res) {
        let company_id = req.body.company_id;
        let expense_id = req.body.expense_id;
        pool.query(`SELECT  * FROM purchase.expense_dt`,
            (err, result) => {
                if (err) {
                    throw err;
                }
                res.json(result.rows);
            });
    }

    addExpensesDetail(req, res) {
        let hd_id = req.body.hd_id;
        let expensemaster_id = req.body.expensemaster_id;
        let expense_code = req.body.expense_code;
        let expense_name = req.body.expense_name;
        let expense_unit = req.body.expense_unit;
        let vat_active = req.body.vat_active;
        let quantity = req.body.quantity;
        let unit_price = req.body.unit_price;
        let amount = req.body.amount;
        let active = req.body.active;
        let branch_id = req.body.branch_id;
        let company_id = req.body.company_id;
        pool.query(`insert into purchase.expense_dt
            (   expense_hd_id,
                exp_expensemaster_id,
                exp_expensemaster_code,
                exp_expensemaster_name,
                exp_expensemaster_unit_id,
                exp_expensemaster_vat_active,
                expense_dt_quantity,
                expense_dt_unit_price,
                expense_dt_amount,
                expense_dt_active
            )
            values(${hd_id},${expensemaster_id},'${expense_code}','${expense_name}',${expense_unit},${vat_active},
                ${quantity},${unit_price},${amount},${active})`,
            (err, result) => {
                if (err) {
                    throw err;
                }
                res.json(result.rows);
            });
    }

    getExpensesCheck(req, res) {
        let hd_id = req.body.hd_id;
        let expensemaster_id = req.body.expensemaster_id;
        pool.query(`select  * from purchase.expense_dt 
                where expense_hd_id = ${hd_id}
               and exp_expensemaster_id = ${expensemaster_id}`,
            (err, result) => {
                if (err) {
                    throw err;
                }
                res.json(result.rows);
            });
    }
 
}

module.exports = modelExpenses;