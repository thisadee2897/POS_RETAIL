const pool = require('../../connectdb.js');
const fs = require('fs-extra');
class ModelProduct {

    getSetHDData(req, res) {
        const company_id = req.body.company_id;
        const branch_id = req.body.branch_id;
        pool.query(`SELECT * FROM promotion.fn_select_set_hd_data(${company_id},${branch_id})`,
            (err, results) => {
                if (err) {
                    throw err;
                }
                res.json(results.rows);
            });
    }

    getSetHdDocument(req, res) {
        const company_id = req.body.company_id;
        pool.query(`SELECT * FROM "promotion"."fn_app_create_product_set_docuno"(${company_id})`,
            (err, results) => {
                if (err) {
                    throw err;
                }
                res.json(results.rows);
            });
    }

    addProductSetData(req, res) {
        const company_id = req.body.company_id;
        const branch_id = req.body.branch_id;
        const employee_id = req.body.employee_id;
        const set_hd_active = req.body.set_hd_active;
        const set_hd_name = req.body.set_hd_name;
        const set_hd_remark = req.body.set_hd_remark;
        const product_set_dt = JSON.stringify(req.body.product_set_dt);
        pool.query(`SELECT promotion.fn_app_insert_product_set_data(${company_id}, ${branch_id}, ${employee_id}, '${set_hd_remark}', '${set_hd_name}', ${set_hd_active}, '${product_set_dt}');
                     `,
            (err, result) => {
                if (err) {
                    throw err;
                }
                res.json({ message: 1 });
            });
    }

    updateProductSetData(req, res) {
        const set_hd_id = req.body.set_hd_id;
        const set_hd_active = req.body.set_hd_active;
        const set_hd_name = req.body.set_hd_name;
        const set_hd_remark = req.body.set_hd_remark;
        const employee_id = req.body.employee_id;
        const product_set_dt = JSON.stringify(req.body.product_set_dt);
        pool.query(`SELECT promotion.fn_app_update_product_set_data( ${set_hd_id},'${set_hd_remark}',
                                  '${set_hd_name}',${set_hd_active},${employee_id},'${product_set_dt}')`,
            (err, result) => {
                if (err) {
                    throw err;
                }
                res.json({ message: 1 });
            });
    }

    getPromotionDocuno(req, res) {
        const company_id = req.body.company_id;
        const branch_id = req.body.branch_id;
        const promotion_setting_id = req.body.promotion_setting_id;
        pool.query(`select * from "promotion"."fn_app_create_promotion_docuno"(${company_id},${promotion_setting_id});
                    `,
            (err, results) => {
                if (err) {
                    throw err;
                }
                res.json(results.rows);
            });
    }

    getPromotionTypeData(req, res) {
        pool.query(`SELECT * FROM promotion.promotion_type`,
            (err, results) => {
                if (err) {
                    throw err;
                }
                res.json(results.rows);
            });
    }

   getDiscountValueData(req, res) {
       pool.query(`SELECT * FROM promotion.promotion_discount_value`,
            (err, results) => {
                if (err) {
                    throw err;
                }
                res.json(results.rows);
            });
    }

    getDiscountTypeData(req, res) {
        pool.query(`SELECT * FROM  promotion.promotion_discount_type`,
            (err, results) => {
                if (err) {
                    throw err;
                }
                res.json(results.rows);
            });
    }

    getPromotionEveryData(req, res) {
        pool.query(`select * from promotion.promotion_every
                    order by promotion_every_id
                    `,
            (err, results) => {
                if (err) {
                    throw err;
                }
                res.json(results.rows);
            });
    }

    getPromotionHDData(req, res) {
        const company_id = req.body.company_id;
        const promotion_setting_id = req.body.promotion_setting_id;
        const text_filter = req.body.text_filter;
        pool.query(`select * from promotion.fn_select_promotionhd_filter(${company_id},${promotion_setting_id},'${text_filter}')`,
            (err, results) => {
                if (err) {''
                    throw err;
                }
                res.json(results.rows);
            });
    }

    getPromotionDTData(req, res) {
        const promotionHD_id = req.body.promotionHD_id;
        pool.query(`select * from promotion.fn_select_promotiondt(${promotionHD_id})`,
            (err, results) => {
                if (err) {
                    ''
                    throw err;
                }
                res.json(results.rows);
            });
    }


    getPromotionDTBranch(req, res) {
        const promotionHD_id = req.body.promotionHD_id;
        pool.query(`select * from  promotion.promotion_branch  where promotion_hd_id = ${promotionHD_id}`,
            (err, results) => {
                if (err) {
                    ''
                    throw err;
                }
                res.json(results.rows);
            });
    }


    getPromotionDTCustomerGroup(req, res) {
        const promotionHD_id = req.body.promotionHD_id;
        pool.query(`select * from promotion.promotion_arcustomer_group  where promotion_hd_id = ${promotionHD_id}`,
            (err, results) => {
                if (err) {
                    ''
                    throw err;
                }
                res.json(results.rows);
            });
    }


