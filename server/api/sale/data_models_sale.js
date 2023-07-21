const pool = require('../../connectdb.js');

class modelSale{

    getOrderhd_for_sales(req, res) {
        let company_id = req.body.company_id;
        let branch_id = req.body.branch_id;
        let startdate = req.body.startdate;
        let enddate = req.body.enddate;
        pool.query(`SELECT
                 *  FROM  saledata.fn_orderhd_for_sales ( '${startdate}', '${enddate}', ${company_id}, ${branch_id} ) x`,
            (err, result) => {
                if (err) {
                    throw err;
                }
                res.json(result.rows);
            });
    }

    getsaledt_master_product(req, res) {
        let company_id = req.body.company_id;
        let branch_id = req.body.branch_id;
        let orderh_id = req.body.orderh_id;
        let customer_id = req.body.customer_id;
        let docdate = req.body.docdate;
        pool.query(`SELECT  * FROM "saledata"."fn_select_order"(${company_id}, ${branch_id}, array[${orderh_id}], ${customer_id},'${docdate}') x;`,
            (err, result) => {
                if (err) {
                    throw err;
                }
                res.json(result.rows);
            });
    }

    get_product_barcode_for_sale(req, res) {
        let company_id = req.body.company_id;
        let branch_id = req.body.branch_id;
        let barcode = req.body.barcode;
        let customer_id = req.body.customer_id;
        let docdate = req.body.docdate;
        let qty = req.body.qty;
        pool.query(`SELECT * FROM "saledata"."fn_select_product_barcode_for_sale"(${company_id}, ${branch_id}, ${customer_id}, '${docdate}', '${barcode}', ${qty}) x;`,
            (err, result) => {
                if (err) {
                    throw err;
                }
                res.json(result.rows);
            });
    }

    get_product_barcode_for_sale_all(req, res) {
        let company_id = req.body.company_id;
        let branch_id = req.body.branch_id;
        let product_barcode = JSON.stringify(req.body.product_barcode);
        let customer_id = req.body.customer_id;
        let docdate = req.body.docdate;
        pool.query(`SELECT * FROM "saledata"."fn_select_product_barcode_for_sale_all"(${company_id}, ${branch_id}, ${customer_id}, '${docdate}','${product_barcode}') x;`,
            (err, result) => {
                if (err) {
                    throw err;
                }
                res.json(result.rows);
        });
    }

    get_select_sale_transection_resale(req, res) {
        let company_id = req.body.company_id;
        let branch_id = req.body.branch_id;
        let docdate = req.body.docdate;
        pool.query(`SELECT * FROM "saledata"."fn_select_sale_transection_resale"(${company_id}, ${branch_id}, '${docdate}') x;`,
            (err, result) => {
                if (err) {
                    throw err;
                }
                res.json(result.rows);
            });
    }


    getdata_bookbanktranfer(req, res) {
        const company_id = req.body.company_id;
        pool.query(`SELECT *
                FROM "master_data"."fn_select_bankbook_transfer"(${company_id});`,
            (err, result) => {
                if (err) {
                    throw err;
                }
                res.json(result.rows);
            });
    }

    getdata_bookbankcredit(req, res) {
        const company_id = req.body.company_id;
        pool.query(`SELECT *
                    FROM "master_data"."fn_select_bankbook_creditcard"(${company_id});`,
            (err, result) => {
                if (err) {
                    throw err;
                }
                res.json(result.rows);
            });
    }

    getdata_currency(req, res) {
        const company_id = req.body.company_id;
        pool.query(`SELECT *
                    FROM "master_data_all"."fn_select_currency"(${company_id});`,
            (err, result) => {
                if (err) {
                    throw err;
                }
                res.json(result.rows);
            });
    }

    getdata_deposithd(req, res) {
        const company_id = req.body.company_id;
        const customer_id = req.body.customer_id
        pool.query(`SELECT *
                    FROM "saledata"."fn_select_deposit"(${company_id}, ${customer_id});`,
            (err, result) => {
                if (err) {
                    throw err;
                }
                res.json(result.rows);
            });
    }

    getdata_voucher(req, res) {
        const company_id = req.body.company_id;
        pool.query(`SELECT *
                    FROM "saledata"."fn_select_voucher_type"(${company_id});`,
            (err, result) => {
                if (err) {
                    throw err;
                }
                res.json(result.rows);
            });
    }

    getdata_wht_category(req, res) {
        const company_id = req.body.company_id;
        pool.query(`SELECT * FROM "saledata"."fn_select_wht_category"(${company_id});`,
            (err, result) => {
                if (err) {
                    throw err;
                }
                res.json(result.rows);
            });
    }

    getdata_promotion_point(req, res) {
        const company_id = req.body.company_id;
        pool.query(`SELECT *
                    FROM "promotion"."fn_select_point_type"(${company_id});`,
            (err, result) => {
                if (err) {
                    throw err;
                }
                res.json(result.rows);
            });
    }

