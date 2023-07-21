const pool = require('../../connectdb.js');

class ModelCustomer{
    
    getCustomerCategorydata(req, res) {
        const company_id = req.body.company_id;
        pool.query(`SELECT * FROM master_data.arcustomer_category 
                             WHERE master_company_id = ${company_id}
                             ORDER BY arcustomer_category_id DESC`,
            (err, result) => {
                if (err) {
                    throw err;
                }
                res.json(result.rows);
            });
    }

    addCustomerCategorydata(req, res) {
        const master_company_id = req.body.master_company_id;
        const arcustomer_category_name = req.body.arcustomer_category_name;
        const arcustomer_category_active = req.body.arcustomer_category_active;
        pool.query(`INSERT INTO  master_data.arcustomer_category
                                (    master_company_id,
                                     arcustomer_category_name,
                                     arcustomer_category_active)
                                VALUES (
                                     ${master_company_id},
                                    '${arcustomer_category_name}',
                                     ${arcustomer_category_active}
                                )`,
            (err, result) => {
                if (err) {
                    throw err;
                }
                res.json(result.rows);
            });
    }

    updateCustomerCategorydata(req, res) {
        const arcustomer_category_id = req.body.arcustomer_category_id;
        const arcustomer_category_name = req.body.arcustomer_category_name;
        const arcustomer_category_active = req.body.arcustomer_category_active;
        pool.query(`UPDATE  master_data.arcustomer_category
                             SET  arcustomer_category_name = '${arcustomer_category_name}',
                                  arcustomer_category_active = ${arcustomer_category_active}
                             WHERE arcustomer_category_id = ${arcustomer_category_id}`,
            (err, result) => {
                if (err) {
                    throw err;
                }
                res.json(result.rows);
            });
    }

    getCustomerGroupdata(req, res) {
        const company_id = req.body.company_id;
        pool.query(`SELECT customer_group.*,customer_category.arcustomer_category_name
                            FROM   master_data.arcustomer_group  AS  customer_group
                            LEFT JOIN  master_data.arcustomer_category AS customer_category
                            ON customer_group.arcustomer_category_id = customer_category.arcustomer_category_id
                            WHERE customer_group.master_company_id = ${company_id}
                            ORDER BY customer_group.arcustomer_group_id desc
                     `,
            (err, result) => {
                if (err) {
                    throw err;
                }
                res.json(result.rows);
            });
    }

    addCustomerGroupData(req, res) {
        const arcustomer_group_name = req.body.arcustomer_group_name
        const arcustomer_group_name_eng = req.body.arcustomer_group_name_eng
        const arcustomer_category_id = req.body.arcustomer_category_id
        const arcustomer_group_active = req.body.arcustomer_group_active
        const master_company_id = req.body.master_company_id;
        pool.query(`INSERT INTO master_data.arcustomer_group
                    (arcustomer_group_name,
                     arcustomer_group_name_eng,
                     arcustomer_category_id,
                     master_company_id,
                     arcustomer_group_active
                    )
                    values ('${arcustomer_group_name}',
                             '${arcustomer_group_name_eng}',
                             ${arcustomer_category_id},
                             ${master_company_id},
                             ${arcustomer_group_active}
                             )
                      `,
            (err, result) => {
                if (err) {
                    throw err;
                }
                res.json(result.rows);
            });
    }

    updateCustomerGroupData(req, res) {
        const arcustomer_group_id = req.body.arcustomer_group_id
        const arcustomer_group_name = req.body.arcustomer_group_name
        const arcustomer_group_name_eng = req.body.arcustomer_group_name_eng
        const arcustomer_category_id = req.body.arcustomer_category_id
        const arcustomer_group_active = req.body.arcustomer_group_active
        pool.query(`UPDATE master_data.arcustomer_group 
                    SET    arcustomer_group_name = '${arcustomer_group_name}',
                           arcustomer_group_name_eng = '${arcustomer_group_name_eng}',
                           arcustomer_category_id = ${arcustomer_category_id},
                           arcustomer_group_active = ${arcustomer_group_active}
                    WHERE  arcustomer_group_id = ${arcustomer_group_id}
                     `,
            (err, result) => {
                if (err) {
                    throw err;
                }
                res.json({ message: 1 });
            });
    }


