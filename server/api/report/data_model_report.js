const pool = require('../../connectdb.js');

class ModelReport {

    getdataPayment(req, res) {
        const start_date = req.body.start_date;
        const end_date = req.body.end_date;
        const user_id = req.body.user_id;
        const company_id = req.body.company_id;
        const branch_id = req.body.branch_id;
        pool.query(`select * from saledata.fn_reportapp_sale_amount_branch_everyday('${start_date}', '${end_date}', '${company_id}','${user_id}')
            where  (case when array[${branch_id}] = array[0]  then true else master_branch_id = any(array[${branch_id}]) end)`,
            (err, result) => {
                if (err) {
                    throw err;
                }
                res.json(result.rows);
            });
    }

    getdataPaymentDetail(req, res) {
        const start_date = req.body.start_date;
        const end_date = req.body.end_date;
        const user_id = req.body.user_id;
        const company_id = req.body.company_id;
        const branch_id = JSON.stringify([req.body.branch_id]);
        pool.query(`select * from saledata.fn_reportapp_salehd_amount_and_deposit_paytype('${start_date}', '${end_date}', '${company_id}','${user_id}')
        where  (case when array[${branch_id}] = array[0]  then true else master_branch_id = any(array[${branch_id}]) end)`,
            (err, result) => {
                if (err) {
                    throw err;
                }
                res.json(result.rows);
            });

    }

    realtime(req, res) {
        const db_name = req.body.db_name;
        const company_id = req.body.company_id;
        const datetime = req.body.start_date;
        const datetime_end = req.body.end_date;
        const user_id = req.body.user_id;
        const branch_id = req.body.branch_id;
        const new_datetime = datetime.replace('00:00:00.000', '');
        const new_datetime_end = datetime_end.replace('00:00:00.000', '');
        const real_datetime = new_datetime.replace(/[^0-9\.]+/g, '');
        const real_datetime_end = new_datetime_end.replace(/[^0-9\.]+/g, '');
        pool.query(`select
                    master_branch_id, 
                    master_branch_code,
                    master_branch_prefix,
                    master_branch_name,
                    sum_netamnt,
                    count_salebill,
                    sale_amountperbill,
                    orderhd_netamnt
                    FROM saledata.fn_reportapp_saleamount('${real_datetime}', '${real_datetime_end}', '${company_id}','${user_id}')
                    where (case when array[${branch_id}] = array[0] then true else master_branch_id = any(array[${branch_id}]) end)
        `, (err, results) => {
            if (err) {
                throw err;
            }
            res.status(200).json(results.rows);
            // console.log(results.rows);
        });
    }

    realtimeOrder(req, res) {
        const db_name = req.body.db_name;
        const company_id = req.body.company_id;
        const branch_id = req.body.branch_id;
        const date = req.body.date;
        const end_date = req.body.end_date;
        const new_datetime = date.replace('00:00:00.000', '');
        const new_datetime_end = end_date.replace('00:00:00.000', '');
        const real_datetime = new_datetime.replace(/[^0-9\.]+/g, '');
        const real_datetime_end = new_datetime_end.replace(/[^0-9\.]+/g, '');
        pool.query(`select * from saledata.fn_reportapp_saleamount_billorder('${real_datetime}', '${real_datetime_end}', '${branch_id}', '${company_id}')
        where (case when array[${branch_id}] = (array[0]) then false  else master_branch_id = any(array[${branch_id}]) end)
        `,
            (err, results) => {
                if (err) {
                    throw err;
                }
                res.status(200).json(results.rows);
                // console.log(results.rows);
            });
    }

    realtimeOrderSub(req, res) {
        const db_name = req.body.db_name;
        const orderhd_id = req.body.orderhd_id;
        pool.query(`select y.master_product_code,
        x.orderdt_master_product_billname,
        x.orderdt_netamnt
        from saledata.orderdt x
        left join master_data.master_product y on x.orderdt_master_product_id = y.master_product_id
        where x.orderdt_status_id <> 5
        and x.orderhd_id = '${orderhd_id}'`, (err, results) => {
            if (err) {
                throw err;
            }
            res.status(200).json(results.rows);
            // console.log(results.rows);
        });
    }

    closedProductsCount(req, res) {
        const db_name = req.body.db_name;
        const company_id = req.body.company_id;
        const user_id = req.body.user_id;
        const branch_id = req.body.branch_id;
        pool.query(`SELECT master_branch_id,
        master_branch_code,
        master_branch_prefix,
        master_branch_name,
        count(barcode) as count_barcode
        from saledata.fn_reportapp_close_master_product('${company_id}', '${user_id}')
        where (case when array[${branch_id}] = array[0] then true else master_branch_id = any(array[${branch_id}]) end) and sale_active = false
        group by master_branch_code,master_branch_id,
        master_branch_prefix,
        master_branch_name
        order by count(barcode) desc`, (err, results) => {
            if (err) {
                throw err;
            }
            res.status(200).json(results.rows);
            // console.log(results.rows);
        });
    }

    closed_products(req, res) {
        const db_name = req.body.db_name;
        const company_id = req.body.company_id;
        const branch_id = req.body.branch_id;
        pool.query(`select *
        FROM master_data.fn_report_pos_master_product_price('${branch_id}', '${company_id}')
        where sale_active = false
        order by master_product_name`, (err, results) => {
            if (err) {
                throw err;
            }
            res.status(200).json(results.rows);
            // console.log(results.rows);
        });
    }

    select_branch(req, res) {
        const db_name = req.body.db_name;
        const company_id = req.body.company_id;
        pool.query(`select master_branch_id,master_branch_name
        FROM master_data.master_branch 
        WHERE master_company_id = '${company_id}'`, (err, results) => {
            if (err) {
                throw err;
            }
            res.status(200).json(results.rows);
            // console.log(results.rows);
        });
    }

    salesBill(req, res) {
        const db_name = req.body.db_name;
        const company_id = req.body.company_id;
        const datetime = req.body.start_date;
        const datetime_end = req.body.end_date;
        const user_id = req.body.user_id;
        const new_datetime = datetime.replace('00:00:00.000', '');
        const new_datetime_end = datetime_end.replace('00:00:00.000', '');
        const real_datetime = new_datetime.replace(/[^0-9\.]+/g, '');
        const real_datetime_end = new_datetime_end.replace(/[^0-9\.]+/g, '');
        const branch_id = req.body.branch_id;
        //console.log("Branch :" + branch_id);
        pool.query(`select *
        from saledata.fn_reportapp_billsalecount_target('${real_datetime}', '${real_datetime_end}', '${company_id}','${user_id}')
        where (case when array[${branch_id}] = array[0] then true else master_branch_id = any(array[${branch_id}]) end)`, (err, results) => {
            if (err) {
                throw err;
            }
            res.status(200).json(results.rows);
            // console.log(results.rows);
        });
    }

    salesBillDetail(req, res) {
        const db_name = req.body.db_name;
        const company_id = req.body.company_id;
        const branch_id = req.body.branch_id;
        const datetime = req.body.date;
        const datetime_end = req.body.end_date;
        const new_datetime = datetime.replace('00:00:00.000', '');
        const new_datetime_end = datetime_end.replace('00:00:00.000', '');
        const real_datetime = new_datetime.replace(/[^0-9\.]+/g, '');
        const real_datetime_end = new_datetime_end.replace(/[^0-9\.]+/g, '');
        pool.query(`select x.salehd_id,
        x.salehd_docuno,
        x.salehd_arcustomer_name,
        x.salehd_netamnt,
        x.salehd_discountamnt
        from saledata.salehd x
        left join master_data.master_branch br on x.master_branch_id = br.master_branch_id
        where x.master_company_id = '${company_id}'
        and x.master_branch_id = '${branch_id}'
        and x.salehd_statusid <> 2
        and x.salehd_docudate::date between '${real_datetime}' and '${real_datetime_end}'
        and x.salehd_netamnt <= (case when br.master_branch_type_id = 2 then 800 else 1200 end)
        order by x.salehd_docuno`, (err, results) => {
            if (err) {
                throw err;
            }
            res.status(200).json(results.rows);
            // console.log(results.rows);
        });
    }

    salesBillDetailSub(req, res) {
        const db_name = req.body.db_name;
        const salehdId = req.body.salehdId;
        pool.query(`select dt.saledt_master_product_barcode_code,
        dt.saledt_master_product_billname,
        dt.saledt_netamnt
        from saledata.saledt dt
        where dt.salehd_id = '${salehdId}'`, (err, results) => {
            if (err) {
                throw err;
            }
            res.status(200).json(results.rows);
            // console.log(results.rows);
        });
    }

    duration(req, res) {
        const db_name = req.body.db_name;
        const company_id = req.body.company_id;
        const datetime = req.body.start_date;
        const datetime_end = req.body.end_date;
        const branch_id = req.body.branch_id;
        const user_id = req.body.user_id;
        const new_datetime = datetime.replace('00:00:00.000', '');
        const new_datetime_end = datetime_end.replace('00:00:00.000', '');
        const real_datetime = new_datetime.replace(/[^0-9\.]+/g, '');
        const real_datetime_end = new_datetime_end.replace(/[^0-9\.]+/g, '');
        pool.query(`select * from saledata.fn_reportapp_saleamount_byhours('${real_datetime}', '${real_datetime_end}', '${company_id}', '${user_id}')
                   where (case when array[${branch_id}] = array[0] then true else master_branch_id = any(array[${branch_id}]) end)
                   order by sum_netamount DESC`, (err, results) => {
            if (err) {
                throw err;
            }
            res.status(200).json(results.rows);
            // console.log(results.rows);
        });
    }