    getdata_pointtype(req, res) {
        const company_id = req.body.company_id;
        const customer_id = req.body.customer_id;
        pool.query(`SELECT *
                FROM "promotion"."fn_select_point_type"(${company_id}, ${customer_id});`,
            (err, result) => {
                if (err) {
                    throw err;
                }
                res.json(result.rows);
            });
    }

    getdata_vat(req, res) {
        const company_id = req.body.company_id;
        const branch_id = req.body.branch_id;
        pool.query(`SELECT * FROM "master_data_all"."fn_select_vat_group"(${branch_id});`,
            (err, result) => {
                if (err) {
                    throw err;
                }
                res.json(result.rows);
            });
    }

    getdata_vat_data(req, res) {
        const company_id = req.body.company_id;
        const branch_id = req.body.branch_id;
        pool.query(`SELECT x.master_vat_group_id,
                           x.master_vat_group_name,
                           x.master_vat_type_id,
                           x.master_vat_rate,
                           z.master_vat_type_name
                    FROM "master_data_all"."master_vat_group" x
                    LEFT JOIN master_data_all.master_vat_type z ON x.master_vat_type_id = z.master_vat_type_id
                    WHERE x.master_vat_type_id = 2`,
            (err, result) => {
                if (err) {
                    throw err;
                }
                res.json(result.rows);
            });
    }

    getsalehd_discount(req, res) {
        const company_id = req.body.company_id;
        const branch_id = req.body.branch_id;
        pool.query(`SELECT * FROM "saledata"."fn_select_discount_type"(${company_id},${branch_id})`,
            (err, result) => {
                if (err) {
                    throw err;
                }
                res.json(result.rows);
            });
    }

    getdata_customer_default(req, res) {
        const company_id = req.body.company_id;
        pool.query(`SELECT * FROM "master_data"."fn_select_arcustomer_default"(${company_id}) x`,
            (err, result) => {
                if (err) {
                    throw err;
                }
                res.json(result.rows);
            });
    }

    getservice_charge(req, res) {
        const company_id = req.body.company_id;
        const branch_id = req.body.branch_id;
        pool.query(`SELECT * FROM master_data.master_branch as br
                            left join master_data_all.master_service_charge as sc
                            on br.master_service_charge_id = sc.master_service_charge_id
                            where br.master_company_id = ${company_id} and  br.master_branch_id = ${branch_id}`,
            (err, result) => {
                if (err) {
                    throw err;
                }
                res.json(result.rows);
            });
    }


    getservice_chargetakeaway(req, res) {
        const company_id = req.body.company_id;
        const branch_id = req.body.branch_id;
        pool.query(`SELECT * FROM master_data.master_branch as br
                            left join master_data_all.master_service_charge as sc
                            on br.master_service_charge_takeaway_id = sc.master_service_charge_id
                            where br.master_company_id = ${company_id} and  br.master_branch_id = ${branch_id}`,
            (err, result) => {
                if (err) {
                    throw err;
                }
                res.json(result.rows);
            });
    }

    getcustomer_points(req, res) {
        const company_id = req.body.company_id;
        const customer_id = req.body.customer_id;
        pool.query(`SELECT *
                        FROM "promotion"."fn_select_point_type"(${company_id}, ${customer_id}) ;`,
            (err, result) => {
                if (err) {
                    throw err;
                }
                res.json(result.rows);
            });
    }

    getcustomer_pointstransection(req, res) {
        const company_id = req.body.company_id;
        const customer_id = req.body.customer_id;
        const years = req.body.years;
        pool.query(`SELECT *
                        FROM promotion.fn_report_point_transection('${years}', ${company_id}, ${customer_id});`,
            (err, result) => {
                if (err) {
                    throw err;
                }
                res.json(result.rows);
            });
    }

    getbranch_rounding(req, res) {
        const company_id = req.body.company_id;
        const branch_id = req.body.branch_id;
        pool.query(`select * from master_data.master_branch as br
                    left join  master_data.master_rounding rd
                    on br.master_rounding_id = rd.master_rounding_id
                    where br.master_branch_id = ${branch_id} and br.master_company_id = ${company_id}
                    `,
            (err, result) => {
                if (err) {
                    throw err;
                }
                res.json(result.rows);
            });
    }

    get_document_code(req, res) {
        const company_id = req.body.company_id;
        const branch_id = req.body.branch_id;
        const doc_date = req.body.doc_date;
        const doc_type = req.body.doc_type;
        pool.query(`SELECT * FROM "saledata"."fn_generate_salehd_docuno"('${doc_date}' ,${company_id}, ${branch_id},${doc_type});
                    `,
            (err, result) => {
                if (err) {
                    throw err;
                }
                res.json(result.rows);
            
            });
    }

    update_orderstatus(req, res) {
        const order_id = req.body.order_id;
        const status = req.body.status;
        pool.query(`SELECT "saledata"."fn_update_orderhd_status_action"(${order_id}, ${status});`,
            (err, result) => {
                if (err) {
                    throw err;
                }
                res.json(result.rows);
            });
    }