    getMemberTypedata(req, res) {
        const company_id = req.body.company_id;
        pool.query(`SELECT * FROM master_data.master_member_type 
                             WHERE master_company_id = ${company_id}
                              ORDER BY master_member_type_id desc`,
            (err, result) => {
                if (err) {
                    throw err;
                }
                res.json(result.rows);
            });
    }

    addMemberTypedata(req, res) {
        const master_company_id = req.body.master_company_id;
        const master_member_type_name = req.body.master_member_type_name;
        const member_type_active = req.body.member_type_active;
        pool.query(`INSERT INTO  master_data.master_member_type
                                (    master_company_id,
                                     master_member_type_name,
                                     member_type_active)
                                VALUES (
                                     ${master_company_id},
                                    '${master_member_type_name}',
                                     ${member_type_active}
                                )`,
            (err, result) => {
                if (err) {
                    throw err;
                }
                res.json(result.rows);
            });
    }

    updateMemberTypedata(req, res) {
        const master_member_type_id = req.body.master_member_type_id;
        const master_member_type_name = req.body.master_member_type_name;
        const member_type_active = req.body.member_type_active;
        pool.query(`UPDATE   master_data.master_member_type
                             SET  master_member_type_name = '${master_member_type_name}',
                                  member_type_active = ${member_type_active}
                             WHERE master_member_type_id = ${master_member_type_id}`,
            (err, result) => {
                if (err) {
                    throw err;
                }
                res.json(result.rows);
            });
    }


    getCustomerData(req, res) {
        const company_id = req.body.company_id;
        const text = req.body.text;
        pool.query(`SELECT * FROM master_data.fn_select_customer(${company_id},'${text}')`,
            (err, result) => {
                if (err) {
                    throw err;
                }
                res.json(result.rows)
            });
    }


    getCustomeCode(req, res) {
        const company_id = req.body.company_id;
        const branch_id = req.body.branch_id;
        pool.query(`SELECT * FROM master_data.fn_app_create_arcustomer_code(${company_id}, ${branch_id})`,
            (err, result) => {
                if (err) {
                    throw err;
                }
                res.json(result.rows);
            });
    }

    getTitleData(req, res) { 
        pool.query(`select * from  master_data_all.master_title
                     `,
            (err, result) => {
                if (err) {
                    throw err;
                }
                res.json(result.rows);
            });
    }

    getPersonTypeData(req, res) {
        pool.query(`SELECT * FROM  master_data_all.master_person_type`,
            (err, result) => {
                if (err) {
                    throw err;
                }
                res.json(result.rows);
            });
    }

    getPriceData(req, res) {
        pool.query(`SELECT * FROM  master_data.arcustomer_price ORDER BY arcustomer_price_id DESC`,
            (err, result) => {
                if (err) {
                    throw err;
                }
                res.json(result.rows);
            });
    }

    getDistrictData(req, res) {
        pool.query(`SELECT * from master_data_all.master_addr_district  ORDER BY master_addr_district_name`,
            (err, result) => {
                if (err) {
                    throw err;
                }
                res.json(result.rows);
            });
    }

    getPrefectureData(req, res) {
        const master_addr_prefecture = req.body.master_addr_prefecture
        pool.query(`SELECT * FROM master_data_all.master_addr_prefecture
                    WHERE master_addr_prefecture_id=${master_addr_prefecture}`,
            (err, result) => {
                if (err) {
                    throw err;
                }
                res.json(result.rows);
            });
    }

    getProvinceData(req, res) {
        const master_addr_province_id = req.body.master_addr_province_id
        pool.query(`SELECT * FROM master_data_all.master_addr_province 
                            WHERE master_addr_province_id = ${master_addr_province_id}`,
            (err, result) => {
                if (err) {
                    throw err;
                }
                res.json(result.rows);
            });
    }

