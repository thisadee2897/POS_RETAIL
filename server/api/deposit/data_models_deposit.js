const pool = require('../../connectdb.js');

class modelDeposit{
  
    get_product_deposit(req, res) {
        let company_id = req.body.company_id;
        pool.query(`select
                    x.master_product_id,   -- Product ID
                    x.master_product_code, -- Product Code
                    x.master_product_name_bill,  -- Product Name
                    x.master_vat_group_id,  -- Vat ID
                    x.acc_account_id,   -- Account ID
                    x.vat_activeflag,   -- Vat Flag
                    x.master_product_barcode_id,  -- Barcode ID
                    x.barcode,   -- Barcode
                    x.master_product_barcode_unitid,  -- Unit ID
                    x.master_product_barcode_unitname, -- Unit Name
                    x.master_product_invoice_id,   -- Invoice ID
                    x.master_product_invoice_name, -- Invoice Name
                    x.master_product_invoice_code  -- Invoice Code
                    from master_data.fn_select_master_product_for_deposit(${company_id}) x`,
            (err, result) => {
                if (err) {
                    throw err;
                }
                res.json(result.rows);
            });
    }

    get_deposit_codeDoc(req, res) {
        let company_id = req.body.company_id;
        let branch_id = req.body.branch_id;
        let doc_date = req.body.doc_date;
        pool.query(`SELECT "saledata"."fn_generate_deposithd_docuno"('${doc_date}',${company_id}, ${branch_id})`,
            (err, result) => {
                if (err) {
                    throw err;
                }
                res.json(result.rows);
            });
    }
    add_deposit(req, res) {
        let deposithd = JSON.stringify(req.body.depositHD);
        let depositdt = JSON.stringify(req.body.depositDT);
        let transfer =  JSON.stringify(req.body.transfer);
        let creditcard = JSON.stringify(req.body.creditcard);
        pool.query(`select saledata.fn_insert_deposit('${deposithd}', '${depositdt}', '${transfer}', '${creditcard}')`,
            (err, result) => {
                if (err) {
                    throw err;
                }
                res.json(result.rows);

            });
    }

    get_deposit_transections(req, res) {
        let company_id = req.body.company_id;
        let branch_id = req.body.branch_id;
        let start_date = req.body.start_date;
        let end_date = req.body.end_date;
        pool.query(`SELECT x.deposithd_id,
                        x.deposithd_docudate,
                        x.deposithd_docuno,
                        x.deposithd_status_name,
                        x.deposithd_status_id,
                        x.deposithd_arcustomer_name,
                        x.deposithd_netamnt,
                        x.deposithd_balance_amnt,
                        x.save_time
        FROM "saledata"."fn_select_deposit_transection"('${start_date}', '${end_date}', ${company_id}, ${branch_id}) x`,
            (err, result) => {
                if (err) {
                    throw err;
                }
                res.json(result.rows);
            });
    }

    cancel_deposit_document(req, res) {
        let depositHD_id = req.body.depositHD_id;
        let employee_id = req.body.employee_id;
        pool.query(`SELECT "saledata"."fn_update_cancel_deposit"(${depositHD_id}, ${employee_id})`,
            (err, result) => {
                if (err) {
                    throw err;
                }
                res.json(result.rows);
            });
    }