    durationDetail(req, res) {
        const db_name = req.body.db_name;
        const company_id = req.body.company_id;
        const branch_id = req.body.branch_id;
        const datetime = req.body.date;
        const datetime_end = req.body.end_date;
        const new_datetime = datetime.replace('00:00:00.000', '');
        const new_datetime_end = datetime_end.replace('00:00:00.000', '');
        const real_datetime = new_datetime.replace(/[^0-9\.]+/g, '');
        const real_datetime_end = new_datetime_end.replace(/[^0-9\.]+/g, '');
        pool.query(`select * from saledata.fn_reportapp_saleamount_byhours_branch('${real_datetime}', '${real_datetime_end}', '${company_id}','${branch_id}')`, (err, results) => {
            if (err) {
                throw err;
            }
            res.status(200).json(results.rows);
            // console.log(results.rows);
        });
    }

    durationAll(req, res) {
        const db_name = req.body.db_name;
        const company_id = req.body.company_id;
        const user_id = req.body.user_id;
        const datetime = req.body.start_date;
        const datetime_end = req.body.end_date;
        const branch_id = req.body.branch_id;
        const new_datetime = datetime.replace('00:00:00.000', '');
        const new_datetime_end = datetime_end.replace('00:00:00.000', '');
        const real_datetime = new_datetime.replace(/[^0-9\.]+/g, '');
        const real_datetime_end = new_datetime_end.replace(/[^0-9\.]+/g, '');
        pool.query(`select * from saledata.fn_reportapp_graph_saleamount_byhours('${real_datetime}', '${real_datetime_end}', '${company_id}','${user_id}')`, (err, results) => {
            if (err) {
                throw err;
            }
            res.status(200).json(results.rows);
            // console.log(results.rows);
        });
    }

    fecthUserData(req, res) {
        const db_name = req.body.db_name;
        const emp_code = req.body.emp_code;
        pool.query(`SELECT user_login_id
                                     FROM security.user_login
                                     WHERE employeecode = '${emp_code}'`, (err, results) => {
            if (err) {
                throw err;
            }
            res.status(200).json(results.rows);
            // console.log(results.rows);
        });
    }

    paymentMethod(req, res) {
        const db_name = req.body.db_name;
        const company_id = req.body.company_id;
        const datetime = req.body.start_date;
        const datetime_end = req.body.end_date;
        const user_id = req.body.user_id;
        const branch_id = req.body.branch_id;
        const new_datetime = datetime.replace('00:00:00.000', '');
        const new_datetime_end = datetime_end.replace('00:00:00.000', '');
        const real_datetime = new_datetime.replace(/[^0-9\.]+/g, '');
        const real_datetime_end = new_datetime_end.replace(/[^0-9\.]+/g, '');
        pool.query(`select * from saledata.fn_reportapp_saleamount_paytype(
            '${real_datetime}', '${real_datetime_end}', '${company_id}', '${user_id}') 
            where  (case when array[${branch_id}] = array[0]  then true else master_branch_id = any(array[${branch_id}]) end)
            order by master_branch_id desc`, (err, results) => {
            if (err) {
                throw err;
            }
            res.status(200).json(results.rows);
            // console.log(results.rows);
        });
    }

    paymentBranch(req, res) {
        const db_name = req.body.db_name;
        const company_id = req.body.company_id;
        const branch_id = req.body.branch_id;
        const datetime = req.body.start_date;
        const datetime_end = req.body.end_date;
        const user_id = req.body.user_id;
        const new_datetime = datetime.replace('00:00:00.000', '');
        const new_datetime_end = datetime_end.replace('00:00:00.000', '');
        const real_datetime = new_datetime.replace(/[^0-9\.]+/g, '');
        const real_datetime_end = new_datetime_end.replace(/[^0-9\.]+/g, '');
        pool.query(`select * from
        saledata.fn_reportapp_saleamount_paytype(
            '${real_datetime}', '${real_datetime_end}', '${company_id}', '${user_id}') 
            WHERE master_branch_id = '${branch_id}'`, (err, results) => {
            if (err) {
                throw err;
            }
            res.status(200).json(results.rows);
            // console.log(results.rows);
        });
    }

    paymentDetail(req, res) {
        const db_name = req.body.db_name;
        const company_id = req.body.company_id;
        const branch_id = req.body.branch_id;
        const datetime = req.body.start_date;
        const datetime_end = req.body.end_date;
        const user_id = req.body.user_id;
        const pay_type = req.body.pay_type;
        const new_datetime = datetime.replace('00:00:00.000', '');
        const new_datetime_end = datetime_end.replace('00:00:00.000', '');
        const real_datetime = new_datetime.replace(/[^0-9\.]+/g, '');
        const real_datetime_end = new_datetime_end.replace(/[^0-9\.]+/g, '');
        pool.query(`select *from saledata.fn_reportapp_saleamount_paytype_detail('${real_datetime}', '${real_datetime_end}', '${company_id}', '${user_id}', '${pay_type}') 
                                    WHERE master_branch_id = '${branch_id}'`, (err, results) => {
            if (err) {
                throw err;
            }
            res.status(200).json(results.rows);
            // console.log(results.rows);
        });
    }

    eatingType(req, res) {
        const db_name = req.body.db_name;
        const company_id = req.body.company_id;
        const branch_id = req.body.branch_id;
        const datetime = req.body.start_date;
        const datetime_end = req.body.end_date;
        const user_id = req.body.user_id;
        const eating_type = req.body.eating_type;
        const new_datetime = datetime.replace('00:00:00.000', '');
        const new_datetime_end = datetime_end.replace('00:00:00.000', '');
        const real_datetime = new_datetime.replace(/[^0-9\.]+/g, '');
        const real_datetime_end = new_datetime_end.replace(/[^0-9\.]+/g, '');
        pool.query(`select master_branch_id , 
                        master_branch_code , 
                        master_branch_name , 
                        master_branch_prefix , 
                        saledt_master_product_barcode_id , 
                        saledt_master_product_barcode_code , 
                        saledt_master_product_billname , 
                        sum(saledt_netamnt) as saledt_netamnt
                        from saledata.fn_reportapp_saleamount_paytype_detail_locationtype('${real_datetime}', '${real_datetime_end}', '${company_id}', '${user_id}', '${eating_type}') x
                        WHERE master_branch_id = '${branch_id}'
                        group by 
                        master_branch_id , 
                        master_branch_code , 
                        master_branch_name , 
                        master_branch_prefix , 
                        saledt_master_product_barcode_id , 
                        saledt_master_product_barcode_code , 
                        saledt_master_product_billname
                        order by sum(saledt_netamnt) desc
                        `, (err, results) => {
            if (err) {
                throw err;
            }
            res.status(200).json(results.rows);
            // console.log(results.rows);
        });
    }

    serviceCharge(req, res) {
        const db_name = req.body.db_name;
        const company_id = req.body.company_id;
        const branch_id = req.body.branch_id;
        const datetime = req.body.start_date;
        const datetime_end = req.body.end_date;
        const user_id = req.body.user_id;
        const new_datetime = datetime.replace('00:00:00.000', '');
        const new_datetime_end = datetime_end.replace('00:00:00.000', '');
        const real_datetime = new_datetime.replace(/[^0-9\.]+/g, '');
        const real_datetime_end = new_datetime_end.replace(/[^0-9\.]+/g, '');
        pool.query(`select * from saledata.fn_reportapp_saleamount_paytype_detail_service
                                    ('${real_datetime}', '${real_datetime_end}', '${company_id}', '${user_id}') WHERE master_branch_id = '${branch_id}'`, (err, results) => {
            if (err) {
                throw err;
            }
            res.status(200).json(results.rows);
            // console.log(results.rows);
        });
    }

    paymentSumCreditCard(req, res) {
        const db_name = req.body.db_name;
        const company_id = req.body.company_id;
        const branch_id = req.body.branch_id;
        const datetime = req.body.start_date;
        const datetime_end = req.body.end_date;
        const user_id = req.body.user_id;
        const new_datetime = datetime.replace('00:00:00.000', '');
        const new_datetime_end = datetime_end.replace('00:00:00.000', '');
        const real_datetime = new_datetime.replace(/[^0-9\.]+/g, '');
        const real_datetime_end = new_datetime_end.replace(/[^0-9\.]+/g, '');
        cpool.query(`select x.cq_bankbook_id,
                    x.cq_bankbook_no,
                    sum(x.salehd_netamnt) as salehd_netamnt
                    from saledata.fn_reportapp_saleamount_paytype_detail_typecreditcard('${real_datetime}', '${real_datetime_end}', ${company_id}, ${user_id}, 3, 0) x
                    WHERE master_branch_id = '${branch_id}'
                    group by 
                    x.cq_bankbook_id,
                    x.cq_bankbook_no
                    order by sum(x.salehd_netamnt) desc
                    `, (err, results) => {
            if (err) {
                throw err;
            }
            res.status(200).json(results.rows);
            // console.log(results.rows);
        });
    }