    getPostCodeData(req, res) {
        const master_addr_district_id = req.body.master_addr_district_id;
        pool.query(`SELECT * FROM  master_data_all.master_addr_postcode 
                             WHERE master_addr_district_id = ${master_addr_district_id}`,
            (err, result) => {
                if (err) {
                    throw err;
                }
                res.json(result.rows);
            });
    }

    addCustomerData(req, res) {
        const master_company_id = req.body.master_company_id;
        const master_branch_id = req.body.master_branch_id;
        const arcustomer_code = req.body.arcustomer_code;
        const arcustomer_group_id = req.body.arcustomer_group_id;
        const arcustomer_taxid = req.body.arcustomer_taxid;
        const arcustomer_title_id = req.body.arcustomer_title_id;
        const arcustomer_name = req.body.arcustomer_name;
        const arcustomer_name_eng = req.body.arcustomer_name_eng;
        const arcustomer_person_type_id = req.body.arcustomer_person_type_id;
        const arcustomer_active = req.body.arcustomer_active;
        const arcustomer_addr = req.body.arcustomer_addr;
        const arcustomer_addr_district_id = req.body.arcustomer_addr_district_id;
        const arcustomer_addr_prefecture_id = req.body.arcustomer_addr_prefecture_id;
        const arcustomer_addr_province_id = req.body.arcustomer_addr_province_id;
        const arcustomer_addr_postcode_id = req.body.arcustomer_addr_postcode_id;
        const arcustomer_addr_tel = req.body.arcustomer_addr_tel;
        const arcustomer_email = req.body.arcustomer_email;
        const arcustomer_birthday = req.body.arcustomer_birthday;
        const arcustomer_creditday = req.body.arcustomer_creditday;
        const arcustomer_credit_amount = req.body.arcustomer_credit_amount;
        const arcustomer_member_type_id = req.body.arcustomer_member_type_id;
        const arcustomer_category_id = req.body.arcustomer_category_id;
        const arcustomer_price_id = req.body.arcustomer_price_id;
        if (arcustomer_birthday == null) {
            pool.query(`INSERT INTO master_data.arcustomer
                            (   arcustomer_company_id,
                                arcustomer_branch_id,
                                arcustomer_code,
                                arcustomer_group_id, 
                                arcustomer_taxid, 
                                arcustomer_title_id, 
                                arcustomer_name, 
                                arcustomer_name_eng,
                                arcustomer_person_type_id, 
                                arcustomer_active,
                                arcustomer_addr, 
                                arcustomer_addr_district_id, 
                                arcustomer_addr_prefecture_id,
                                arcustomer_addr_province_id, 
                                arcustomer_addr_postcode_id, 
                                arcustomer_addr_tel, 
                                arcustomer_email, 
                                arcustomer_birthday,
                                arcustomer_creditday,
                                arcustomer_credit_amount,
                                arcustomer_member_type_id,
                                arcustomer_category_id,
                                arcustomer_price_id)
                        VALUES (
                                ${master_company_id},
                                ${master_branch_id},
                                (select docuno from master_data.fn_app_create_arcustomer_code(${master_company_id}, ${master_branch_id})),
                                ${arcustomer_group_id},
                                '${arcustomer_taxid}',
                                ${arcustomer_title_id},
                                '${arcustomer_name}',
                                '${arcustomer_name_eng}',
                                ${arcustomer_person_type_id},
                                ${arcustomer_active},
                                '${arcustomer_addr}',
                                 ${arcustomer_addr_district_id},
                                 ${arcustomer_addr_prefecture_id},
                                 ${arcustomer_addr_province_id},
                                 ${arcustomer_addr_postcode_id},
                                '${arcustomer_addr_tel}',
                                 '${arcustomer_email}',
                                ${arcustomer_birthday},
                                ${arcustomer_creditday},
                                ${arcustomer_credit_amount},
                                ${arcustomer_member_type_id},
                                ${arcustomer_category_id},
                                ${arcustomer_price_id}
                            ) `,
                (err, result) => {
                    if (err) {
                        throw err;
                    }
                    res.json({ message: 1 });
                });
        } else {
            pool.query(`INSERT INTO master_data.arcustomer
                            (   arcustomer_company_id,
                                arcustomer_branch_id,
                                arcustomer_code,
                                arcustomer_group_id, 
                                arcustomer_taxid, 
                                arcustomer_title_id, 
                                arcustomer_name, 
                                arcustomer_name_eng,
                                arcustomer_person_type_id, 
                                arcustomer_active,
                                arcustomer_addr, 
                                arcustomer_addr_district_id, 
                                arcustomer_addr_prefecture_id,
                                arcustomer_addr_province_id, 
                                arcustomer_addr_postcode_id, 
                                arcustomer_addr_tel, 
                                arcustomer_email, 
                                arcustomer_birthday,
                                arcustomer_creditday,
                                arcustomer_credit_amount,
                                arcustomer_member_type_id,
                                arcustomer_category_id,
                                arcustomer_price_id)
                        VALUES (
                                ${master_company_id},
                                ${master_branch_id},
                                (select docuno from master_data.fn_app_create_arcustomer_code(${master_company_id}, ${master_branch_id})),
                                ${arcustomer_group_id},
                                '${arcustomer_taxid}',
                                ${arcustomer_title_id},
                                '${arcustomer_name}',
                                '${arcustomer_name_eng}',
                                ${arcustomer_person_type_id},
                                ${arcustomer_active},
                                '${arcustomer_addr}',
                                 ${arcustomer_addr_district_id},
                                 ${arcustomer_addr_prefecture_id},
                                 ${arcustomer_addr_province_id},
                                 ${arcustomer_addr_postcode_id},
                                '${arcustomer_addr_tel}',
                                 '${arcustomer_email}',
                                '${arcustomer_birthday}',
                                ${arcustomer_creditday},
                                ${arcustomer_credit_amount},
                                ${arcustomer_member_type_id},
                                ${arcustomer_category_id},
                                ${arcustomer_price_id}
                            ) `,
                (err, result) => {
                    if (err) {
                        throw err;
                    }
                    res.json({ message: 1 });
                });
        }
    }

