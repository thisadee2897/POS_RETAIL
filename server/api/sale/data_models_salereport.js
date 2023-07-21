const poolPOSDB = require('../../connectdb');

class modelSaleReport
{
    report_salevat(req, res) 
    {
        const master_company_id = req.body.company_id;
        const master_branch_id = req.body.branch_id;
        const start_date = req.body.start_date;
        const end_date = req.body.end_date;
        poolPOSDB.query(`
                    SELECT 
                    x.vat_postt_sale_id, 
                    x.vat_postt_sale_docuno, 
                    x.vat_postt_sale_docudate::text, 
                    x.vat_postt_sale_savetime::text, 
                    x.vat_postt_sale_invoiceno, 
                    x.vat_postt_sale_invoicedate::text as vat_postt_sale_invoicedate, 
                    x.vat_postt_sale_baseamnt, 
                    x.vat_postt_sale_vatamnt,
                    x.vat_postt_sale_sumamnt, 
                    x.vat_postt_sale_totalexcludeamnt, 
                    x.vat_postt_sale_remark, 
                    x.vat_postt_sale_arcustomer_name, 
                    x.vat_postt_sale_arcustomer_taxid,  
                    x.arcustomer_branch_number::text
                    FROM account.fn_report_vat_postt_sale_all('${start_date}', '${end_date}', ${master_company_id}, array[${master_branch_id}]) x; `,
            (err, results) => {
                if (err) 
                {
                    throw err;
                }
                res.status(200).json(results.rows);
            });
    }

    report_SaleSumdaily(req, res) 
    {
        const master_company_id = req.body.company_id;
        const master_branch_id = req.body.branch_id;
        const start_date = req.body.start_date;
        const end_date = req.body.end_date;
        poolPOSDB.query(`SELECT 
                            x.master_branch_code,
                            x.master_branch_name,
                            x.salehd_docudate::text,
                            x.salehd_billamnt,
                            x.salehd_customeramnt,
                            x.salehd_sumgoodamnt,
                            x.salehd_service_chargeamnt,
                            x.salehd_discountamnt,
                            x.salehd_vatamnt,
                            x.salehd_netamnt,
                            x.salehd_cashamnt,
                            x.salehd_transferamnt,
                            x.salehd_creditcardamnt,
                            x.salehd_voucheramnt,
                            x.salehd_partneramnt,
                            x.salehd_tipamnt
                    FROM saledata.fn_report_sales_summary_today(${master_company_id}, array[${master_branch_id}],'${start_date}', '${end_date}') x; `,
            (err, results) => {
                if (err) {
                    throw err;
                }
                res.status(200).json(results.rows);
            });
    }


    report_SumProduct(req, res) 
    {
        const master_company_id = req.body.company_id;
        const master_branch_id = req.body.branch_id;
        const start_date = req.body.start_date;
        const end_date = req.body.end_date;
        poolPOSDB.query(`SELECT 
                        x.product_code, 
                        x.product_name, 
                        x.product_quantity, 
                        x.product_netamnt, 
                        x.product_unitname, 
                        x.master_docutype_id, 
                        x.master_docutype_name, 
                        x.master_branch_code, 
                        x.master_branch_name 
                    FROM saledata.fn_report_sale_sumproduct('${start_date}', '${end_date}', ${master_company_id}, array[${master_branch_id}]) x; `,
            (err, results) => {
                if (err) {
                    throw err;
                }
                res.status(200).json(results.rows);
            });
    }

    report_CancelBill(req, res) 
    {
        const master_company_id = req.body.company_id;
        const master_branch_id = req.body.branch_id;
        const start_date = req.body.start_date;
        const end_date = req.body.end_date;
        poolPOSDB.query(`SELECT x.listno,
                            x.master_branch_code,
                            x.master_branch_name,
                            x.salehd_docudate::text,
                            x.salehd_savetime::text,
                            x.salehd_docuno,
                            x.salehd_arcustomer_name,
                            x.salehd_sumgoodamnt,
                            x.salehd_discountamnt,
                            x.salehd_baseamnt,
                            x.salehd_vatamnt,
                            x.salehd_netamnt,
                            x.salehd_employee_save,
                            x.salehd_employee_cancel,
                            x.salehd_employee_cancel_time::text,
                            x.salehd_cancel_reason_name
                    FROM saledata.fn_report_salehd_cancel_bill('${start_date}', '${end_date}', ${master_company_id}, array[${master_branch_id}]) x; `,
            (err, results) => {
                if (err) {
                    throw err;
                }
                res.status(200).json(results.rows);
            });
    }



    get_MasterPartner(req, res) 
    {
        const master_company_id = req.body.company_id;
        const master_branch_id = req.body.branch_id;
        const start_date = req.body.start_date;
        const end_date = req.body.end_date;
        poolPOSDB.query(`SELECT x.master_partner_id,
                            x.master_partner_name,
                            x.master_partner_flag,
                            x.master_partner_check
                        FROM master_data.fn_select_partner(${master_company_id}) x;`,
            (err, results) => {
                if (err) {
                    throw err;
                }
                res.status(200).json(results.rows);
            });
    }

    report_ReceivebyPartner(req, res) 
    {
        const company_id = req.body.company_id;
        const branch_id = req.body.branch_id;
        const partner_type_id = req.body.partner_type_id;
        const start_date = req.body.start_date;
        const end_date = req.body.end_date;
        poolPOSDB.query(`SELECT x.listno,
                        x.master_branch_code,
                        x.master_branch_name,
                        x.salehd_docudate,
                        x.salehd_docuno,
                        x.master_partner_name,
                        x.salepartner_remark,
                        x.partner_totalamnt,
                        x.fullname
                        FROM saledata.fn_report_receiveby_partner(${company_id}, ARRAY[${branch_id}], '${start_date}', '${end_date}', ARRAY[${partner_type_id}]) x;`,
            (err, results) => {
                if (err) {
                    throw err;
                }
                res.status(200).json(results.rows);
            });
    }


