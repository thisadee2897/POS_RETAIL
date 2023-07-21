const pool = require('../../connectdb.js');

class modelPayment {

    get_category_data(req, res) {
        const company_id = req.body.company_id;
        pool.query(`SELECT * FROM master_data_all.wht_category
                              WHERE master_company_id = ${company_id}
		                      ORDER BY wht_category_id desc`,
            (err, result) => {
                if (err) {
                    throw err;
                }
                res.json(result.rows);
            });
    }

    add_category_data(req, res) {
        const wht_category_name = req.body.wht_category_name;
        const wht_category_blii_name = req.body.wht_category_blii_name;
        const wht_category_rate = req.body.wht_category_rate;
        const wht_category_active = req.body.wht_category_active;
        const master_company_id = req.body.master_company_id;
        pool.query(`insert into master_data_all.wht_category(
                        wht_category_name,
                        wht_category_blii_name,
                        wht_category_rate,
                        wht_category_active,
                        master_company_id )
                    values(
                        '${wht_category_name}',
                        '${wht_category_blii_name}',
                        ${wht_category_rate},
                        ${wht_category_active},
                        ${master_company_id}
                    )`,
            (err, result) => {
                if (err) {
                    throw err;
                }
                res.json(result.rows);
            });
    }

    update_whtcategory_data(req, res) {
        const wht_category_name = req.body.wht_category_name;
        const wht_category_blii_name = req.body.wht_category_blii_name;
        const wht_category_rate = req.body.wht_category_rate;
        const wht_category_active = req.body.wht_category_active;
        const wht_category_id = req.body.wht_category_id;
        pool.query(`update  master_data_all.wht_category
                             set wht_category_name = '${wht_category_name}',
                                 wht_category_blii_name =  '${wht_category_blii_name}',
                                 wht_category_rate =  ${wht_category_rate},
                                 wht_category_active = ${wht_category_active} 
                           where wht_category_id = ${wht_category_id}`,
            (err, result) => {
                if (err) {
                    throw err;
                }
                res.json(result.rows);
            });
    }

    get_partner_data(req, res) {
        const company_id = req.body.company_id;
        pool.query(`select * from master_data.master_partner where master_company_id = ${company_id}`,
            (err, result) => {
                if (err) {
                    throw err;
                }
                res.json(result.rows);
            });
    }

    add_partner_data(req, res) {
        const master_partner_name = req.body.master_partner_name;
        const master_partner_creditamnt = req.body.master_partner_creditamnt;
        const company_id = req.body.master_company_id;
        const master_partner_active = req.body.master_partner_active;
        pool.query(`insert into master_data.master_partner(
                        master_partner_name,
                        master_partner_creditamnt,
                        master_partner_active,
                        master_company_id
                     )
                    values(
                       ' ${master_partner_name}',
                        ${master_partner_creditamnt},
                        ${master_partner_active},
                        ${company_id}
                    )`,
            (err, result) => {
                if (err) {
                    throw err;
                }
                res.json(result.rows);
            });
    }

    update_partner_data_edit(req, res) {
        const master_partner_name = req.body.master_partner_name;
        const master_partner_creditamnt = req.body.master_partner_creditamnt;
        const master_partner_id = req.body.master_partner_id;
        const master_partner_active = req.body.master_partner_active;
        pool.query(`update master_data.master_partner
                        set  master_partner_name = '${master_partner_name}',
                        master_partner_creditamnt =  ${master_partner_creditamnt},
                        master_partner_active = ${master_partner_active}
                        where master_partner_id = ${master_partner_id}
                    `,
            (err, result) => {
                if (err) {
                    throw err;
                }
                res.json(result.rows);
            });
    }

    get_voucher_data(req, res) {
        const company_id = req.body.company_id;
        pool.query(`SELECT * FROM "saledata"."salehd_voucher_type" 
                    where master_company_id = ${company_id}
                    ORDER BY salehd_voucher_type_id ASC `,
            (err, result) => {
                if (err) {
                    throw err;
                }
                res.json(result.rows);
            });
    }