    add_salehd_order(req, res) {
        const sale_hd = JSON.stringify(req.body.sale_hd);
        const sale_dt = JSON.stringify(req.body.sale_dt);
        const sale_cash = JSON.stringify(req.body.sale_cash);
        const transfer = JSON.stringify(req.body.transfer);
        const creditcard = JSON.stringify(req.body.creditcard);
        const partner = JSON.stringify(req.body.partner);
        const voucher = JSON.stringify(req.body.voucher);
        const salechange = JSON.stringify(req.body.salechange);
        const deposithd_ref = JSON.stringify(req.body.deposithd_ref);
        pool.query(`SELECT "saledata"."fn_insert_sale"('${sale_hd}', '${sale_dt}', '${sale_cash}', '${transfer}', '${creditcard}', '${partner}','${voucher}','${salechange}','${deposithd_ref}');`,
            (err, result) => {
                if (err) {
                    throw err;
                }
                res.json(result.rows);
        });
    }

    getPartner(req, res) {
        const company_id = req.body.company_id;
        pool.query(`SELECT *
                    FROM "master_data"."fn_select_partner"(${company_id});
                    `,
            (err, result) => {
                if (err) {
                    throw err;
                }
                res.json(result.rows);
            });
    }

    get_salePreview(req, res) {
        const sale_hd = JSON.stringify(req.body.sale_hd);
        const sale_dt = JSON.stringify(req.body.sale_dt);
        const sale_cash = JSON.stringify(req.body.sale_cash);
        const transfer = JSON.stringify(req.body.transfer);
        const creditcard = JSON.stringify(req.body.creditcard);
        const partner = JSON.stringify(req.body.partner);
        const voucher = JSON.stringify(req.body.voucher);
        const salechange = JSON.stringify(req.body.salechange);
        const salehd_id_main = req.body.salehd_id_main
        pool.query(`SELECT "saledata"."fn_insert_sale_preview"('${sale_hd}', '${sale_dt}', '${sale_cash}', '${transfer}', '${creditcard}', '${partner}','${voucher}','${salechange}',${salehd_id_main});`,
            (err, result) => {
                if (err) {
                    throw err;
                }
                res.json(result.rows);
            });
    }

    get_vouchercode(req, res) {
        const company_id = req.body.company_id;
        const branch_id = req.body.branch_id;
        pool.query(`select * from saledata.salevoucher
                    where master_company_id = ${company_id} and master_branch_id = ${branch_id}
                    `,
            (err, result) => {
                if (err) {
                    throw err;
                }
                res.json(result.rows);
            });
    }

   

    get_salehd_transections(req, res) {
        const company_id = req.body.company_id;
        const branch_id = req.body.branch_id;
        const doc_date = req.body.doc_date;
        const doc_type = req.body.doc_type;
        pool.query(`SELECT *
                    FROM "saledata"."fn_select_sale_transection"('${doc_date}', ${company_id}, ${branch_id},${doc_type}) ;
                    `,
            (err, result) => {
                if (err) {
                    throw err;
                }
                res.json(result.rows);
            });
    }

    get_salehd(req, res) {
        const salehd_id = req.body.salehd_id;
        pool.query(`SELECT *
                    FROM "saledata"."fn_select_salehd"(${salehd_id}) x;
                    `,
            (err, result) => {
                if (err) {
                    throw err;
                }
                res.json(result.rows);
            });
    }

    get_saledt(req, res) {
        const salehd_id = req.body.salehd_id;
        pool.query(`SELECT *
                    FROM "saledata"."fn_select_saledt"(${salehd_id}) x;
                    `,
            (err, result) => {
                if (err) {
                    throw err;
                }
                res.json(result.rows);
            });
    }

    get_salecash(req, res) {
        const salehd_id = req.body.salehd_id;
        pool.query(`SELECT x.salehd_id,
                    x.salecash_listno,
                    x.salecash_cashamnt,
                    x.salecash_netamnt,
                    x.master_currency_id,
                    x.master_currency_name,
                    x.master_currency_rate,
                    x.master_calculate_type_id
                    FROM "saledata"."fn_select_salecash"(${salehd_id}) x;
                    `,
            (err, result) => {
                if (err) {
                    throw err;
                }
                res.json(result.rows);
            });
    }

    get_salevoucher(req, res) {
        const salehd_id = req.body.salehd_id;
        pool.query(`SELECT x.salehd_id,
                    x.salevoucher_listno,
                    x.salehd_voucher_type_id,
                    x.salevoucher_netamnt,
                    x.salevoucher_docuno,
                    x.salevoucher_status_id,
                    x.salehd_voucher_type_name
                    FROM "saledata"."fn_select_salevoucher"(${salehd_id}) x;
                    `,
            (err, result) => {
                if (err) {
                    throw err;
                }
                res.json(result.rows);
            });
    }