    paymentCreditCardDetail(req, res) {
        const db_name = req.body.db_name;
        const company_id = req.body.company_id;
        const branch_id = req.body.branch_id;
        const datetime = req.body.start_date;
        const datetime_end = req.body.end_date;
        const user_id = req.body.user_id;
        const cqbankbook_id = req.body.cqbankbook_id;
        const new_datetime = datetime.replace('00:00:00.000', '');
        const new_datetime_end = datetime_end.replace('00:00:00.000', '');
        const real_datetime = new_datetime.replace(/[^0-9\.]+/g, '');
        const real_datetime_end = new_datetime_end.replace(/[^0-9\.]+/g, '');
        pool.query(`select *
                                    from saledata.fn_reportapp_saleamount_paytype_detail_typecreditcard('${real_datetime}', '${real_datetime_end}', ${company_id}, ${user_id}, 3, ${cqbankbook_id}) x
                                    WHERE master_branch_id = '${branch_id}'
                                    `, (err, results) => {
            if (err) {
                throw err;
            }
            res.status(200).json(results.rows);
            // console.log(results.rows);
        });
    }

    paymentBestSeller(req, res) {
        const db_name = req.body.db_name;
        const company_id = req.body.company_id;
        const datetime = req.body.start_date;
        const branch_id = req.body.branch_id;
        const datetime_end = req.body.end_date;
        const user_id = req.body.user_id;
        const new_datetime = datetime.replace('00:00:00.000', '');
        const new_datetime_end = datetime_end.replace('00:00:00.000', '');
        const real_datetime = new_datetime.replace(/[^0-9\.]+/g, '');
        const real_datetime_end = new_datetime_end.replace(/[^0-9\.]+/g, '');
        pool.query(`select
        x.master_branch_id,
        x.master_branch_code,
        x.master_branch_name,
        x.master_branch_prefix,
        coalesce(sum(x.saledt_qty),0) as saledt_qty,
        coalesce(sum(x.saledt_netamnt),0) as saledt_netamnt
        from saledata.fn_reportapp_saleamount_product_top20_best_seller('${real_datetime}', '${real_datetime_end}', '${company_id}', '${user_id}') x
        where (case when array[${branch_id}] = array[0] then true else master_branch_id = any(array[${branch_id}]) end)
        group by 
        x.master_branch_id,
        x.master_branch_code,
        x.master_branch_name,
        x.master_branch_prefix
        order by coalesce(sum(x.saledt_netamnt),0) desc`, (err, results) => {
            if (err) {
                throw err;
            }
            res.status(200).json(results.rows);
            // console.log(results.rows);
        });
    }

    paymentBestSellerDetail(req, res) {
        const db_name = req.body.db_name;
        const company_id = req.body.company_id;
        const branch_id = req.body.branch_id;
        const user_id = req.body.user_id;
        const datetime = req.body.start_date;
        const datetime_end = req.body.end_date;
        const new_datetime = datetime.replace('00:00:00.000', '');
        const new_datetime_end = datetime_end.replace('00:00:00.000', '');
        const real_datetime = new_datetime.replace(/[^0-9\.]+/g, '');
        const real_datetime_end = new_datetime_end.replace(/[^0-9\.]+/g, '');
        pool.query(`select *
        from saledata.fn_reportapp_saleamount_product_top20_best_seller('${real_datetime}', '${real_datetime_end}', '${company_id}', '${user_id}') x
        where x.master_branch_id = '${branch_id}'
        order by x.saledt_netamnt desc`, (err, results) => {
            if (err) {
                throw err;
            }
            res.status(200).json(results.rows);
            // console.log(results.rows);
        });
    }

    paymentBestSellerGraph(req, res) {
        const db_name = req.body.db_name;
        const company_id = req.body.company_id;
        const branch_id = req.body.branch_id;
        const user_id = req.body.user_id;
        const datetime = req.body.start_date;
        const datetime_end = req.body.end_date;
        const new_datetime = datetime.replace('00:00:00.000', '');
        const new_datetime_end = datetime_end.replace('00:00:00.000', '');
        const real_datetime = new_datetime.replace(/[^0-9\.]+/g, '');
        const real_datetime_end = new_datetime_end.replace(/[^0-9\.]+/g, '');
        pool.query(`select * from saledata.fn_reportapp_saleamount_product_top20_best_seller_anybranch_v1
                ('${real_datetime}', '${real_datetime_end}', '${company_id}', array[${branch_id}])`,
            (err, results) => {
                if (err) {
                    throw err;
                }
                res.status(200).json(results.rows);
                // console.log(results.rows);
            });
    }

    fechMenuReportData(req, res) {
        const db_name = req.body.db_name;
        const company_id = req.body.company_id;
        const user_id = req.body.user_id;
        pool.query(`select y.*  from security.fn_report_vw_set_role_group_menu(${company_id}, 
                                    (select x.role_group_id::integer from security.user_login_multi_role_group x where x.user_login_id = ${user_id}
                                    and x.master_company_id = ${company_id} and x.role_group_active = true limit 1)) y
                                    where y.master_form_module_id = 15 
                                    and y.role_group_menu_active = true
                                    order by y.master_form_module_sub_id asc,master_form_id asc;
                                    `,
            (err, results) => {
                if (err) {
                    throw err;
                }
                res.status(200).json(results.rows);
                // console.log(results.rows);
            });
    }

    Sumarize(req, res) {
        const db_name = req.body.db_name;
        const company_id = req.body.company_id;
        const user_id = req.body.user_id;
        const datetime = req.body.start_date;
        const datetime_end = req.body.end_date;
        const new_datetime = datetime.replace('00:00:00.000', '');
        const new_datetime_end = datetime_end.replace('00:00:00.000', '');
        const real_datetime = new_datetime.replace(/[^0-9\.]+/g, '');
        const real_datetime_end = new_datetime_end.replace(/[^0-9\.]+/g, '');
        pool.query(`select * from saledata.fn_reportapp_saleamount_group_and_growth_group('${real_datetime}', '${real_datetime_end}', '${company_id}','${user_id}')`
            , (err, results) => {
                if (err) {
                    throw err;
                }
                res.status(200).json(results.rows);
                // console.log(results.rows);
            });
    }


    SumarizeGraph(req, res) {
        const db_name = req.body.db_name;
        const company_id = req.body.company_id;
        const user_id = req.body.user_id;
        const datetime = req.body.start_date;
        const datetime_end = req.body.end_date;
        const new_datetime = datetime.replace('00:00:00.000', '');
        const new_datetime_end = datetime_end.replace('00:00:00.000', '');
        const real_datetime = new_datetime.replace(/[^0-9\.]+/g, '');
        const real_datetime_end = new_datetime_end.replace(/[^0-9\.]+/g, '');
        pool.query(`SELECT * from saledata.fn_reportapp_totalamount_cost_and_spend('${real_datetime}', '${real_datetime_end}', '${company_id}', '${user_id}')`
            , (err, results) => {
                if (err) {
                    throw err;
                }
                res.status(200).json(results.rows);
                // console.log(results.rows);
            });
    }

    SumarizeGraphSecond(req, res) {
        const db_name = req.body.db_name;
        const company_id = req.body.company_id;
        const user_id = req.body.user_id;
        const datetime = req.body.start_date;
        const datetime_end = req.body.end_date;
        const new_datetime = datetime.replace('00:00:00.000', '');
        const new_datetime_end = datetime_end.replace('00:00:00.000', '');
        const real_datetime = new_datetime.replace(/[^0-9\.]+/g, '');
        const real_datetime_end = new_datetime_end.replace(/[^0-9\.]+/g, '');
        pool.query(`select * from saledata.fn_reportapp_saleamount_and_costspend_area('${real_datetime}', '${real_datetime_end}', '${company_id}', '${user_id}') where saledt_netamnt_exvat <> 0`
            , (err, results) => {
                if (err) {
                    throw err;
                }
                res.status(200).json(results.rows);
                // console.log(results.rows);
            });
    }

    SumarizeGraphThird(req, res) {
        const db_name = req.body.db_name;
        const company_id = req.body.company_id;
        const user_id = req.body.user_id;
        const datetime = req.body.start_date;
        const datetime_end = req.body.end_date;
        const new_datetime = datetime.replace('00:00:00.000', '');
        const new_datetime_end = datetime_end.replace('00:00:00.000', '');
        const real_datetime = new_datetime.replace(/[^0-9\.]+/g, '');
        const real_datetime_end = new_datetime_end.replace(/[^0-9\.]+/g, '');
        pool.query(`select * from saledata.fn_reportapp_saleamount_and_costspend_area('${real_datetime}', '${real_datetime_end}', '${company_id}', '${user_id}') where gr_receivedt_amnt <> 0 Order By gr_receivedt_amnt DESC`
            , (err, results) => {
                if (err) {
                    throw err;
                }
                res.status(200).json(results.rows);
                // console.log(results.rows);
            });
    }

    SumarizeCustomer(req, res) {
        const db_name = req.body.db_name;
        const company_id = req.body.company_id;
        const user_id = req.body.user_id;
        const datetime = req.body.start_date;
        const datetime_end = req.body.end_date;
        const new_datetime = datetime.replace('00:00:00.000', '');
        const new_datetime_end = datetime_end.replace('00:00:00.000', '');
        const real_datetime = new_datetime.replace(/[^0-9\.]+/g, '');
        const real_datetime_end = new_datetime_end.replace(/[^0-9\.]+/g, '');
        pool.query(`select * from saledata.fn_reportapp_saleamount_and_countar('${real_datetime}', '${real_datetime_end}', '${company_id}', '${user_id}')`
            , (err, results) => {
                if (err) {
                    throw err;
                }
                res.status(200).json(results.rows);
                // console.log(results.rows);
            });
    }


