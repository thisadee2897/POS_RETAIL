const pool = require('../../connectdb.js');

class modelSaleOder {

   fetchOrderHdDocuno(req, res) {
        const company_id = req.body.company_id;
        const branch_id = req.body.branch_id;
        pool.query(`SELECT fn_app_orderhd_docuno as docuno,
                          (to_char(now(), 'DD/MM/')||to_char(now(), 'YYYY')::int + 543)::text as docudate
                    FROM "saledata"."fn_app_orderhd_docuno"(${company_id}, ${branch_id})                
                        `,
            (err, result) => {
                if (err) {
                    throw err;
                }
                res.json(result.rows);
            });
    }

    saveOrderHdData(req, res){
        const company_id = req.body.company_id;
        const branch_id = req.body.branch_id;
        const remark = req.body.remark;
        const emp_id = req.body.emp_id;
        const data = JSON.stringify([req.body]);
        pool.query(`select "saledata"."fn_app_create_orderhd"('${data}')
                    `,
        (err, result) => {
            if (err) {
                throw err;
            }
            res.json({status: true});
        });
        // pool.query(`SELECT "saledata"."fn_report_check_shift_open"(${company_id}, ${branch_id}, now()::date);   
        //             `, 
        // (err, result)=>{
        //     if(err){
        //         throw err;
        //     }
        //     if(result.rows[0].fn_report_check_shift_open == true){
        //         pool.query(`select "saledata"."fn_app_create_orderhd"('${data}')
        //                     `,
        //         (err, result) => {
        //             if (err) {
        //                 throw err;
        //             }
        //             res.json({status: true});
        //         });
        //     }else{
        //         res.json({status: false});
        //     }
        // });
     }

    /* fetchOrderHdData(req, res) {
        const company_id = req.body.company_id;
        const branch_id = req.body.branch_id;
        pool.query(`SELECT hd.orderhd_id,
                           hd.orderhd_docuno,
                           to_char(hd.orderhd_docudate, 'DD/MM')||to_char(hd.orderhd_docudate, 'YYYY')::int + 543 as orderhd_docudate,
                           hd.orderhd_remark,
                           hd.orderhd_netamnt,
                           emp.firstname|| ' ' ||emp.lastname as emp_name,
                           st.orderhd_status_name
                    FROM saledata.orderhd hd
                    LEFT JOIN saledata.orderhd_status st ON hd.orderhd_status_id = st.orderhd_status_id
                    LEFT JOIN security.emp_employeemaster emp ON hd.emp_employeemasterid = emp.emp_employeemasterid
                    WHERE hd.master_branch_id = ${branch_id}
                    AND hd.master_company_id = ${company_id}
                    AND hd.orderhd_status_id = 2
                    ORDER BY hd.orderhd_id DESC
                    `,
        (err, result) => {
            if (err) {
                throw err;
            }
            res.json(result.rows);
        });
    }*/

    fetcSaleOrderForEdit(req, res) {
        const company_id = req.body.company_id;
        const branch_id = req.body.branch_id;
        const orderhd_id = req.body.orderhd_id;
        pool.query(`SELECT hd.orderhd_id,
                           hd.orderhd_docuno,
                           to_char(hd.orderhd_docudate, 'DD/MM')||to_char(hd.orderhd_docudate, 'YYYY')::int + 543 as orderhd_docudate,
                           hd.orderhd_remark,
                           hd.orderhd_netamnt,
                           emp.firstname|| ' ' || emp.lastname as emp_name,
                           (select COALESCE(array_to_json(array_agg(row_to_json(yy))), '[]') as orderdt
                                from (
                                        select  dt.orderdt_id,
                                                dt.orderdt_master_product_id as master_product_id,
                                                dt.orderdt_master_product_billname as master_product_name_bill,
                                                dt.orderdt_master_product_barcode_id as master_product_barcode_id,
                                                dt.orderdt_qty,
                                                dt.orderdt_status_id,
                                                dt.orderdt_saleprice as product_price,
                                                dt.orderdt_netamnt as orderdt_netamount,
                                                un.master_product_unit_name,
                                                bc.barcode as master_product_barcode
                                        from saledata.orderdt dt
                                        left join master_data.master_product_barcode bc on dt.orderdt_master_product_barcode_id = bc.master_product_barcode_id
                                        left join master_data.master_product_unit un on dt.orderdt_master_product_barcode_unit_id = un.master_product_unit_id
                                        where dt.orderhd_id = ${orderhd_id}
                                        and dt.orderdt_status_id <> 5                       
                                )yy
                            )
                    FROM saledata.orderhd hd
                    LEFT JOIN security.emp_employeemaster emp ON hd.emp_employeemasterid = emp.emp_employeemasterid
                    WHERE hd.master_branch_id = ${branch_id}
                    AND hd.master_company_id = ${company_id}
                    AND hd.orderhd_id = ${orderhd_id}
                    `,
        (err, result) => {
            if (err) {
                throw err;
            }
            res.json(result.rows);
        });
    }

    updateHdData(req, res) {
        const company_id = req.body.company_id;
        const branch_id = req.body.branch_id;
        const remark = req.body.remark;
        const emp_id = req.body.emp_id;
        const orderdt = JSON.stringify(req.body.orderdt);
        const orderhd_id = req.body.orderhd_id;
        pool.query(`select "saledata"."fn_app_update_orderhd"(${orderhd_id}, ${emp_id}, '${remark}', '${orderdt}')
                    `,
        (err, result) => {
            if (err) {
                throw err;
            }
            res.json({message: 1});
        });
    }

    getSaleOrderData(req, res) {
        const {company_id, branch_id, text, arcustomer_id} = req.body;
        pool.query(`select * from "saledata"."fn_get_sale_order_data"($1, $2, $3, $4)
                    `, [company_id, branch_id, text, arcustomer_id],
        (err, result) => {
            if (err) {
                throw err;
            }
            res.json(result.rows);
        });
    }
 
 
}

module.exports = modelSaleOder;