    getPromotionDTMemberType(req, res) {
        const promotionHD_id = req.body.promotionHD_id;
        pool.query(`select * from  promotion.promotion_member_type  where promotion_hd_id = ${promotionHD_id}`,
            (err, results) => {
                if (err) {
                    ''
                    throw err;
                }
                res.json(results.rows);
            });
    }



    addPromotionData(req, res) {
        const promotion_hd_create_emp_id = req.body.promotion_hd_create_emp_id;
        const promotion_hd_name = req.body.promotion_hd_name;
        const promotion_hd_remark = req.body.promotion_hd_remark;
        const promotion_status_id = req.body.promotion_status_id;
        const promotion_hd_startdate = req.body.promotion_hd_startdate;
        const promotion_hd_enddate = req.body.promotion_hd_enddate;
        const promotion_type_id = req.body.promotion_type_id;
        const master_company_id = req.body.master_company_id;
        const promotion_hd_starttime = req.body.promotion_hd_starttime;
        const promotion_hd_endtime = req.body.promotion_hd_endtime;
        const promotion_type_setting_id = req.body.promotion_type_setting_id;
        const promotion_detail = JSON.stringify(req.body.promotion_detail);
        const master_branch_id = JSON.stringify(req.body.master_branch_id);
        const arcustomer_group_id = JSON.stringify(req.body.arcustomer_group_id);
        const master_member_type_id = JSON.stringify(req.body.master_member_type_id);
        pool.query(`select * from promotion.fn_insert_promotion_data(
                                      ${promotion_hd_create_emp_id},
                                      '${promotion_hd_name}',
                                      '${promotion_hd_remark}',
                                       ${promotion_status_id},
                                      '${promotion_hd_startdate}',
                                      '${promotion_hd_enddate}',
                                      '${promotion_type_id}',
                                       ${master_company_id},
                                      '${promotion_hd_starttime}',
                                      '${promotion_hd_endtime}',    
                                       ${promotion_type_setting_id},
                                      '${promotion_detail}',
                                      '${master_branch_id}',
                                      '${arcustomer_group_id}',
                                      '${master_member_type_id}' )`,
            (err, results) => {
                if (err) {
                    throw err;
                }
                res.json(results.rows);
            });
    }

    cancelPromotion(req, res) {
        const promotionHD_id = req.body.promotionHD_id;
        const cancel_emp_id = req.body.cancel_emp_id;
        pool.query(`UPDATE   promotion.promotion_hd
                       SET    promotion_hd_cancel_emp_id = ${cancel_emp_id},
                             promotion_hd_cancel_log_time = now(),
                              promotion_status_id = 2
                       WHERE  promotion_hd_id = ${promotionHD_id}`,
            (err, results) => {
                if (err) {
                    ''
                    throw err;
                }
                res.json(results.rows);
            });
    }

    getPromotionDiscount(req, res) {
        const company_id = req.body.company_id;
        pool.query(`select * from  promotion.promotion_discount where master_company_id = ${company_id}`,
        (err, results) => {
            if (err) {
                ''
                throw err;
            }
            res.json(results.rows);
        });
    }

    addPromotionDiscount(req, res) {
        const promotion_discount_name = req.body.promotion_discount_name;
        const promotion_discount_type_id = req.body.promotion_discount_type_id;
        const promotion_discount_rate = req.body.promotion_discount_rate;
        const promotion_discount_datebegin = req.body.promotion_discount_datebegin;
        const promotion_discount_dateend = req.body.promotion_discount_dateend;
        const master_company_id = req.body.master_company_id;
        const promotion_discount_status_id = req.body.promotion_discount_status_id;
        const promotion_discount_starttime = req.body.promotion_discount_starttime;
        const promotion_discount_endtime = req.body.promotion_discount_endtime;
        const promotion_discount_remark = req.body.promotion_discount_remark;
        const master_branch_id = JSON.stringify(req.body.master_branch_id);
        const master_member_type_id = JSON.stringify(req.body.master_member_type_id);
        pool.query(`select * from  promotion.fn_insert_promotion_discount_data (
               '${promotion_discount_name}',
                ${promotion_discount_type_id},
                ${promotion_discount_rate},
                '${promotion_discount_datebegin}',
                '${promotion_discount_dateend}',
                 ${master_company_id},
                ${promotion_discount_status_id},
                '${promotion_discount_starttime}'
                '${promotion_discount_endtime}',
                '${promotion_discount_remark}',
                '${master_branch_id}',
                '${master_member_type_id}'
            )`,
            (err, results) => {
                if (err) {
                    ''
                    throw err;
                }
                res.json(results.rows);
            });
    }

}

module.exports = ModelProduct;