    SumarizeSaleAmnt(req, res) {
        const db_name = req.body.db_name;
        const user_id = req.body.user_id;
        const company_id = req.body.company_id;
        const datetime = req.body.start_date;
        const datetime_end = req.body.end_date;
        const new_datetime = datetime.replace('00:00:00.000', '');
        const new_datetime_end = datetime_end.replace('00:00:00.000', '');
        const real_datetime = new_datetime.replace(/[^0-9\.]+/g, '');
        const real_datetime_end = new_datetime_end.replace(/[^0-9\.]+/g, '');
        pool.query(`select * from saledata.fn_reportapp_saleamount_bymonth('${real_datetime}', '${real_datetime_end}', '${company_id}', '${user_id}')`
            , (err, results) => {
                if (err) {
                    throw err;
                }
                res.status(200).json(results.rows);
                // console.log(results.rows);
            });
    }

    SumarizeBillCancel(req, res) {
        const db_name = req.body.db_name;
        const user_id = req.body.user_id;
        const company_id = req.body.company_id;
        const datetime = req.body.start_date;
        const datetime_end = req.body.end_date;
        const new_datetime = datetime.replace('00:00:00.000', '');
        const new_datetime_end = datetime_end.replace('00:00:00.000', '');
        const real_datetime = new_datetime.replace(/[^0-9\.]+/g, '');
        const real_datetime_end = new_datetime_end.replace(/[^0-9\.]+/g, '');
        pool.query(`select * from saledata.fn_reportapp_countbill_cancle('${real_datetime}', '${real_datetime_end}', '${company_id}','${user_id}')`
            , (err, results) => {
                if (err) {
                    throw err;
                }
                res.status(200).json(results.rows);
                // console.log(results.rows);
            });
    }

    SumarizeWeek(req, res) {
        const db_name = req.body.db_name;
        const company_id = req.body.company_id;
        const user_id = req.body.user_id;
        const datetime = req.body.start_date;
        const datetime_end = req.body.end_date;
        const new_datetime = datetime.replace('00:00:00.000', '');
        const new_datetime_end = datetime_end.replace('00:00:00.000', '');
        const real_datetime = new_datetime.replace(/[^0-9\.]+/g, '');
        const real_datetime_end = new_datetime_end.replace(/[^0-9\.]+/g, '');
        pool.query(`select * from saledata.fn_reportapp_saleamount_bydayofweek('${real_datetime}', '${real_datetime_end}', '${company_id}', '${user_id}')`,
            (err, results) => {
                if (err) {
                    throw err;
                }
                res.status(200).json(results.rows);
                // console.log(results.rows);
            });
    }

    DashboardSales(req, res) {
        const company_id = req.body.company_id;
        const branch_id = req.body.branch_id;
        const user_id = req.body.user_id;
        const datetime = req.body.start_date;
        const datetime_end = req.body.end_date;
        const new_datetime = datetime.replace('00:00:00.000', '');
        const new_datetime_end = datetime_end.replace('00:00:00.000', '');
        const real_datetime = new_datetime.replace(/[^0-9\.]+/g, '');
        const real_datetime_end = new_datetime_end.replace(/[^0-9\.]+/g, '');
        pool.query(`select 
                        x.salehd_netamnt, -- ยอดขายสุทธิ // รวมสุทธิ
                        x.salehd_sumgoodamnt, -- ยอดขาย
                        x.salehd_voucheramnt, -- voucher,
                        x.salehd_discountamnt, -- ส่วนลด
                        x.salehd_tipamnt, -- ทิป
                        x.saledt_netamnt_service, -- ค่าบริการ
                        x.salehd_vatamnt,-- ภาษี
                        x.count_salebill, -- บิลทั้งหมด
                        x.count_bill_dining::numeric, -- บิลทานที่ร้าน
                        x.count_bill_talkaway::numeric, -- บิลกลับบ้าน
                        x.count_bill_talkanddin::numeric, -- บิลกลับบ้านและที่ร้าน
                        x.salehd_cashamnt, -- เงินสด
                        x.salehd_otheramnt, -- เงินอื่น
                        x.percen_other, -- เปอร์เซ็น เงินอื่นๆๆ
                        x.percen_cash, -- เปอร์เซ็นเงินสด
                        x.percen_other_full, -- เปอร์เซ็นอื่นๆ แบบเต็ม 100
                        x.percen_cash_full, -- เปอร์เซ็นเงินสด แบบเต็ม 100
                        x.sum_saleamount_dining,  -- ยอดขายทานที่ร้าน
                        x.sum_saleamount_takeaway, -- ยอดขายกลับบ้าน
                        x.sum_saleamount_diningandtake  -- ยอดขายกลับบ้านและที่ร้าน
                        from saledata.fn_reportapp_sum_saleamount_detail_branch('${real_datetime}', '${real_datetime_end}', '${company_id}', '${user_id}',array[${branch_id}]) x`,
            (err, results) => {
                if (err) {
                    throw err;
                }
                res.status(200).json(results.rows);
                // console.log(results.rows);
            });
    }

    DashboardSalesBill(req, res) {
        //const db_name = req.body.db_name;
        const company_id = req.body.company_id;
        const branch_id = req.body.branch_id;
        const user_id = req.body.user_id;
        const datetime = req.body.start_date;
        const datetime_end = req.body.end_date;
        const new_datetime = datetime.replace('00:00:00.000', '');
        const new_datetime_end = datetime_end.replace('00:00:00.000', '');
        const real_datetime = new_datetime.replace(/[^0-9\.]+/g, '');
        const real_datetime_end = new_datetime_end.replace(/[^0-9\.]+/g, '');
        pool.query(`select *
        from saledata.fn_reportapp_sum_countbill_detail_branch('${real_datetime}', '${real_datetime_end}', '${company_id}', '${user_id}',array[${branch_id}]) xx`,
            (err, results) => {
                if (err) {
                    throw err;
                }
                res.status(200).json(results.rows);
                // console.log(results.rows);
            });
    }

    DashboardSalesEveryday(req, res) {
        const db_name = req.body.db_name;
        const company_id = req.body.company_id;
        const branch_id = req.body.branch_id;
        const user_id = req.body.user_id;
        const datetime = req.body.start_date;
        const datetime_end = req.body.end_date;
        const new_datetime = datetime.replace('00:00:00.000', '');
        const new_datetime_end = datetime_end.replace('00:00:00.000', '');
        const real_datetime = new_datetime.replace(/[^0-9\.]+/g, '');
        const real_datetime_end = new_datetime_end.replace(/[^0-9\.]+/g, '');
        pool.query(`select *
        from saledata.fn_reportapp_saleamount_everyday_v1('${real_datetime}', '${real_datetime_end}', '${company_id}',  array[${branch_id}]) x`,
            (err, results) => {
                if (err) {
                    throw err;
                }
                res.status(200).json(results.rows);
                // console.log(results.rows);
            });
    }

    DashboardSalesHours(req, res) {
        const db_name = req.body.db_name;
        const company_id = req.body.company_id;
        const branch_id = req.body.branch_id;
        const user_id = req.body.user_id;
        const datetime = req.body.start_date;
        const datetime_end = req.body.end_date;
        const new_datetime = datetime.replace('00:00:00.000', '');
        const new_datetime_end = datetime_end.replace('00:00:00.000', '');
        const real_datetime = new_datetime.replace(/[^0-9\.]+/g, '');
        const real_datetime_end = new_datetime_end.replace(/[^0-9\.]+/g, '');
        pool.query(`select * from saledata.fn_reportapp_saleamount_byeveryhours_v1('${real_datetime}', '${real_datetime_end}', '${company_id}', array[${branch_id}]) x`,
            (err, results) => {
                if (err) {
                    throw err;
                }
                res.status(200).json(results.rows);
                // console.log(results.rows);
            });
    }

    DashboardSalesWeeks(req, res) {
        const db_name = req.body.db_name;
        const company_id = req.body.company_id;
        const branch_id = req.body.branch_id;
        const user_id = req.body.user_id;
        const datetime = req.body.start_date;
        const datetime_end = req.body.end_date;
        const new_datetime = datetime.replace('00:00:00.000', '');
        const new_datetime_end = datetime_end.replace('00:00:00.000', '');
        const real_datetime = new_datetime.replace(/[^0-9\.]+/g, '');
        const real_datetime_end = new_datetime_end.replace(/[^0-9\.]+/g, '');
        pool.query(`select * from saledata.fn_reportapp_saleamount_bydayofweek_vat_v1
            ('${real_datetime}', '${real_datetime_end}', '${company_id}', array[${branch_id}]) x`,
            (err, results) => {
                if (err) {
                    throw err;
                }
                res.status(200).json(results.rows);
                // console.log(results.rows);
            });
    }
    getdataPayment(req, res) {
        const start_date = req.body.start_date;
        const end_date = req.body.end_date;
        const user_id = req.body.user_id;
        const company_id = req.body.company_id;
        const branch_id = req.body.branch_id;
        if (branch_id) {
            pool.query(`select * from saledata.fn_reportapp_sale_amount_branch_everyday('${start_date}', '${end_date}', '${company_id}','${user_id}')
         where master_branch_id = any(array[${branch_id}])`,
                (err, result) => {
                    if (err) {
                        throw err;
                    }
                    res.json(result.rows);
                });
        } else {
            pool.query(`select * from saledata.fn_reportapp_sale_amount_branch_everyday('${start_date}', '${end_date}', '${company_id}','${user_id}')`,
                (err, result) => {
                    if (err) {
                        throw err;
                    }
                    res.json(result.rows);
                });

        }
    }