    updateCustomerData(req, res) {
        const arcustomer_id = req.body.arcustomer_id;
        const arcustomer_group_id = req.body.arcustomer_group_id;
        const arcustomer_taxid = req.body.arcustomer_taxid;
        const arcustomer_title_id = req.body.arcustomer_title_id;
        const arcustomer_name = req.body.arcustomer_name;
        const arcustomer_name_eng = req.body.arcustomer_name_eng;
        const arcustomer_person_type_id = req.body.arcustomer_person_type_id;
        const arcustomer_active = req.body.arcustomer_active;
        const arcustomer_addr = req.body.arcustomer_addr;
        const arcustomer_addr_district_id = req.body.arcustomer_addr_district_id;
        const arcustomer_addr_prefecture_id = req.body.arcustomer_addr_prefecture_id;
        const arcustomer_addr_province_id = req.body.arcustomer_addr_province_id;
        const arcustomer_addr_postcode_id = req.body.arcustomer_addr_postcode_id;
        const arcustomer_addr_tel = req.body.arcustomer_addr_tel;
        const arcustomer_email = req.body.arcustomer_email;
        const arcustomer_birthday = req.body.arcustomer_birthday;
        const arcustomer_creditday = req.body.arcustomer_creditday;
        const arcustomer_credit_amount = req.body.arcustomer_credit_amount;
        const arcustomer_member_type_id = req.body.arcustomer_member_type_id;
        const arcustomer_category_id = req.body.arcustomer_category_id;
        const arcustomer_price_id = req.body.arcustomer_price_id;
        pool.query(`UPDATE master_data.arcustomer
                    SET    arcustomer_group_id = ${arcustomer_group_id},
                            arcustomer_taxid = '${arcustomer_taxid}',
                            arcustomer_title_id = ${arcustomer_title_id},
                            arcustomer_name = '${arcustomer_name}',
                            arcustomer_name_eng = '${arcustomer_name_eng}',
                            arcustomer_person_type_id = ${arcustomer_person_type_id},
                            arcustomer_active = ${arcustomer_active},
                            arcustomer_addr = '${arcustomer_addr}',
                            arcustomer_addr_district_id = ${arcustomer_addr_district_id},
                            arcustomer_addr_prefecture_id = ${arcustomer_addr_prefecture_id},
                            arcustomer_addr_province_id = ${arcustomer_addr_province_id},
                            arcustomer_addr_postcode_id = ${arcustomer_addr_postcode_id},
                            arcustomer_addr_tel = '${arcustomer_addr_tel}',
                            arcustomer_email = '${arcustomer_email}',
                            arcustomer_birthday = '${arcustomer_birthday}',
                            arcustomer_creditday = ${arcustomer_creditday},
                            arcustomer_credit_amount = ${arcustomer_credit_amount},
                            arcustomer_member_type_id = ${arcustomer_member_type_id},
                            arcustomer_category_id = ${arcustomer_category_id},
                            arcustomer_price_id  = ${arcustomer_price_id}
                    WHERE   arcustomer_id = ${arcustomer_id}`,
            (err, result) => {
                if (err) {
                    throw err;
                }
                res.json({ message: 1 });
            });
    }