    get_saletranfer(req, res) {
        const salehd_id = req.body.salehd_id;
        pool.query(`SELECT x.bank_booktransfer_id,
                        x.bank_booktransfer_ref_amnt,
                        x.bank_booktransfer_ref_employeemasterid,
                        x.bank_booktransfer_ref_listno,
                        x.bank_booktransfer_ref_bankbook_id,
                        x.bank_booktransfer_ref_bank_id,
                        x.cq_bankbook_name,
                        x.cq_bank_name,
                        x.cq_bankbook_no
                        FROM "saledata"."fn_select_saletransfer"(${salehd_id}) x;
                    `,
            (err, result) => {
                if (err) {
                    throw err;
                }
                res.json(result.rows);
            });
    }

    get_salecredit(req, res) {
        const salehd_id = req.body.salehd_id;
        pool.query(`SELECT x.cheq_cheqdata_rec_id,
                        x.cheq_cheqdata_rec_listno,
                        x.cheq_cheqdata_rec_docudate,
                        x.cheq_cheqdata_rec_cardno,
                        x.cheq_cheqdata_rec_amount,
                        x.cheq_cheqdata_rec_remark,
                        x.cheq_cheqdata_rec_cardtype_id,
                        x.cheq_cheqdata_rec_employeemasterid,
                        x.cheq_cheqdata_rec_bank_id,
                        x.arcustomer_id,
                        x.cheq_cheqdata_rec_bankfeeamnt,
                        x.cheq_cheqdata_rec_bankfeerate,
                        x.cheq_cheqdata_rec_netamount,
                        x.cheq_cheqdata_rec_bankbook_id,
                        x.cq_bankbook_no,
                        x.cq_bankbook_name,
                        x.cq_bank_name,
                        x.cq_cardtype_name
                        FROM "saledata"."fn_select_salecreditcard"(${salehd_id}) x;
                    `,
            (err, result) => {
                if (err) {
                    throw err;
                }
                res.json(result.rows);
            });
    }

    get_salepartner(req, res) {
        const salehd_id = req.body.salehd_id;
        pool.query(`SELECT x.salehd_id,
                    x.salepartner_listno,
                    x.master_partner_id,
                    x.salepartner_netamnt,
                    x.master_partner_name,
                    x.salepartner_remark
                    FROM "saledata"."fn_select_salepartner"(${salehd_id}) x;
                    `,
            (err, result) => {
                if (err) {
                    throw err;b 
                }
                res.json(result.rows);
            });
    }

    get_salechange(req, res) {
        const salehd_id = req.body.salehd_id;
        pool.query(`SELECT x.salehd_id,
                        x.salecash_listno,
                        x.salecash_cashamnt,
                        x.salecash_netamnt,
                        x.master_currency_id,
                        x.master_currency_name,
                        x.master_currency_rate,
                        x.master_calculate_type_id
                        FROM "saledata"."fn_select_salechange"(${salehd_id}) x;
                    `,
            (err, result) => {
                if (err) {
                    throw err;
                }
                res.json(result.rows);
            });
    }

    update_cancel_sale(req, res) {
        const salehd_id = req.body.salehd_id;
        const em_id = req.body.em_id;
        const reason_id = req.body.reason_id;
        pool.query(`SELECT "saledata"."fn_update_cancel_sale"(${salehd_id}, ${em_id},${reason_id});;
                    `,
            (err, result) => {
                if (err) {
                    throw err;
                }
                res.json(result.rows);
            });
    }
    get_cancel_reason(req, res) {
        const company_id = req.body.company_id;
        pool.query(`SELECT x.salehd_cancel_reason_id,
                    x.salehd_cancel_reason_name
                    FROM "saledata"."fn_select_cancel_reason"(${company_id}) x;
                    `,
            (err, result) => {
                if (err) {
                    throw err;
                }
                res.json(result.rows);
            });
    }

    get_check_option_menu(req, res) {
        const company_id = req.body.company_id;
        const menu_id = req.body.menu_id;
        pool.query(`SELECT "security"."fn_check_option_menu"(${company_id}, ${menu_id}); `,
            (err, result) => {
                if (err) {
                    throw err;
                }
                res.json(result.rows);
            });
    }

   
    get_data_call_employee(req, res) {
        const company_id = req.body.company_id;
        //console.log(company_id);
        pool.query(`SELECT x.*
                    from master_data.master_request x
                    where x.master_company_id = ${company_id} ;
                    `,
            (err, result) => {
                if (err) {
                    throw err;
                }
               
                res.json(result.rows);
            });
    }

    save_data_call_employee(req, res) {
        const callemp_name = req.body.callemp_name;
        const active = req.body.active;
        const company_id = req.body.company_id;
        
        pool.query(`INSERT INTO master_data.master_request(
                    master_request_name, 
                    master_request_active, 
                    master_company_id
                    )
                    VALUES 
                    (
                        '${callemp_name}', 
                        ${active}, 
                        ${company_id}
                    );
                     `, 
            (err, result)=>{
                if(err){
                    throw err;
                }
                res.json({message: 1}); 
            });
    }