    getdataPaymentDetail(req, res) {
        const start_date = req.body.start_date;
        const end_date = req.body.end_date;
        const user_id = req.body.user_id;
        const company_id = req.body.company_id;
        const branch_id = req.body.branch_id;
        if (branch_id) {
            pool.query(`select *from saledata.fn_reportapp_salehd_amount_and_deposit_paytype('${start_date}', '${end_date}', '${company_id}','${user_id}')
         where master_branch_id = any(array[${branch_id}])`,
                (err, result) => {
                    if (err) {
                        throw err;
                    }
                    res.json(result.rows);
                });
        } else {
            pool.query(`select *from saledata.fn_reportapp_salehd_amount_and_deposit_paytype('${start_date}', '${end_date}', '${company_id}','${user_id}')`,
                (err, result) => {
                    if (err) {
                        throw err;
                    }
                    res.json(result.rows);
                });

        }
    }


    Cancellation_detail(req, res) {
        const company_id = req.body.company_id;
        const branch_id = req.body.branch_id;
        const start_date = req.body.start_date;
        const end_date = req.body.end_date;
        pool.query(`SELECT *  FROM saledata.fn_report_food_cancellation_detail('${start_date}', '${end_date}','${company_id}',array[${branch_id}])`,
            (err, results) => {
                if (err) {
                    throw err;
                }
                res.status(200).json(results.rows);
                // console.log(results.rows);
            });

    }

    getmovemenu_detail(req, res) {
        const company_id = req.body.company_id;
        const branch_id = req.body.branch_id;
        const start_date = req.body.start_date;
        const end_date = req.body.end_date;
        const user_id = req.body.user_id;
        pool.query(`select *
         from saledata.fn_reportapp_transfertable_order('${start_date}', '${end_date}', ${company_id},${user_id})
         where  (case when array[${branch_id}] = array[0]  then true else master_branch_id = any(array[${branch_id}]) end)`,
            (err, results) => {
                if (err) {
                    throw err;
                }
                res.status(200).json(results.rows);
            });

    }

    getbillorder_detail(req, res) {
        const company_id = req.body.company_id;
        const branch_id = req.body.branch_id;
        const start_date = req.body.start_date;
        const end_date = req.body.end_date;
        const user_id = req.body.user_id;
        pool.query(`select *
         from saledata.fn_reportapp_orderdt_detailto_saledt('${start_date}', '${end_date}', ${company_id},${user_id})
         where  (case when array[${branch_id}] = array[0]  then true else master_branch_id = any(array[${branch_id}]) end)`,
            (err, results) => {
                if (err) {
                    throw err;
                }
                res.status(200).json(results.rows);
            });

    }

    getbillcancle_detail(req, res) {
        const company_id = req.body.company_id;
        const branch_id = req.body.branch_id;
        const start_date = req.body.start_date;
        const end_date = req.body.end_date;
        const user_id = req.body.user_id;
        pool.query(`select *
         from saledata.fn_reportapp_cancelbill_settlement('${start_date}', '${end_date}', ${company_id},${user_id})
         where  (case when array[${branch_id}] = array[0]  then true else master_branch_id = any(array[${branch_id}]) end)`,
            (err, results) => {
                if (err) {
                    throw err;
                }
                res.status(200).json(results.rows);
            });

    }

    getreturnstatus_detail(req, res) {
        const company_id = req.body.company_id;
        const branch_id = req.body.branch_id;
        const start_date = req.body.start_date;
        const end_date = req.body.end_date;
        const user_id = req.body.user_id;
        pool.query(`select *  from saledata.fn_reportapp_billorder_returnstatus('${start_date}', '${end_date}', ${company_id},${user_id})
         where  (case when array[${branch_id}] = array[0]  then true else master_branch_id = any(array[${branch_id}]) end)`,
            (err, results) => {
                if (err) {
                    throw err;
                }
                res.status(200).json(results.rows);
            });

    }


    getshift_transaction(req, res) {
        const company_id = req.body.company_id;
        const branch_id = req.body.branch_id;
        const start_date = req.body.start_date;
        const end_date = req.body.end_date;
        pool.query(`select * from saledata.fn_report_shift_transaction('${start_date}', '${end_date}', ${company_id}, array[${branch_id}])`,
            (err, results) => {
                if (err) {
                    throw err;
                }
                res.status(200).json(results.rows);
            });

    }


    getreport_expense_dt(req, res) {
        const company_id = req.body.company_id;
        const branch_id = req.body.branch_id;
        const start_date = req.body.start_date;
        const end_date = req.body.end_date;
        pool.query(`select 
                    x.expense_status_id,
                    x.expense_status_name,
                    x.expense_hd_id,
                    x.expense_hd_docudate::text,
                    x.expense_hd_docuno,
                    x.expense_hd_amount,
                    x.fullname,
                    x.expense_hd_remark,
                    x.expense_hd_savetime,
                    x.master_branch_id,
                    x.master_branch_code,
                    x.master_branch_prefix,
                    x.master_branch_name,
                    x.expense_dt_id,
                    x.exp_expensemaster_id,
                    x.exp_expensemaster_code,
                    x.exp_expensemaster_name,
                    x.master_product_unit_name,
                    x.expense_dt_quantity,
                    x.expense_dt_unit_price,
                    x.expense_dt_amount
                    from purchase.fn_report_expense_dt('${start_date}', '${end_date}', ${company_id}, array[${branch_id}]) x`,
            (err, results) => {
                if (err) {
                    throw err;
                }
                res.status(200).json(results.rows);
            });

    }

    getreport_expense_hd(req, res) {
        const company_id = req.body.company_id;
        const branch_id = req.body.branch_id;
        const start_date = req.body.start_date;
        const end_date = req.body.end_date;
        pool.query(`select 
                    x.expense_status_id,
                    x.expense_status_name,
                    x.expense_hd_id,
                    x.expense_hd_docudate::text,
                    x.expense_hd_docuno,
                    x.expense_hd_amount,
                    x.fullname,
                    x.expense_hd_remark,
                    x.master_branch_id,
                    x.master_branch_code,
                    x.master_branch_prefix,
                    x.master_branch_name,
                    x.expense_hd_savetime 
                    from  purchase.fn_report_expense_hd('${start_date}', '${end_date}', ${company_id}, array[${branch_id}]) x`,
            (err, results) => {
                if (err) {
                    throw err;
                }
                res.status(200).json(results.rows);
            });
    }

    getproduct_barcode(req, res) {
        const company_id = req.body.company_id;
        pool.query(`select  * from  master_data.master_product as pd
                    left join master_data.master_product_price as pr
                    on pd.master_product_id = pr.master_product_id
                    where master_company_id = ${company_id}`,
            (err, results) => {
                if (err) {
                    throw err;
                }
                res.status(200).json(results.rows);
            });
    }


    getreportreport_stockcard_by_product(req, res) {
        const company_id = req.body.company_id;
        const branch_id = req.body.branch_id;
        const start_date = req.body.start_date;
        const product_id = req.body.product_id;
        const end_date = req.body.end_date;
        pool.query(`select * from  inventory.fn_report_detail_stockcard_by_product('${start_date}','${end_date}',array[${product_id}],array[${branch_id}],${company_id})`,
            (err, results) => {
                if (err) {
                    throw err;
                }
                res.status(200).json(results.rows);
            });
    }

    getreport_stockcard_balance(req, res) {
        const company_id = req.body.company_id;
        const branch_id = req.body.branch_id;
        const start_date = req.body.start_date;
        const product_id = req.body.product_id;
        const productgroup_id = req.body.productgroup_id;
        const category_id = req.body.category_id;
        const end_date = req.body.end_date;
        pool.query(`select * from inventory.fn_report_stockcard_balance_by_product('${start_date}','${end_date}',array[${product_id}],array[${branch_id}],${company_id},array[${productgroup_id}],array[${category_id}])`,
            (err, results) => {
                if (err) {
                    throw err;
                }
                res.status(200).json(results.rows);
            });
    }

    getreport_sale_summary_cash(req, res) {
        const company_id = req.body.company_id;
        const branch_id = req.body.branch_id;
        const start_date = req.body.start_date;
        const end_date = req.body.end_date;
        pool.query(`SELECT * FROM saledata.fn_report_sale_summary_cash('${start_date}','${end_date}', ${company_id}, array[${branch_id}])`,
            (err, results) => {
                if (err) {
                    throw err;
                }
                res.status(200).json(results.rows);
            });
    }

    getreport_sale_summary_cash_detail(req, res) {
        const company_id = req.body.company_id;
        const branch_id = req.body.branch_id;
        const start_date = req.body.start_date;
        const end_date = req.body.end_date;
        pool.query(`SELECT * FROM saledata.fn_report_sale_summary_cash_detail('${start_date}','${end_date}', ${company_id}, array[${branch_id}]) 
            order by savetime`,
            (err, results) => {
                if (err) {
                    throw err;
                }
                res.status(200).json(results.rows);
            });
    }