    get_point_type_data(req, res) {
        const company_id = req.body.company_id;
        pool.query(`SELECT pnt.*,mem.master_member_type_name FROM "promotion"."point_type" as pnt
                        LEFT JOIN "master_data"."master_member_type" as mem on
                        pnt.arcustomer_member_type_id = mem.master_member_type_id
                    WHERE pnt.master_company_id = ${company_id}
                    ORDER BY pnt.point_type_id DESC `,
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

    get_promotion_point_data(req, res) {
        const company_id = req.body.company_id;
        pool.query(`SELECT * FROM promotion.promotion_point_type as pro
                    LEFT JOIN promotion.promotion_point_cal_type as typ
                    ON pro.promotion_point_cal_type_id = typ.promotion_point_cal_type_id
                    WHERE pro.master_company_id = ${company_id}
                    ORDER BY promotion_point_type_id asc`,
            (err, result) => {
                if (err) {
                    throw err;
                }
                res.json(result.rows);
            });
    }

    add_promotion_point_data(req, res) {
        const promotion_point_type_name = req.body.promotion_point_type_name;
        const promotion_point_type_quantity = req.body.promotion_point_type_quantity;
        const promotion_point_type_rate = req.body.promotion_point_type_rate;
        const promotion_point_type_active = req.body.promotion_point_type_active;
        const promotion_point_type_datebegin = req.body.promotion_point_type_datebegin;
        const promotion_point_type_dateend = req.body.promotion_point_type_dateend;
        const master_company_id = req.body.master_company_id;
        const promotion_point_cal_type_id = req.body.promotion_point_cal_type_id
        pool.query(`insert into promotion.promotion_point_type(
                    promotion_point_type_name,
                    promotion_point_type_quantity,
                    promotion_point_type_rate,
                    promotion_point_type_active,
                    promotion_point_type_datebegin,
                    promotion_point_type_dateend,
                    promotion_point_cal_type_id,
                    master_company_id )
                values(
                    '${promotion_point_type_name}',
                    ${promotion_point_type_quantity},
                    ${promotion_point_type_rate},
                    ${promotion_point_type_active},
                    '${promotion_point_type_datebegin}',
                    '${promotion_point_type_dateend}',
                    ${promotion_point_cal_type_id},
                    ${master_company_id}
                )`,
            (err, result) => {
                if (err) {
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

    update_point_type_data_data(req, res) {
        const point_type_id = req.body.point_type_id;
        const point_type_name = req.body.point_type_name;
        const point_type_rate = req.body.point_type_rate;
        const point_type_active = req.body.point_type_active;
        const arcustomer_member_type_id = req.body.arcustomer_member_type_id
        pool.query(`update "promotion"."point_type"
                    set    point_type_name = '${point_type_name}' ,
                           point_type_rate = ${point_type_rate},
                           point_type_active = ${point_type_active},
                           arcustomer_member_type_id = ${arcustomer_member_type_id}
                    where  point_type_id = ${point_type_id}
                    `,
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

    filterCustomerData(req, res) {
        const company_id = req.body.company_id;
        const filter_text = req.body.filter_text;
        pool.query(`SELECT x.master_person_type_name,
        x.master_person_country_type_name,
        x.master_addr_district_name,
        x.master_addr_prefecture_name,
        x.master_addr_province_name,
        x.master_addr_postcode_code,
        x.master_member_type_name,
        x.acc_account_code,
        x.acc_account_name,
        x.arcustomer_category_name,
        x.arcustomer_group_name,
        x.master_gender_name,
        x.master_title_name,
        x.arcustomer_id,
        x.arcustomer_code,
        x.arcustomer_group_id,
        x.arcustomer_category_id,
        x.arcustomer_taxid,
        x.arcustomer_title_id,
        x.arcustomer_name,
        x.arcustomer_name_eng,
        x.arcustomer_person_type_id,
        x.arcustomer_createdate,
        x.arcustomer_active,
        x.arcustomer_country_type_id,
        x.arcustomer_addr,
        x.arcustomer_addr_district_id,
        x.arcustomer_addr_prefecture_id,
        x.arcustomer_addr_province_id,
        x.arcustomer_addr_postcode_id,
        x.arcustomer_addr_tel,
        x.arcustomer_addr_fax,
        x.arcustomer_addr_cont_same_flag,
        x.arcustomer_addr_cont,
        x.arcustomer_addr_cont_district_id,
        x.arcustomer_addr_cont_prefecture_id,
        x.arcustomer_addr_cont_province_id,
        x.arcustomer_addr_cont_postcode_id,
        x.arcustomer_addr_cont_tel,
        x.arcustomer_addr_cont_fax,
        x.arcustomer_gender_id,
        x.arcustomer_email,
        x.acc_account_id,
        x.arcustomer_branch_number,
        x.arcustomer_birthday,
        x.arcustomer_empid,
        x.arcustomer_creditday,
        x.arcustomer_company_id,
        x.arcustomer_branch_id,
        x.arcustomer_member_type_id,
        x.arcustomer_price_id,
        x.arcustomer_price_name,
        x.arcustomer_corpcard,
        x.arcustomer_savetime,
        x.employee_fullname
        FROM "master_data"."fn_select_arcustomer"(${company_id}, '${filter_text}') x;
                     `,
            (err, result) => {
                if (err) {
                    throw err;
                }
                res.json(result.rows);
            });
    }

    fetchCustomerDataEdit(req, res) {
        const customer_id = req.body.customer_id;
        const company_id = req.body.company_id;
        pool.query(`select x.*,
                           y.master_addr_district_id,
                           y.master_addr_district_name,
                           z.master_addr_prefecture_id,
                           z.master_addr_prefecture_name,
                           a.master_addr_province_id,
                           a.master_addr_province_name,
                           b.master_addr_postcode_id,
                           b.master_addr_postcode_code
                    from master_data.arcustomer x
                    inner join master_data_all.master_addr_district y on x.arcustomer_addr_district_id = y.master_addr_district_id
                    left join master_data_all.master_addr_prefecture z on x.arcustomer_addr_prefecture_id = z.master_addr_prefecture_id
                    left join master_data_all.master_addr_province a on x.arcustomer_addr_province_id = a.master_addr_province_id
                    left join master_data_all.master_addr_postcode b on x.arcustomer_addr_postcode_id = b.master_addr_postcode_id
                    where x.arcustomer_id = ${customer_id}
                    and x.arcustomer_company_id = ${company_id}
                    `,
            (err, result) => {
                if (err) {
                    throw err;
                }
                res.json(result.rows);
            });
    }

}

module.exports = ModelCustomer;