    get_MasterVoucher(req, res) 
    {
        const master_company_id = req.body.company_id;
        const master_branch_id = req.body.branch_id;
        const start_date = req.body.start_date;
        const end_date = req.body.end_date;
        poolPOSDB.query(`SELECT x.salehd_voucher_type_id,
                        x.salehd_voucher_type_name,
                        x.salehd_voucher_type_flag,
                        x.salehd_voucher_type_check
                        FROM master_data.fn_select_master_voucher(${master_company_id}) x;`,
            (err, results) => {
                if (err) {
                    throw err;
                }
                res.status(200).json(results.rows);
            });
    }




    report_ReceivebyPartner(req, res) 
    {
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


    report_SumProductDetail(req, res) 
    {
        const master_company_id = req.body.company_id;
        const master_branch_id = req.body.branch_id;
        const start_date = req.body.start_date;
        const end_date = req.body.end_date;
        poolPOSDB.query(`SELECT 
                            x.master_branch_id,
                            x.master_branch_code,
                            x.master_branch_prefix,
                            x.master_branch_name,
                            x.master_product_group_id,
                            x.master_product_group_name,
                            x.master_product_code,
                            x.master_product_name,
                            x.saledt_qty,
                            x.master_product_unit_name,
                            x.product_baseamnt,
                            x.product_netamnt,
                            x.product_vat 
                    FROM saledata.fn_report_saledata_by_product_v1('${start_date}', '${end_date}',array[${master_branch_id}], ${master_company_id}) x; `,
            (err, results) => {
                if (err) {
                    throw err;
                }
                res.status(200).json(results.rows);
            });
    }

    report_SumProductGroup(req, res) 
    {
        const master_company_id = req.body.company_id;
        const master_branch_id = req.body.branch_id;
        const start_date = req.body.start_date;
        const end_date = req.body.end_date;
        poolPOSDB.query(`SELECT 
                            x.master_branch_id,
                            x.master_branch_code,
                            x.master_branch_name,
                            x.master_product_group_id,
                            x.master_product_group_name,
                            x.master_product_code,
                            x.master_product_name,
                            x.saledt_qty,
                            x.master_product_unit_name,
                            x.product_baseamnt,
                            x.product_netamnt,
                            x.product_vat 
                    FROM saledata.fn_report_saledata_by_group_product('${start_date}', '${end_date}',array[${master_branch_id}], ${master_company_id}) x; `,
            (err, results) => {
                if (err) {
                    throw err;
                }
                res.status(200).json(results.rows);
            });
    }

    report_SumAmountByTablePerBill(req, res) 
    {
        const master_company_id = req.body.company_id;
        const master_branch_id = req.body.branch_id;
        const start_date = req.body.start_date;
        const end_date = req.body.end_date;
        poolPOSDB.query(`SELECT 
                        x.master_branch_id,
                        x.master_branch_code,
                        x.master_branch_name,
                        (x.salehd_docudate::date)::text as salehd_docudate,
                        x.salehd_netamnt,
                        x.c_billsale,
                        x.avg_amnt_bill
                    FROM saledata.fn_report_sale_amountaverage_bytable_v1('${start_date}', '${end_date}',array[${master_branch_id}], ${master_company_id}) x; `,
            (err, results) => {
                if (err) {
                    throw err;
                }
                res.status(200).json(results.rows);
            });
    }

    report_SumByTable(req, res) 
    {
        const master_company_id = req.body.company_id;
        const master_branch_id = req.body.branch_id;
        const start_date = req.body.start_date;
        const end_date = req.body.end_date;
        poolPOSDB.query(`select 
                            x.master_order_table_id, 
                            x.master_table_code,
                            x.master_table_name,
                            x.master_company_id,
                            x.master_branch_id,
                            x.master_branch_code,
                            x.master_branch_name,
                            x.orderhd_customer_quantity,
                            x.salehd_baseamnt,
                            x.salehd_vatamnt,
                            x.salehd_sumgoodamnt,
                            x.salehd_discountamnt,
                            x.salehd_netamnt,
                            x.salehd_cashamnt,
                            x.salehd_transferamnt,
                            x.salehd_creditcardamnt,
                            x.salehd_depositamnt,
                            x.salehd_chequeamnt,
                            x.saledt_netamnt
                            from saledata.fn_report_saledata_by_table_summarize('${start_date}', '${end_date}',array[${master_branch_id}], ${master_company_id}) x; `,
            (err, results) => {
                if (err) {
                    throw err;
                }
                res.status(200).json(results.rows);
            });
    }


    report_CountCusByTable(req, res) 
    {
        const master_company_id = req.body.company_id;
        const master_branch_id = req.body.branch_id;
        const start_date = req.body.start_date;
        const end_date = req.body.end_date;
        poolPOSDB.query(`select 
                        x.master_order_table_id,
                        x.master_table_code,
                        x.master_table_name,
                        x.master_branch_id,
                        x.master_branch_code,
                        x.master_branch_name,
                            x.orderhd_customer_quantity
                        from saledata.fn_report_count_customer_by_table_v1('20220101', now()::date, array[11], 1) x; `,
            (err, results) => {
                if (err) {
                    throw err;
                }
                res.status(200).json(results.rows);
            });
    }

    
}
//('${start_date}', '${end_date}',array[${master_branch_id}], ${master_company_id}) x
module.exports = modelSaleReport;