    getSportCheckAll(req, res) {
        const company_id = req.body.company_id;
        const branch_id = req.body.branch_id;
        const date = req.body.date;
        const emp_id = req.body.emp_id;
        pool.query(`SELECT x.shiftopen_float_in,	
        x.shiftopen_cashier_name,	
        x.shiftopen_start_date,	
        x.shiftopen_start_time,	
        x.shiftopen_print_date,	
        x.shiftopen_print_time,	
        x.shiftopen_start_cashamnt,	
        x.sportcheckemp_employeecode,	
        x.sportcheckemp_fullname,	
        x.sportcheckshiftopen_float_in,	
        x.sportcheckshiftopen_start_date,	
        x.sportcheckshiftopen_start_time,	
        x.sportcheckshiftopen_print_date,	
        x.sportcheckshiftopen_print_time,	
        x.sportcheckhd_billamnt,	
        x.sportcheckhd_customeramnt,	
        x.sportcheckhd_sumgoodamnt,	
        x.sportcheckhd_service_chargeamnt,	
        x.sportcheckhd_vatamnt,	
        x.sportcheckhd_discountamnt,	
        x.sportcheckhd_netamnt,	
        x.sportcheckcash_cashamnt,	
        x.sportcheckcashin_cashinamnt,	
        x.sportcheckexpense_expenseamnt,	
        x.sportcheckcashtotal_cashtotal,	
        x.sportcheckcashdiff_diffamnt,	
        x.sportcheckcancel_cancelamnt,	
        x.sportcheckchangetable_changetableamnt,	
        x.sportcheckchangefood_changefoodamnt,	
        x.sportcheckpoint_pointamnt,	
        x.sportcheckredeem_redeemamnt,	
        x.sportchecprintbill_printbillamnt	
        FROM "saledata"."fn_report_sport_check_all"(${company_id}, ${branch_id}, '${date}', ${emp_id}) x;`,
            (err, results) => {
                if (err) {
                    throw err;
                }
                res.status(200).json(results.rows);
            });
    }

    getSportCheckSaledt(req, res) {
        const company_id = req.body.company_id;
        const branch_id = req.body.branch_id;
        const date = req.body.date;
        pool.query(`SELECT x.payment_subject,
        x.payment_name,
        x.payment_totalamnt,
        x.payment_quantity
        FROM "saledata"."fn_report_sport_check_saledt"(${company_id}, ${branch_id}, '${date}') x;`,
            (err, results) => {
                if (err) {
                    throw err;
                }
                res.status(200).json(results.rows);
            });
    }

    getShiftCloseAll(req, res) {
        const company_id = req.body.company_id;
        const branch_id = req.body.branch_id;
        const date = req.body.date;
        pool.query(`SELECT x.shiftclose_company_name,
        x.shiftclose_branch_name,
        x.shiftclose_end_date,
        x.shiftclose_end_time,
        x.shiftclose_payment_totalamnt,
        x.shiftclose_expenseamnt,
        x.shiftclose_cashinamnt,
        x.shiftclose_balanceamnt
        FROM "saledata"."fn_report_shift_close_all"(${company_id}, ${branch_id}, '${date}') x;`,
            (err, results) => {
                if (err) {
                    throw err;
                }
                res.status(200).json(results.rows);
            });
    }

    getShiftCloseSaledt(req, res) {
        const company_id = req.body.company_id;
        const branch_id = req.body.branch_id;
        const date = req.body.date;
        pool.query(`SELECT x.payment_name,
        x.payment_totalamnt
        FROM "saledata"."fn_report_shift_close_saledt"(${company_id}, ${branch_id}, '${date}') x;`,
            (err, results) => {
                if (err) {
                    throw err;
                }
                res.status(200).json(results.rows);
            });
    }

    getCheckShiftOpen(req, res) {
        const company_id = req.body.company_id;
        const branch_id = req.body.branch_id;
        const date = req.body.date;
        pool.query(`SELECT "saledata"."fn_report_check_shift_open"(${company_id}, ${branch_id}, '${date}');`,
            (err, results) => {
                if (err) {
                    throw err;
                }
                res.status(200).json(results.rows);
            });
    }

    getCheckShiftClose(req, res) {
        const company_id = req.body.company_id;
        const branch_id = req.body.branch_id;
        const date = req.body.date;
        pool.query(`SELECT "saledata"."fn_report_check_shift_close"(${company_id}, ${branch_id}, '${date}');`,
            (err, results) => {
                if (err) {
                    throw err;
                }
                res.status(200).json(results.rows);
            });
    }

    getReceivebyCredit(req, res) {
        const company_id = req.body.company_id;
        const branch_id = req.body.branch_id;
        const card_type_id = req.body.card_type_id;
        const start_date = req.body.start_date;
        const end_date = req.body.end_date;
        pool.query(`SELECT x.listno,
        x.master_branch_code,
        x.master_branch_name,
        x.salehd_docudate::VARCHAR,
        x.salehd_docuno,
        x.cq_bank_name,
        x.cq_cardtype_name,
        x.cheq_cheqdata_rec_cardno,
        x.cheq_cheqdata_rec_amount,
        x.cheq_cheqdata_rec_bankfeeamnt,
        x.cheq_cheqdata_rec_totalamnt,
        x.fullname
        FROM "saledata"."fn_report_receiveby_creditcard"(${company_id}, ARRAY[${branch_id}], '${start_date}', '${end_date}', ARRAY[${card_type_id}]) x;`,
            (err, results) => {
                if (err) {
                    throw err;
                }
                res.status(200).json(results.rows);
            });
    }

    getCardType(req, res) {
        const company_id = req.body.company_id;
        pool.query(`SELECT x.cq_cardtype_id,
        x.cq_cardtype_name as name,
        x.cq_cardtype_bankfee,
        x.charge_max_amnt,
        x.cq_cardtype_flag as value,
        x.cq_cardtype_check as check,
        x.cq_cardtype_id_text as id
        FROM "master_data_all"."fn_select_cardtype"(${company_id}) x`,
            (err, results) => {
                if (err) {
                    throw err;
                }
                res.status(200).json(results.rows);
            });
    }

    getCardTypeID(req, res) {
        const company_id = req.body.company_id;
        const card_type_id = req.body.card_type_id;
        pool.query(`SELECT x.cq_cardtype_id,
        x.cq_cardtype_name as name,
        x.cq_cardtype_bankfee,
        x.charge_max_amnt,
        x.cq_cardtype_flag as value,
        x.cq_cardtype_check as check,
        x.cq_cardtype_id_text as id
        FROM "master_data_all"."fn_select_cardtype"(${company_id}) x
        WHERE cq_cardtype_id =  ANY(ARRAY[${card_type_id}])`,
            (err, results) => {
                if (err) {
                    throw err;
                }
                res.status(200).json(results.rows);
            });
    }

    getValueCategory(req, res) {
        const company_id = req.body.company_id;
        const user_id = req.body.user_id;
        const real_datetime = req.body.start_date;
        const real_datetime_end = req.body.end_date;
        const branch_list_id = req.body.branch_list_id;
        pool.query(`select *  from saledata.fn_reportapp_saleamount_group_and_growth_group_v1_branch('${real_datetime}', '${real_datetime_end}', '${company_id}','${user_id}',array[${branch_list_id}])`
            , (err, results) => {
                if (err) {
                    throw err;
                }
                res.status(200).json(results.rows);
                // console.log(results.rows);
            });
    }

    getCustomerData(req, res) {
        const company_id = req.body.company_id;
        const user_id = req.body.user_id;
        const real_datetime = req.body.start_date;
        const real_datetime_end = req.body.end_date;
        const branch_list_id = req.body.branch_list_id;
        pool.query(`select * 
        from saledata.fn_reportapp_saleamount_and_countar_branch('${real_datetime}', '${real_datetime_end}', '${company_id}', '${user_id}',array[${branch_list_id}])`
            , (err, results) => {
                if (err) {
                    throw err;
                }
                res.status(200).json(results.rows);
                // console.log(results.rows);
            });
    }

    getMonthlySales(req, res) {
        const company_id = req.body.company_id;
        const user_id = req.body.user_id;
        const real_datetime = req.body.start_date;
        const real_datetime_end = req.body.end_date;
        const branch_list_id = req.body.branch_list_id;
        pool.query(`select * 
        from saledata.fn_reportapp_saleamount_bymonth_branch('${real_datetime}', '${real_datetime_end}', '${company_id}', '${user_id}',array[${branch_list_id}])`
            , (err, results) => {
                if (err) {
                    throw err;
                }
                res.status(200).json(results.rows);
                // console.log(results.rows);
            });
    }

    getCancleBill(req, res) {
        const company_id = req.body.company_id;
        const user_id = req.body.user_id;
        const real_datetime = req.body.start_date;
        const real_datetime_end = req.body.end_date;
        const branch_list_id = req.body.branch_list_id;
        pool.query(`select * 
        from saledata.fn_reportapp_countbill_cancle_branch('${real_datetime}', '${real_datetime_end}', '${company_id}', '${user_id}',array[${branch_list_id}])`
            , (err, results) => {
                if (err) {
                    throw err;
                }
                res.status(200).json(results.rows);
                // console.log(results.rows);
            });
    }

    getSalesPerDay(req, res) {
        const company_id = req.body.company_id;
        const user_id = req.body.user_id;
        const real_datetime = req.body.start_date;
        const real_datetime_end = req.body.end_date;
        const branch_list_id = req.body.branch_list_id;
        pool.query(`select * 
        from saledata.fn_reportapp_saleamount_bydayofweek_branch('${real_datetime}', '${real_datetime_end}', '${company_id}', '${user_id}',array[${branch_list_id}])`
            , (err, results) => {
                if (err) {
                    throw err;
                }
                res.status(200).json(results.rows);
                // console.log(results.rows);
            });
    }