    updateCallEmpData(req, res){
        const callemp_name = req.body.callemp_name;
        const callemp_id = req.body.callemp_id;
        const active = req.body.active;
        const company_id = req.body.company_id;
        pool.query(`update master_data.master_request
                    set master_request_name = '${callemp_name}',
                    master_request_active = ${active}
                     where master_request_id = ${callemp_id}
                     and master_company_id = ${company_id}
                     `, 
            (err, result)=>{
                if(err){
                    throw err;
                }
                res.json({message: 1}); 
            });
    }

    fetchCallEmpDataForEdit(req, res){
        const callemp_id = req.body.callemp_id;
        const company_id = req.body.company_id;
        pool.query(`SELECT master_request_id as id, 
                    master_request_name as name,
                    master_request_active, 
                    master_company_id
                    FROM master_data.master_request
                    Where master_request_id = ${callemp_id}
                    and master_company_id = ${company_id}
                     `, 
        (err, result)=>{
            if(err){
                throw err;
            }
            res.json(result.rows);
        });
    }

    get_data_move_order(req, res) {
        const company_id = req.body.company_id;
        pool.query(`SELECT x.*
                    from master_data.master_reason_move_order x
                    where x.master_company_id = ${company_id} ;
                    `,
            (err, result) => {
                if (err) {
                    throw err;
                }
                res.json(result.rows);
            });
    }

    save_data_move_order(req, res) {
        const moveorder_type = req.body.moveorder_type;
        const active = req.body.active;
        const company_id = req.body.company_id;
        pool.query(`INSERT INTO master_data.master_reason_move_order(
                    master_reason_move_order_name, 
                    master_reason_move_order_active, 
                    master_company_id
                    )
                    VALUES 
                    (
                        '${moveorder_type}', 
                        ${active}, 
                        ${company_id}
                    );
                     `, 
            (err, result)=>{
                if(err){
                    throw err;
                }
                res.json({message: 1}); 
            });
    }


    updateMoveOrderData(req, res){
        const moveorder_type = req.body.moveorder_type;
        const moveorder_type_id = req.body.moveorder_type_id;
        const active = req.body.active;
        const company_id = req.body.company_id;
        pool.query(`update master_data.master_reason_move_order 
                    set master_reason_move_order_name = '${moveorder_type}',
                    master_reason_move_order_active = ${active}
                     where master_reason_move_order_id = ${moveorder_type_id}
                     and master_company_id = ${company_id}
                     `, 
            (err, result)=>{
                if(err){
                    throw err;
                }
                res.json({message: 1}); 
            });
    }

    fetchMoveOrderDataForEdit(req, res){
        const moveorder_type_id = req.body.moveorder_type_id;
        const company_id = req.body.company_id;
        //console.log(moveorder_type_id);
        pool.query(`SELECT master_reason_move_order_id as id, 
                    master_reason_move_order_name as name,
                    master_reason_move_order_active, 
                    master_company_id
                    FROM master_data.master_reason_move_order
                    Where master_reason_move_order_id = ${moveorder_type_id}
                    and master_company_id = ${company_id}
                     `, 
        (err, result)=>{
            if(err){
                throw err;
            }
            res.json(result.rows);
        });
    }

    get_data_cancel_order(req, res) {
        const company_id = req.body.company_id;
        pool.query(`SELECT x.*
                    from master_data.master_reason_cancel_order x
                    where x.master_company_id = ${company_id} ;
                    `,
            (err, result) => {
                if (err) {
                    throw err;
                }
                res.json(result.rows);
            });
    }

    save_data_cancel_order(req, res) {
        const cancelorder_type = req.body.cancelorder_type;
        const active = req.body.active;
        const company_id = req.body.company_id;
        
        pool.query(`INSERT INTO master_data.master_reason_cancel_order(
                    master_reason_cancel_order_name, 
                    master_reason_cancel_order_active, 
                    master_company_id
                    )
                    VALUES 
                    (
                        '${cancelorder_type}', 
                        ${active}, 
                        ${company_id}
                    );
                     `, 
            (err, result)=>{
                if(err){
                    throw err;
                }
                res.json({message: 1}); 
            });
    }


    updateCancelOrderData(req, res){
        const cancelorder_type = req.body.cancelorder_type;
        const cancelorder_type_id = req.body.cancelorder_type_id;
        const active = req.body.active;
        const company_id = req.body.company_id;
        pool.query(`update master_data.master_reason_cancel_order 
                    set master_reason_cancel_order_name = '${cancelorder_type}',
                    master_reason_cancel_order_active = ${active}
                     where master_reason_cancel_order_id = ${cancelorder_type_id}
                     and master_company_id = ${company_id}
                     `, 
            (err, result)=>{
                if(err){
                    throw err;
                }
                res.json({message: 1}); 
            });
    }