    get_depositHD(req, res) {
        let depositHD_id = req.body.depositHD_id;
        pool.query(`SELECT x.deposithd_id,
                        x.deposithd_docudate,
                        x.deposithd_docuno,
                        x.deposithd_status_id,
                        x.deposithd_empemployeemasterid,
                        x.deposithd_arcustomerid,
                        x.deposithd_arcustomer_name,
                        x.deposithd_arcustomer_taxid,
                        x.deposithd_arcustomer_addr,
                        x.deposithd_arcustomer_addr_district_id,
                        x.deposithd_arcustomer_addr_prefecture_id,
                        x.deposithd_arcustomer_addr_province_id,
                        x.deposithd_arcustomer_addr_postcode_id,
                        x.deposithd_remark,
                        x.deposithd_vatgroup_id,
                        x.deposithd_vatrate,
                        x.deposithd_totalexcludeamnt,
                        x.deposithd_totalincludeamnt,
                        x.deposithd_totalincludeamnt_afterdepositamnt,
                        x.deposithd_baseamnt,
                        x.deposithd_vatamnt,
                        x.deposithd_sumgoodamnt,
                        x.deposithd_discountamnt,
                        x.deposithd_netamnt,
                        x.deposithd_cashamnt,
                        x.deposithd_transferamnt,
                        x.deposithd_creditcardamnt,
                        x.master_branch_id,
                        x.master_company_id,
                        x.deposithd_balance_amnt,
                        x.deposithd_dateused,
                        x.deposithd_feeamnt,
                        x.master_vat_group_name
                        FROM "saledata"."fn_select_deposithd"(${depositHD_id}) x;`,
            (err, result) => {
                if (err) {
                    throw err;
                }
                res.json(result.rows);
            });
    }

    get_depositDT(req, res) {
        let depositHD_id = req.body.depositHD_id;
        pool.query(`SELECT x.depositdt_id,
                        x.deposithd_id,
                        x.depositdt_listno,
                        x.depositdt_master_product_id,
                        x.depositdt_master_product_billname,
                        x.depositdt_master_product_barcode_id,
                        x.depositdt_master_product_barcode_unit_id,
                        x.depositdt_qty,
                        x.depositdt_saleprice,
                        x.depositdt_discount_amnt,
                        x.depositdt_netamnt,
                        x.depositdt_barcode,
                        x.depositdt_vatflag,
                        x.depositdt_master_product_barcode_unitname,
                        x.depositdt_acc_account_id,
                        x.depositdt_master_product_invoice_id,
                        x.depositdt_master_product_invoice_name,
                        x.depositdt_master_product_invoice_code
                     FROM "saledata"."fn_select_depositdt"(${depositHD_id}) x;`,
            (err, result) => {
                if (err) {
                    throw err;
                }
                res.json(result.rows);
            });
    }

    get_deposittransfer(req, res) {
        let depositHD_id = req.body.depositHD_id;
        pool.query(`SELECT  x.bank_booktransfer_id,
                            x.bank_booktransfer_ref_amnt,
                            x.bank_booktransfer_ref_employeemasterid,
                            x.bank_booktransfer_ref_listno,
                            x.bank_booktransfer_ref_bankbook_id,
                            x.bank_booktransfer_ref_bank_id,
                            x.cq_bankbook_name,
                            x.cq_bank_name,
                            x.cq_bankbook_no
                    FROM "saledata"."fn_select_deposittransfer"(${depositHD_id}) x;`,
            (err, result) => {
                if (err) {
                    throw err;
                }
                res.json(result.rows);
            });
    }

    get_depositcreditcard(req, res) {
        let depositHD_id = req.body.depositHD_id;
        pool.query(`SELECT  x.cheq_cheqdata_rec_id,
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
                     FROM "saledata"."fn_select_depositcreditcard"(${depositHD_id}) x;`,
            (err, result) => {
                if (err) {
                    throw err;
                }
                res.json(result.rows);
            });
    }

    update_deposit_print_bill(req, res) {
        let depositHD_id = req.body.depositHD_id;
        pool.query(`SELECT "saledata"."fn_update_deposit_print_bill"(${depositHD_id});`,
            (err, result) => {
                if (err) {
                    throw err;
                }
                res.json(result.rows);
            });
    }

    add_print_deposit(req, res) {
        let depositHD_id = req.body.depositHD_id;
        pool.query(`SELECT "saledata"."fn_update_deposit_print_bill"(${depositHD_id});`,
            (err, result) => {
                if (err) {
                    throw err;
                }
                res.json(result.rows);
            });
    }

 
}

module.exports = modelDeposit;