    getCostAndSpend(req, res) {
        const company_id = req.body.company_id;
        const user_id = req.body.user_id;
        const real_datetime = req.body.start_date;
        const real_datetime_end = req.body.end_date;
        const branch_list_id = req.body.branch_list_id;
        pool.query(`select * 
        from saledata.fn_reportapp_totalamount_cost_and_spend_branch('${real_datetime}', '${real_datetime_end}', '${company_id}', '${user_id}',array[${branch_list_id}])`
            , (err, results) => {
                if (err) {
                    throw err;
                }
                res.status(200).json(results.rows);
                // console.log(results.rows);
            });
    }

    getCostAmntAndSpendAmnt(req, res) {
        const company_id = req.body.company_id;
        const user_id = req.body.user_id;
        const real_datetime = req.body.start_date;
        const real_datetime_end = req.body.end_date;
        const branch_list_id = req.body.branch_list_id;
        pool.query(`select * from saledata.fn_reportapp_saleamount_and_costspend_area_branch('${real_datetime}', '${real_datetime_end}', '${company_id}', '${user_id}',array[${branch_list_id}]) where saledt_netamnt_exvat <> 0`
            , (err, results) => {
                if (err) {
                    throw err;
                }
                res.status(200).json(results.rows);
                // console.log(results.rows);
            });
    }

    getReceivebyTransfer(req, res) {
        const company_id = req.body.company_id;
        const branch_id = req.body.branch_id;
        const bank_id = req.body.bank_id;
        const start_date = req.body.start_date;
        const end_date = req.body.end_date;
        pool.query(`SELECT x.listno,
        x.master_branch_code,
        x.master_branch_name,
        x.salehd_docudate ::Text,
        x.salehd_docuno,
        x.cq_bank_name,
        x.transfer_totalamnt,
        x.fullname
        FROM "saledata"."fn_report_receiveby_transfer"(${company_id}, ARRAY[${branch_id}], '${start_date}', '${end_date}', ARRAY[${bank_id}]) x;`
            , (err, results) => {
                if (err) {
                    throw err;
                }
                res.status(200).json(results.rows);
                // console.log(results.rows);
            });
    }

    getBank(req, res) {
        const company_id = req.body.company_id;
        pool.query(`SELECT x.cq_bank_id,
        x.cq_bank_code,
        x.cq_bank_name,
        x.cq_bank_flag,
        x.cq_bank_check
        FROM "master_data"."fn_select_bank"(${company_id}) x;`
            , (err, results) => {
                if (err) {
                    throw err;
                }
                res.status(200).json(results.rows);
                // console.log(results.rows);
            });
    }

    moveTableReport(req, res) {
        const company_id = req.body.company_id;
        const branch_id = req.body.branch_id;
        const start_date = req.body.start_date;
        const end_date = req.body.end_date;
        pool.query(`SELECT x.master_branch_id,
        x.master_branch_code,
        x.master_branch_prefix,
        x.master_branch_name,
        x.time_src :: time(0),
        x.orderhd_docuno,
        x.table_src,
        x.time_desc :: time(0),
        x.table_desc,
        x.orderhd_netamnt,
        x.fullname_desc,
        x.fullname_src,
        x.orderhd_docudate ::VARCHAR
        FROM saledata.fn_report_transfertable_orderhd('${start_date}', '${end_date}', ${company_id}, ARRAY[${branch_id}]) x;`, (err, results) => {
            if (err) {
                throw err;
            }
            res.status(200).json(results.rows);
            // console.log(results.rows);
        });
    }

    employeeSales(req, res) {
        const company_id = req.body.company_id;
        const branch_id = req.body.branch_id;
        const start_date = req.body.start_date;
        const end_date = req.body.end_date;
        pool.query(`SELECT x.select_data
        FROM "saledata"."fn_report_saleamount_byemployee"(${company_id}, ARRAY[${branch_id}], '${start_date}', '${end_date}') x;`, (err, results) => {
            if (err) {
                throw err;
            }
            res.status(200).json(results.rows);
            // console.log(results.rows);
        });
    }

    promotionType(req, res) {
        pool.query(`SELECT x.promotion_type_setting_id,
        x.promotion_type_setting_name FROM "promotion"."promotion_type_setting" x
        ORDER BY x.promotion_type_setting_id;`, (err, results) => {
            if (err) {
                throw err;
            }
            res.status(200).json(results.rows);
            // console.log(results.rows);
        });
    }

    promotionHd(req, res) {
        const company_id = req.body.company_id;
        const start_date = req.body.start_date;
        const end_date = req.body.end_date;
        pool.query(`SELECT x.promotion_hd_id,
        x.promotion_hd_name
        FROM "promotion"."fn_select_promotion_type_for_report"(${company_id}, '${start_date}', '${end_date}') x;`, (err, results) => {
            if (err) {
                throw err;
            }
            res.status(200).json(results.rows);
            // console.log(results.rows);
        });
    }

    promotionReport(req, res) {
        const company_id = req.body.company_id;
        const branch_id = req.body.branch_id;
        const start_date = req.body.start_date;
        const end_date = req.body.end_date;
        const promotion_type = req.body.promotion_type;
        const promotion_hd = req.body.promotion_hd;
        pool.query(`SELECT x.promotion_type_setting_id,
        x.promotion_type_setting_name,
        x.promotion_hd_id,
        x.promotion_hd_name,
        x.promotion_hd_docuno,
        x.master_branch_code,
        x.master_branch_name,
        x.salehd_docudate :: date,
        x.salehd_id,
        x.salehd_docuno,
        x.salehd_arcustomer_name,
        x.saledt_qty,
        x.saledt_netamnt,
        x.master_order_location_type_name,
        x.salehd_employee_save,
        x.salehd_savetime
        FROM "saledata"."fn_report_promotion"(${company_id}, ARRAY[${branch_id}], '${start_date}', '${end_date}', ARRAY[${promotion_type}], ARRAY[${promotion_hd}]) x;`, (err, results) => {
            if (err) {
                throw err;
            }
            res.status(200).json(results.rows);
            // console.log(results.rows);
        });
    }

    report_stockcard_minmax(req, res) {
        const company_id = req.body.company_id;
        const branch_id = req.body.branch_id;
        const productgroup_id = req.body.productgroup_id;
        const prodcut_name = req.body.prodcut_name;
        const StartMaxQty = req.body.StartMaxQty;
        const StartMinQty = req.body.StartMinQty;
        const StartStockQty = req.body.StartStockQty;
        const EndMaxQty = req.body.EndMaxQty;
        const EndMinQty = req.body.EndMinQty;
        const EndStockQty = req.body.EndStockQty;
        const MinFlag = req.body.MinFlag;
        pool.query(`select *from inventory.fn_report_stockcard_minmax_v1
                            (
                                ${company_id}, 
                                array[${branch_id}],
                                array[${productgroup_id}],
                                '${prodcut_name}',
                                ${StartMaxQty},
                                ${StartMinQty},
                                ${StartStockQty},
                                ${EndMaxQty},
                                ${EndMinQty},
                                ${EndStockQty},
                                ${MinFlag}
                            )`,
            (err, results) => {
            if (err) {
                throw err;
            }
            res.status(200).json(results.rows);
            // console.log(results.rows);
        });
    }

    getreport_stockcard_by_product_new(req, res) {
        const master_company_id = req.body.master_company_id;
        const master_branch_id = req.body.master_branch_id;
        const start_date = req.body.start_date;
        const _productname = req.body.search_productname;
        //const product_id = req.body.product_id;
        const master_product_group_id = req.body.master_product_group_id;
        const master_product_catagory_id = req.body.master_product_catagory_id;
        const end_date = req.body.end_date;
        pool.query(`select 
                    x.docuno, 
                    x.docudate::text, 
                    x.master_product_id, 
                    x.master_product_code, 
                    x.master_product_name, 
                    x.master_product_unit_name, 
                    x.master_branch_id, 
                    x.master_branch_code, 
                    x.master_branch_prefix, 
                    x.master_branch_name, 
                    x.master_company_name, 
                    x.master_product_unit_id, 
                    x.stockcard_status_id, 
                    x.master_company_id, 
                    x.master_docutype_id, 
                    x.quantity, 
                    x.stockflag, 
                    x.stock_qty, 
                    x.balance, 
                    x.in_stock, 
                    x.out_stock
                    from inventory.fn_reportapp_detail_stockcard_by_product_v1
                    (
                        '${start_date}',                     --_sdate
                        '${end_date}',                      --_edate
                        ${master_company_id},              --_master_company_id
                        array[${master_branch_id}],      --_master_branch_id
                        array[${master_product_group_id}],       --_master_product_group_id
                        array[${master_product_catagory_id}],       --_master_product_category_id
                        array[0],       --_master_product_id
                        '${_productname}'              --_master_product_name
                    )x
                    ;
                    `,
            (err, results) => {
                if (err) {
                    throw err;
                }
                res.status(200).json(results.rows);
            });
    }