    fetchCancelOrderDataForEdit(req, res){
        const cancelorder_type_id = req.body.cancelorder_type_id;
        const company_id = req.body.company_id;
        //console.log(moveorder_type_id);
        pool.query(`SELECT master_reason_cancel_order_id as id, 
                    master_reason_cancel_order_name as name,
                    master_reason_cancel_order_active, 
                    master_company_id
                    FROM master_data.master_reason_cancel_order
                    Where master_reason_cancel_order_id = ${cancelorder_type_id}
                    and master_company_id = ${company_id}
                     `, 
        (err, result)=>{
            if(err){
                throw err;
            }
            res.json(result.rows);
        });
    }

    get_data_move_table(req, res) {
        const company_id = req.body.company_id;
        pool.query(`SELECT x.*
                    from master_data.master_reason_move_table x
                    where x.master_company_id = ${company_id} ;
                    `,
            (err, result) => {
                if (err) {
                    throw err;
                }
                res.json(result.rows);
            });
    }

    save_data_move_table(req, res) {
        const movetable_name = req.body.movetable_name;
        const active = req.body.active;
        const company_id = req.body.company_id;
        
        pool.query(`INSERT INTO master_data.master_reason_move_table(
            master_reason_move_table_name, 
            master_reason_move_table_active, 
                    master_company_id
                    )
                    VALUES 
                    (
                        '${movetable_name}', 
                        ${active}, 
                        ${company_id}
                    );
                     `, 
            (err, result)=>{
                if(err){
                    throw err;
                }
                res.json({message: 1}); 
            });
    }


    updateMoveTableData(req, res){
        const movetable_name = req.body.movetable_name;
        const movetable_id = req.body.movetable_id;
        const active = req.body.active;
        const company_id = req.body.company_id;
        pool.query(`update master_data.master_reason_move_table 
                    set master_reason_move_table_name = '${movetable_name}',
                    master_reason_move_table_active = ${active}
                     where master_reason_move_table_id = ${movetable_id}
                     and master_company_id = ${company_id}
                     `, 
            (err, result)=>{
                if(err){
                    throw err;
                }
                res.json({message: 1}); 
            });
    }

    fetchMoveTableDataForEdit(req, res){
        const movetable_id = req.body.movetable_id;
        const company_id = req.body.company_id;
        //console.log(movetable_id);
        pool.query(`SELECT master_reason_move_table_id as id, 
                    master_reason_move_table_name as name,
                    master_reason_move_table_active, 
                    master_company_id
                    FROM master_data.master_reason_move_table
                    Where master_reason_move_table_id = ${movetable_id}
                    and master_company_id = ${company_id}
                     `, 
        (err, result)=>{
            if(err){
                throw err;
            }
            res.json(result.rows);
        });
    }

   

   

    add_point_type_data(req, res) {
        const master_company_id = req.body.master_company_id;
        const point_type_name = req.body.point_type_name;
        const point_type_rate = req.body.point_type_rate;
        const point_type_active = req.body.point_type_active;
        const arcustomer_member_type_id = req.body.arcustomer_member_type_id;
        pool.query(`INSERT INTO "promotion"."point_type"
                    (
                        master_company_id,
                        point_type_name,
                        point_type_rate,
                        point_type_active,
                        arcustomer_member_type_id
                    )
             values (
                        ${master_company_id},
                       '${point_type_name}',
                        ${point_type_rate},
                        ${point_type_active},
                        ${arcustomer_member_type_id}
                   )`,
            (err, result) => {
                if (err) {
                    throw err;
                }
                res.json(result.rows);
            });
    }

    

    get_memberstype_data(req, res) {
        const company_id = req.body.company_id;
        pool.query(`SELECT * FROM "master_data"."master_member_type" 
                    where master_company_id = ${company_id}
                    and member_type_active = true`,
            (err, result) => {
                if (err) {
                    throw err;
                }
                res.json(result.rows);
            });
    }

   
    
    get_promotion_point_data_edit(req, res) {
        const promotion_point_type_id = req.body.promotion_point_type_id;
        pool.query(`SELECT * FROM promotion.promotion_point_type
                    where promotion_point_type_id = ${promotion_point_type_id}`,
            (err, result) => {
                if (err) {
                    throw err;
                }
                res.json(result.rows);
            });
    }