    add_voucher_data(req, res) {
        const master_company_id = req.body.master_company_id;
        const salehd_voucher_datebegin = req.body.salehd_voucher_datebegin;
        const salehd_voucher_dateend = req.body.salehd_voucher_dateend;
        const salehd_voucher_type_active = req.body.salehd_voucher_type_active;
        const salehd_voucher_type_name = req.body.salehd_voucher_type_name;
        const salehd_voucher_type_rate = req.body.salehd_voucher_type_rate;
        pool.query(`INSERT INTO "saledata"."salehd_voucher_type"
                    (
                        master_company_id,
                        salehd_voucher_datebegin,
                        salehd_voucher_dateend,
                        salehd_voucher_type_active,
                        salehd_voucher_type_name,
                        salehd_voucher_type_rate,
                        salehd_voucher_cal_type_id
                    )
             values (
                        ${master_company_id},
                       '${salehd_voucher_datebegin}',
                       '${salehd_voucher_dateend}',
                        ${salehd_voucher_type_active},
                       '${salehd_voucher_type_name}',
                        ${salehd_voucher_type_rate},
                        2
                   )`,
            (err, result) => {
                if (err) {
                    throw err;
                }
                res.json(result.rows);
            });
    }

    update_voucher_data(req, res) {
        const salehd_voucher_type_id = req.body.salehd_voucher_type_id;
        const salehd_voucher_datebegin = req.body.salehd_voucher_datebegin;
        const salehd_voucher_dateend = req.body.salehd_voucher_dateend;
        const salehd_voucher_type_active = req.body.salehd_voucher_type_active;
        const salehd_voucher_type_name = req.body.salehd_voucher_type_name;
        const salehd_voucher_type_rate = req.body.salehd_voucher_type_rate;
        pool.query(`update"saledata"."salehd_voucher_type" 
                    set    salehd_voucher_datebegin = '${salehd_voucher_datebegin}' ,
                        salehd_voucher_dateend = '${salehd_voucher_dateend}',
                        salehd_voucher_type_active = ${salehd_voucher_type_active},
                        salehd_voucher_type_name = '${salehd_voucher_type_name}',
                        salehd_voucher_type_rate = ${salehd_voucher_type_rate}
                where salehd_voucher_type_id = ${salehd_voucher_type_id}
                    `,
            (err, result) => {
                if (err) {
                    throw err;
                }
                res.json(result.rows);
            });
    }

    getCardTypeData(req, res) {
        const company_id = req.body.company_id;
        pool.query(`SELECT * FROM master_data_all.cq_cardtype 
                             WHERE  master_company_id = ${company_id}
                              ORDER BY cq_cardtype_id desc`,
            (err, result) => {
                if (err) {
                    throw err;
                }
                res.json(result.rows);
            });
    }


    addCardTypeData(req, res) {
        const cardtype_name = req.body.cardtype_name;
        const cardtype_bankfee = req.body.cardtype_bankfee;
        const max_amnt = req.body.max_amnt;
        const company_id = req.body.company_id;
        pool.query(`INSERT INTO master_data_all.cq_cardtype
                    (      cq_cardtype_name ,
                           cq_cardtype_bankfee,
                           charge_max_amnt ,
                           master_company_id
                    )
                    VALUES (
                        '${cardtype_name}',
                        '${cardtype_bankfee}',
                        '${max_amnt}',
                        ${company_id}
                    )`,
            (err, result) => {
                if (err) {
                    throw err;
                }
                res.json(result.rows);
            });
    }

    updateCardTypeData(req, res) {
        const card_id = req.body.card_id;
        const cardtype_name = req.body.cardtype_name;
        const cardtype_bankfee = req.body.cardtype_bankfee;
        const max_amnt = req.body.max_amnt;
        pool.query(`UPDATE master_data_all.cq_cardtype
              SET      cq_cardtype_name = '${cardtype_name}',
                       cq_cardtype_bankfee = ${cardtype_bankfee},
                      charge_max_amnt = ${max_amnt}
                WHERE cq_cardtype_id = ${card_id} `,
            (err, result) => {
                if (err) {
                    throw err;
                }
                res.json(result.rows);
            });
    }


    


}

module.exports = modelPayment;