    getreport_stockcard_balance_new(req, res) {
        const master_company_id = req.body.master_company_id;
        const master_branch_id = req.body.master_branch_id;
        const start_date = req.body.start_date;
        const _productname = req.body.search_productname;
        //const product_id = req.body.product_id;
        const master_product_group_id = req.body.master_product_group_id;
        const master_product_catagory_id = req.body.master_product_catagory_id;
        const end_date = req.body.end_date;
        //console.log('%%'+_productname);
        pool.query(`select 
                    x.master_product_id, 
                    x.master_product_code,  
                    x.master_product_name,
                    x.master_product_unit_name,
                    x.master_branch_id,
                    x.master_branch_code,
                    x.master_branch_prefix,
                    x.master_branch_name,
                    x.master_company_name, 
                    x.master_product_unit_id, 
                    x.stockcard_status_id,   
                    x.master_company_id, 
                    x.master_docutype_id ,
                    x.balance,
                    x.master_product_group_name,
                    x.master_product_category_name 
                    from inventory.fn_report_stockcard_balance_by_product_v1
                    (
                        '${end_date}',
                        '${_productname}',
                        ${master_company_id},
                        array[${master_branch_id}],
                        array[${master_product_group_id}],
                        array[${master_product_catagory_id}]
                    ) x`,
            (err, results) => {
                if (err) {
                    throw err;
                }
                res.status(200).json(results.rows);
            });
    }

    getreport_sale_sumdaily(req, res) {
        const master_company_id = req.body.company_id;
        const master_branch_id = req.body.branch_id;
        const start_date = req.body.start_date;
        const end_date = req.body.end_date;
        pool.query(`select
                    x.master_branch_code,  -- รหัสสาขา
                    x.master_branch_name,  -- ชื่อสาขา
                    x.product_docudate,  -- วันที่
                    x.product_netamnt_sale,  -- ขายสดสุทธิ
                    x.product_netamnt_credit,  -- ขายเชื่อ
                    x.product_netamnt_received, -- ลดหนี้
                    x.product_netamnt_credit_total, -- ขายเชื่อสุทธิ
                    x.product_netamnt_total         -- รวมทั้งสิ้น
                    from saledata.fn_report_sale_sumdaily
                    ('${start_date}',      -- วันที่เลือกเริ่มต้น
                     '${end_date}',      -- วันที่เลือกสิ้นสุด
                     ${master_company_id},        -- ID Company
                     array[${master_branch_id}]
                    ) x`,
            (err, results) => {
                if (err) {
                    throw err;
                }
                res.status(200).json(results.rows);
            });
    }

    getreport_saleamount_byemployee(req, res) {
        const master_company_id = req.body.company_id;
        const master_branch_id = req.body.branch_id;
        const start_date = req.body.start_date;
        const end_date = req.body.end_date;
        pool.query(`select
                        x.master_branch_code,  -- รหัสสาขา
                        x.master_branch_name,  -- ชื่อสาขา
                        x.fullname,     -- ชื่อพนักงาน
                        x.saledt_master_product_barcode_code, -- รหัสสินค้า
                        x.saledt_master_product_billname,  -- ชื่อสินค้า
                        x.saledt_qty,       -- จำนวนที่ขายได้
                        x.saledt_netamnt      -- ยอดขาย
                        from saledata.fn_report_saleamount_byemployee
                     (  '${start_date}',      -- วันที่เลือกเริ่มต้น
                         '${end_date}',      -- วันที่เลือกสิ้นสุด
                         ${master_company_id},        -- ID Company
                        array[${master_branch_id}]
                    ) x`,
            (err, results) => {
                if (err) {
                    throw err; 
                }
                res.status(200).json(results.rows);
            });
    }

    getreport_sale_bill_v1(req, res) {
        const master_company_id = req.body.company_id;
        const master_branch_id = req.body.branch_id;
        const start_date = req.body.start_date;
        const end_date = req.body.end_date;
        pool.query(`select
                    x.master_branch_code,     -- สาขา
                    x.master_branch_name,     -- ชื่อสาขา
                    x.orderdt_bill_docudate,   -- วันที่ใบสั่งขาย
                    x.orderhd_docuno,     -- เลขที่ใบสั่งขาย
                    x.salehd_docudate,     -- วันที่บิลขาย
                    x.salehd_docuno,      -- เลขที่บิลขาย
                    x.check_bill_docudate,
                    x.master_product_code,    -- รหัสสินค้า
                    x.orderdt_master_product_billname,  -- ชื่อสินค้า
                    x.orderdt_qty,       -- จำนวน
                    x.master_product_unit_name,   -- หน่วยนับ
                    x.orderdt_saleprice,     -- ราคา/หน่วย
                    x.orderdt_discount_amnt,    -- ส่วนลด
                    x.orderdt_netamnt      -- ราคารวม
                    from saledata.fn_report_sale_bill_v1
                    (
                     '${start_date}',      -- วันที่เลือกเริ่มต้น
                         '${end_date}',      -- วันที่เลือกสิ้นสุด
                         ${master_company_id},        -- ID Company
                        array[${master_branch_id}]
                    ) x
                    ;`,
            (err, results) => {
                if (err) {
                    throw err;
                }
                res.status(200).json(results.rows);
            });
    }

    getreport_salehd_amount_detail_pay_v1(req, res) {
        const master_company_id = req.body.company_id;
        const master_branch_id = req.body.branch_id;
        const start_date = req.body.start_date;
        const end_date = req.body.end_date;
        pool.query(`select
                x.master_branch_code,   -- รหัสสาขา
                x.master_branch_name,   -- ชื่อสาขา
                x.salehd_docudate,    -- วันที่ขาย
                x.salehd_docuno,    -- เลขที่เอกสาร
                x.salehd_arcustomer_name,  -- ประเภทลูกค้า
                x.master_docutype_name,  -- ประเภทเอกสาร
                x.salehd_sumgoodamnt,   -- ยอดมูลค่าสินค้า
                x.salehd_feeamnt,    -- ค่าธรรมเนียมบัตรเครดิต
                x.salehd_discountamnt,   -- ส่วนลด
                x.salehd_voucheramnt,   -- Voucher
                x.salehd_partneramnt,   -- เงินเชื่อ
                x.salehd_cashamount_all,  -- เงินสด
                x.salehd_tipamnt,    -- เงินทิป
                x.salehd_transferamnt,   -- เงินโอน
                x.salehd_creditcardamnt,  -- บัตรเครดิต
                x.salehd_chequeamnt,   -- เช็ค
                x.salehd_depositamnt,   -- เงินมัดจำ
                x.salehd_netamnt    -- ยอดสุทธิ
                from saledata.fn_report_salehd_amount_detail_pay_v1
                    (
                     '${start_date}',      -- วันที่เลือกเริ่มต้น
                         '${end_date}',      -- วันที่เลือกสิ้นสุด
                         ${master_company_id},        -- ID Company
                        array[${master_branch_id}]
                    ) x
                    ;`,
            (err, results) => {
                if (err) {
                    throw err;
                }
                res.status(200).json(results.rows);
            });
    }

    getreport_sale_product_explain(req, res) {
        const master_company_id = req.body.company_id;
        const master_branch_id = req.body.branch_id;
        const start_date = req.body.start_date;
        const end_date = req.body.end_date;
        pool.query(`select
                    x.master_branch_code ,         -- รหัสสาขา
                    x.master_branch_name ,      -- ชื่อสาขา
                    x.salehd_docudate ,      -- วันที่เอกสาร
                    x.salehd_docuno ,      -- เลขที่เอกสาร
                    x.salehd_docuno_invoice ,    -- เลขที่ใบกำกับภาษี
                    x.barcode ,        -- รหัสสินค้า
                    x.master_product_barcode_billname , -- ชื่อสินค้า
                    x.master_product_unit_name ,  -- หน่วยนับ
                    x.saledt_qty ,      -- จำนวน
                    x.saledt_discount_amnt ,   -- ส่วนลด
                    x.saledt_saleprice,     -- ราคา
                    x.saledt_baseamount,    -- ฐานภาษี
                    x.saledt_vat,      -- ภาษี
                    x.saledt_netamnt,     -- จำนวนเงิน
                    x.fullname       -- ผู้บันทึกข้อมูล
                    from saledata.fn_report_sale_product_explain
                    (
                     '${start_date}',      -- วันที่เลือกเริ่มต้น
                         '${end_date}',      -- วันที่เลือกสิ้นสุด
                         ${master_company_id},        -- ID Company
                        array[${master_branch_id}]
                    ) x
                    ;`,
            (err, results) => {
                if (err) {
                    throw err;
                }
                res.status(200).json(results.rows);
            });
    }

    getreport_sale_product_explain_summarize(req, res) {
        const master_company_id = req.body.company_id;
        const master_branch_id = req.body.branch_id;
        const start_date = req.body.start_date;
        const end_date = req.body.end_date;
        pool.query(`select
                        x.master_branch_code ,         -- รหัสสาขา
                        x.master_branch_name ,      -- ชื่อสาขา
                        x.barcode ,        -- รหัสสินค้า
                        x.master_product_barcode_billname , -- ชื่อสินค้า
                        x.master_product_unit_name ,  -- หน่วยนับ
                        x.saledt_qty ,      -- จำนวน
                        x.saledt_discount_amnt ,   -- ส่วนลด
                        x.saledt_saleprice,     -- ราคา
                        x.saledt_baseamount,    -- ฐานภาษี
                        x.saledt_vat,      -- ภาษี
                        x.saledt_netamnt     -- จำนวนเงิน
                        from saledata.fn_report_sale_product_explain_summarize
                    (
                     '${start_date}',      -- วันที่เลือกเริ่มต้น
                         '${end_date}',      -- วันที่เลือกสิ้นสุด
                         ${master_company_id},        -- ID Company
                        array[${master_branch_id}]
                    ) x
                    ;`,
            (err, results) => {
                if (err) {
                    throw err;
                }
                res.status(200).json(results.rows);
            });
    }
}

module.exports = ModelReport;