    update_promotion_point_data(req, res) {
        const promotion_point_type_name = req.body.promotion_point_type_name;
        const promotion_point_type_quantity = req.body.promotion_point_type_quantity;
        const promotion_point_type_rate = req.body.promotion_point_type_rate;
        const promotion_point_type_active = req.body.promotion_point_type_active;
        const promotion_point_type_datebegin = req.body.promotion_point_type_datebegin;
        const promotion_point_type_dateend = req.body.promotion_point_type_dateend;
        const promotion_point_type_id = req.body.promotion_point_type_id;
        const promotion_point_cal_type_id = req.body.promotion_point_cal_type_id;
        pool.query(`update promotion.promotion_point_type
                 set promotion_point_type_name =   '${promotion_point_type_name}',
                     promotion_point_type_quantity = ${promotion_point_type_quantity} ,
                     promotion_point_type_rate = ${promotion_point_type_rate},
                     promotion_point_type_active = ${promotion_point_type_active},
                     promotion_point_type_datebegin = '${promotion_point_type_datebegin}',
                     promotion_point_type_dateend = '${promotion_point_type_dateend}',
                     promotion_point_cal_type_id = ${promotion_point_cal_type_id}
               where promotion_point_type_id  = ${promotion_point_type_id}`,
            (err, result) => {
                if (err) {
                    throw err;
                }
                res.json(result.rows);
            });
    }

    get_point_cal_type_data(req, res) {
        pool.query(`SELECT * FROM promotion.promotion_point_cal_type`,
            (err, result) => {
                if (err) {
                    throw err;
                }
                res.json(result.rows);
            });
    }

    get_pointcus_report(req, res) {
        const company_id = req.body.company_id;
        const years = req.body.years;
        const dates = req.body.dates;
        pool.query(`SELECT x.arcustomer_id,
                    x.arcustomer_code,
                    x.arcustomer_name,
                    x.arcustomer_addr_tel,
                    x.point_receive,
                    x.point_spend,
                    x.point_remain,
                    x.salehd_docudate
                    FROM saledata.fn_report_sale_remaining_points(${company_id}, '${years}', '${dates}') x;`,
            (err, result) => {
                if (err) {
                    throw err;
                }
                res.json(result.rows);
            });
    }

    get_discount_type_for_report(req, res) {
        const company_id = req.body.company_id;
        const start_date = req.body.start_date;
        const end_date = req.body.end_date;
        pool.query(`SELECT x.salehd_discount_type_id,
                    x.salehd_discount_type_name
                    FROM "saledata"."fn_select_discount_type_for_report"(${company_id}, '${start_date}', '${end_date}') x;`,
            (err, result) => {
                if (err) {
                    throw err;
                }
                res.json(result.rows);
            });
    }

    get_salediscounttype(req, res) {
        pool.query(`SELECT x.salediscounttype_id,
                    x.salediscounttype_name
                    FROM "saledata"."salediscounttype" x;`,
            (err, result) => {
                if (err) {
                    throw err;
                }
                res.json(result.rows);
            });
    }

    get_report_discount(req, res) {
        const company_id = req.body.company_id;
        const branch_id = req.body.branch_id;
        const start_date = req.body.start_date;
        const end_date = req.body.end_date;
        const discount_id = req.body.discount_id;
        const discounttype_id = req.body.discounttype_id;
        pool.query(`SELECT  x.salediscounttype_id,
                            x.salediscounttype_name,
                            x.salehd_discount_type_id,
                            x.salehd_discount_type_name,
                            x.master_branch_code,
                            x.master_branch_name,
                            x.salehd_docudate,
                            x.salehd_docuno,
                            x.salehd_arcustomer_name,
                            x.salehd_sumgoodamnt,
                            x.salehd_discountamnt,
                            x.salehd_service_chargeamnt,
                            x.salehd_baseamnt,
                            x.salehd_vatamnt,
                            x.salehd_netamnt,
                            x.salehd_employee_save,
                            x.salehd_savetime
                FROM "saledata"."fn_report_discount"(${company_id}, array[${branch_id}], '${start_date}', '${end_date}', array[${discount_id}],  array[${discounttype_id}]) x;`,
            (err, result) => {
                if (err) {
                    throw err;
                }
                res.json(result.rows);
            });
    }

    filter_product(req, res) {
        const company_id = req.body.company_id;
        const branch_id = req.body.branch_id;
        const text = req.body.text;
        pool.query(`select * from master_data.fn_select_product(${company_id}, ${branch_id}, '${text}')`,
            (err, results) => {
                if (err) {
                    throw err;
                }
            res.status(200).json(results.rows);
        });
    }

    report_ReceivebyVoucher(req, res){
        const company_id = req.body.company_id;
        const branch_id = req.body.branch_id;
        const salehd_voucher_type_id = req.body.salehd_voucher_type_id;
        const start_date = req.body.start_date;
        const end_date = req.body.end_date;
        poolPOSDB.query(`SELECT x.listno,
                            x.master_branch_code,
                            x.master_branch_name,
                            x.salehd_docudate,
                            x.salehd_docuno,
                            x.salehd_voucher_type_name,
                            x.salevoucher_docuno,
                            x.voucher_totalamnt,
                            x.fullname
                        FROM saledata.fn_report_receiveby_voucher(${company_id}, ARRAY[${branch_id}], '${start_date}', '${end_date}', ARRAY[${salehd_voucher_type_id}]) x;`,
            (err, results) => {
                if (err) {
                    throw err;
                }
                res.status(200).json(results.rows);
            });
    }

    get_deposit_sale(req, res) {
        const customer_id = req.body.customer_id;
        const company_id = req.body.company_id;
        const branch_id = req.body.branch_id;
        pool.query(`select hd.deposithd_id,hd.deposithd_docuno,hd.deposithd_docudate,
                        hd.deposithd_netamnt,hd.deposithd_discountamnt,hd.deposithd_balance_amnt
                        from saledata.deposithd as hd
                        where hd.deposithd_arcustomerid = ${customer_id}
                        and hd.master_company_id = ${company_id}
                        and hd.master_branch_id = ${branch_id}
                        and hd.deposithd_balance_amnt > 0
                        and hd.deposithd_status_id = 1
						or hd.deposithd_status_id = 2`,
            (err, results) => {
                if (err) {
                    throw err;
                }
                res.status(200).json(results.rows);
            });
    }

    get_deposit_sale_doc(req, res) {
        const salehd_id = req.body.salehd_id;
        pool.query(`SELECT  * FROM "saledata"."fn_select_deposithd_ref"(${salehd_id}) x;`,
            (err, results) => {
                if (err) {
                    throw err;
                }
                res.status(200).json(results.rows);
            });
    }

    get_filter_salehd(req, res) {
        const company_id = req.body.company_id;
        const branch_id = req.body.branch_id;
        const textfilter = req.body.textfilter; 
        const doc_type = req.body.doc_type;
        pool.query(`select * from saledata.fn_select_salehd_filter(${company_id},${branch_id},${doc_type},'${textfilter}')`,
            (err, results) => {
                if (err) {
                    throw err;
                }
                res.status(200).json(results.rows);
            });
    }

    get_returnproducthd_docuno(req, res) {
        const doc_date = req.body.doc_date;
        const company_id = req.body.company_id;
        const branch_id = req.body.branch_id;
        const doc_type = req.body.doc_type;
        pool.query(`SELECT * FROM "saledata"."fn_generate_returnproducthd_docuno"('${doc_date}', ${company_id}, ${branch_id}, ${doc_type});`,
            (err, results) => {
                if (err) {
                    throw err;
                }
                res.status(200).json(results.rows);
            });
    }

    get_returnproducthd_reason(req, res) {
        const company_id = req.body.company_id;
        pool.query(`SELECT * FROM "saledata"."returnproducthd_reason"
                    WHERE master_company_id = ${company_id}
                    and  returnproducthd_reason_active = true`,
            (err, results) => {
                if (err) {
                    throw err;
                }
                res.status(200).json(results.rows);
            });
    }

    save_returnproduct(req, res) {
        const returnproducthd = JSON.stringify(req.body.returnproducthd);
        const returnproductdt = JSON.stringify(req.body.returnproductdt);
        const transfer = JSON.stringify(req.body.transfer);
        const creditcard = JSON.stringify(req.body.creditcard);
        pool.query(`SELECT "saledata"."fn_insert_returnproduct"('${returnproducthd}','${returnproductdt}','${transfer}','${creditcard}');`,
            (err, results) => {
                if (err) {
                    throw err;
                }
                res.status(200).json(results.rows);
            });
    }

    get_saledt_remaining(req, res) {
        const salehd_id = req.body.salehd_id;
        pool.query(`SELECT *  FROM "saledata"."fn_select_saledt_remaining"(${salehd_id}) x;`,
            (err, results) => {
                if (err) {
                    throw err;
                }
                res.status(200).json(results.rows);
            });
    }

    getsalehd_return(req, res) {
        const salehd_id = req.body.salehd_id;
        pool.query(`SELECT *  FROM "saledata"."fn_select_saledt_remaining"(${salehd_id}) x;`,
            (err, results) => {
                if (err) {
                    throw err;
                }
                res.status(200).json(results.rows);
            });
    }

    getdata_roinding(req, res) {
        const company_id = req.body.company_id;
        const branch_id = req.body.branch_id;
        pool.query(`SELECT x.master_rounding_id
                    from master_data.master_branch x
                    WHERE x.master_branch_id = ${branch_id}
                    AND x.master_company_id = ${company_id}`,
            (err, result) => {
                if (err) {
                    throw err;
                }
                res.json(result.rows);
            });
    }

    get_product_barcode_for_sale_order(req, res) {
        const company_id = req.body.company_id;
        const branch_id = req.body.branch_id;
        const barcode = req.body.barcode;
        pool.query(`select * from master_data.fn_select_product_sale_order(${company_id}, ${branch_id}, '${barcode}')`,
            (err, results) => {
                if (err) {
                    throw err;
                }
            res.status(200).json(results.rows);
        });
    }

    getSaleOrderDetail(req, res) {
        const {company_id, branch_id, orderh_id} = req.body;
        pool.query(`select * from saledata.fn_get_sale_order_detail($1, $2, array[${orderh_id}])`,
            [company_id, branch_id],
            (err, results) => {
                if (err) {
                    throw err;
                }
            res.status(200).json(results.rows);
        });
    }
}


module.exports = modelSale;