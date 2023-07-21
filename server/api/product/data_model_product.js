const pool = require('../../connectdb.js');
const fs = require('fs-extra');
class ModelProduct {

    fetchProductData(req, res) {
        const user_id = req.body.user_id;
        const company_id = req.body.company_id;
        const branch_id = req.body.branch_id;
        pool.query(`SELECT  product.master_product_id,
                            product.master_product_code,
                            product.master_product_name_bill,
                            product.sale_activeflag,
                            pro_unit.master_product_unit_name,
                            pro_group.master_product_group_name,
                            product.master_product_group_type_id,
                            pro_cat.master_product_category_name,
                            ROW_NUMBER() OVER (
                                    ORDER BY product.master_product_id DESC
                            ) row_num,
                            pro_type.master_product_group_type_name,
                            pro_price.master_product_price1 as product_price,
                                                        pro_barcode.barcode as master_product_barcode,
                            branch.master_branch_name
      FROM master_data.master_product AS product
      LEFT JOIN master_data.master_product_barcode AS pro_barcode ON product.master_product_id = pro_barcode.master_product_id
      LEFT JOIN master_data.master_product_unit pro_unit ON pro_barcode.master_product_barcode_unitid = pro_unit.master_product_unit_id
                    LEFT JOIN master_data.master_product_group_type pro_type ON product.master_product_group_type_id = pro_type.master_product_group_type_id
                    LEFT JOIN master_data.master_product_group AS pro_group ON product.master_product_group_id = pro_group.master_product_group_id
                    LEFT JOIN master_data.master_product_category pro_cat ON product.master_product_category_id = pro_cat.master_product_category_id
                    LEFT JOIN master_data.master_product_price AS pro_price ON pro_barcode.master_product_barcode_id = pro_price.master_product_barcode_id
                    LEFT JOIN master_data.master_branch AS branch ON pro_price.master_branch_id = branch.master_branch_id
                    WHERE product.master_company_id = ${company_id}
                    AND pro_type.master_product_group_type_id != 3
                    AND product.master_product_configure_type_id  = 1
                    AND product.master_buffet_hd_id IS NULL
                    AND pro_price.master_branch_id = ${branch_id}
                    ORDER BY product.master_product_id DESC
                            `,
            (err, result) => {
                if (err) {
                    throw err;
                }
                res.json(result.rows);
            });

    }

    getProductDataMaterial(req, res) {
        const user_id = req.body.user_id;
        const company_id = req.body.company_id;
        const branch_id = req.body.branch_id;
        pool.query(`SELECT x.master_product_id,
                            x.master_product_code,
                            x.master_product_name,
                            x.master_product_name_bill,
                            x.sale_activeflag,
                            yy.master_product_unit_id,
                            yy.master_product_unit_name,
                            z.master_product_group_name,
                            x.master_product_group_type_id,
                            x.master_product_cost,
                            x.master_product_cost as product_price,
                            y.master_product_group_type_name,
							cats.master_product_category_name
                    FROM master_data.master_product AS x
                    LEFT JOIN master_data.master_product_group_type y ON x.master_product_group_type_id = y.master_product_group_type_id
                    LEFT JOIN master_data.master_product_group AS z ON x.master_product_group_id = z.master_product_group_id
                    LEFT JOIN master_data.master_product_unit yy ON x.master_product_unit_id = yy.master_product_unit_id
					left  join master_data.master_product_category as cats
					on x.master_product_category_id = cats.master_product_category_id
                    WHERE x.master_company_id = ${company_id}
                    AND y.master_product_group_type_id = 3
                    AND x.master_buffet_hd_id IS NULL
                    ORDER BY x.master_product_id DESC
                            `,
            (err, result) => {
                if (err) {
                    throw err;
                }
                res.json(result.rows);
            });

    }
    fetcProductCategoryData(req, res) {
        const company_id = req.body.company_id;
        pool.query(`select  master_product_category_id as id,
                            master_product_category_name as value
                    from master_data.master_product_category
                    where master_company_id = ${company_id}
                    and master_product_category_active = true
                    and master_product_category_buffet_flag = false
                    and  master_product_group_type_id != 3
                    order by master_product_category_name
                     `,
            (err, result) => {
                if (err) {
                    throw err;
                }
                res.json(result.rows);
            });
    }

    fetcProductCategoryMatData(req, res) {
        const company_id = req.body.company_id;
        pool.query(`select  master_product_category_id as id,
                            master_product_category_name as value
                    from master_data.master_product_category
                    where master_company_id = ${company_id}
                    and master_product_category_active = true
                    and master_product_category_buffet_flag = false
                    and  master_product_group_type_id = 3
                    order by master_product_category_name
                     `,
            (err, result) => {
                if (err) {
                    throw err;
                }
                res.json(result.rows);
            });
    }

    fetcProductCategoryDataForBuffet(req, res) {
        const company_id = req.body.company_id;
        pool.query(`select  master_product_category_id as id,
                            master_product_category_name as value
                    from master_data.master_product_category
                    where master_company_id = ${company_id}
                    and master_product_category_active = true
                    and master_product_category_buffet_flag = true
                    order by master_product_category_id desc
                     `,
            (err, result) => {
                if (err) {
                    throw err;
                }
                res.json(result.rows);
            });
    }

    fetchProductGroupData(req, res) {
        const company_id = req.body.company_id;
        pool.query(`select  master_product_group_id as id,
                            master_product_group_name as value,
                            master_product_group_name_eng,
                            master_product_group_code
                    from master_data.master_product_group
                    where master_company_id = ${company_id}
                    and sale_active = true
                    and master_product_group_buffet_flag = false
                    and master_product_group_type_id != 3
                    order by master_product_group_id DESC
                     `,
            (err, result) => {
                if (err) {
                    throw err;
                }
                res.json(result.rows);
            });
    }

    fetchProductGroupMatData(req, res) {
        const company_id = req.body.company_id;
        pool.query(`select  master_product_group_id as id,
                            master_product_group_name as value 
                    from master_data.master_product_group
                    where master_company_id = ${company_id}
                    and sale_active = true
                    and master_product_group_buffet_flag = false
                    and master_product_group_type_id = 3
                    order by master_product_group_id DESC
                     `,
            (err, result) => {
                if (err) {
                    throw err;
                }
                res.json(result.rows);
            });
    }

    fetchProductGroupDataForBuffet(req, res) {
        const company_id = req.body.company_id;
        pool.query(`select  master_product_group_id as id,
                            master_product_group_name as value 
                    from master_data.master_product_group
                    where master_company_id = ${company_id}
                    and sale_active = true
                    and master_product_group_buffet_flag = true
                    order by master_product_group_id DESC
                     `,
            (err, result) => {
                if (err) {
                    throw err;
                }
                res.json(result.rows);
            });
    }


    fetcDepartmentData(req, res) {
        const company_id = req.body.company_id;
        pool.query(`SELECT master_department_id as id,
                           master_department_name as value
                    FROM master_data.master_department 
                    WHERE master_company_id = ${company_id}
                    order by master_department_name
                     `,
            (err, result) => {
                if (err) {
                    throw err;
                }
                res.json(result.rows);
            });
    }

    fetchUnitData(req, res) {
        const company_id = req.body.company_id;
        pool.query(`SELECT master_product_unit_id as id,
                           master_product_unit_name as value
                    FROM master_data.master_product_unit 
                    order by master_product_unit_id DESC
                     `, 
        (err, result)=>{
            if(err){
                throw err;
            }
            res.json(result.rows);
        });

    }

    fetchKitchenData(req, res) {
        const company_id = req.body.company_id;
        pool.query(`SELECT master_kitchen_id as id,
                           master_kitchen_name as value
                    FROM master_data.master_kitchen
                    WHERE master_company_id = ${company_id}
                    AND master_kitchen_active = true
                    order by master_kitchen_id DESC
                     `,
            (err, result) => {
                if (err) {
                    throw err;
                }
                res.json(result.rows);
            });
    }

    fetchProductInvoiceData(req, res) {
        const company_id = req.body.company_id;
        pool.query(`SELECT master_product_invoice_id as id,
                           master_product_invoice_name as value
                    FROM master_data.master_product_invoice 
                    WHERE master_company_id = ${company_id}
                    order by master_product_invoice_id DESC
                     `, 
        (err, result)=>{
            if(err){
                throw err;
            }
            res.json(result.rows);
        });
    }

    fetchVatGroupData(req, res) {
        const company_id = req.body.company_id;
        pool.query(`SELECT master_vat_group_id as id,
                           master_vat_group_name as value
                    FROM master_data_all.master_vat_group
					WHERE master_vat_type_id = 2
                    order by master_vat_group_id DESC
                     `,
            (err, result) => {
                if (err) {
                    throw err;
                }
                res.json(result.rows);
            });
    }

    fetchVatGroupDataForBuffet(req, res) {
        const company_id = req.body.company_id;
        pool.query(`SELECT master_vat_group_id as id,
                           master_vat_group_name as value
                    FROM master_data_all.master_vat_group
                    WHERE master_company_id = ${company_id}
                    AND master_vat_active = TRUE
                    --AND master_vat_group_buffet_flag = true
                    order by master_vat_group_id DESC
                     `,
            (err, result) => {
                if (err) {
                    throw err;
                }
                res.json(result.rows);
            });
    }

    createProductBarcode(req, res) {
        const company_id = req.body.company_id;
        const product_group_id = req.body.product_group_id;
        pool.query(`select master_data.fn_app_create_barcode(${company_id}, ${product_group_id});
                     `,
            (err, result) => {
                if (err) {
                    throw err;
                }
                res.json({ product_barcode: result.rows[0].fn_app_create_barcode });
            });
    }

    // saveProductData(req, res){
    //     const company_prefix = req.body.data.company_prefix;
    //     const images = req.body.data.images;
    //     const product_data = JSON.stringify([req.body.data]);
    //     const company_id = req.body.company_id;
    //     const product_price= JSON.stringify(req.body.option_selected);
    //     if(images != null){
    //         const base64Image = req.body.data.images.split(';base64,').pop();
    //         const realFile = Buffer.from(base64Image,"base64");
    //         const date = new Date();
    //         const imageName = company_prefix + "_" + date.getFullYear().toString() + date.getMonth().toString() +  date.getTime().toString() +".jpg";
    //         fs.writeFileSync("./upload/"+ imageName, realFile, "utf-8");
    //         pool.query(`select master_data.fn_app_insert_master_product(${company_id}, '${product_data}', '${product_price}', '${imageName}');
    //                     `, 
    //         (err, result)=>{
    //             if(err){
    //                 throw err;
    //             }
    //             res.json({master_product_id: result.rows[0].fn_app_insert_master_product});
    //         });
    //     }else{
    //         console.log(discount_active);
    //         pool.query(`select master_data.fn_app_insert_master_product(${company_id}, '${product_data}', '${product_price}', null);
    //                     `, 
    //         (err, result)=>{
    //             if(err){
    //                 throw err;
    //             }
    //             res.json({master_product_id: result.rows[0].fn_app_insert_master_product});
    //         });
    //     }
    // }

    fetchProductDataForEdit(req, res) {
        const product_id = req.body.product_id;
        const company_id = req.body.company_id;
        pool.query(`SELECT x.master_product_code,
                           x.master_product_name,
                           x.master_product_name_eng,
                           x.master_product_category_id,
                           x.master_product_group_id,
                           x.master_vat_group_id,
                           x.sale_activeflag,
                           x.master_product_unit_id,
                           x.master_product_invoice_id,
                           x.master_kitchen_id,
                           x.stock_effect_active,
                           x.master_product_cost,
                           x.master_product_group_type_id,
                           x.master_product_image_name,
                           x.master_product_discount_active_flag as discount_active_flag,
                           x.vat_activeflag,
                           y.sale_active,
                           z.master_product_unit_name,
                           xx.master_product_category_name,
						   br.master_product_barcode_id
                    FROM master_data.master_product x
                    LEFT JOIN master_data.master_product_price y ON x.master_product_id = y.master_product_id
                    LEFT JOIN master_data.master_product_unit z ON x.master_product_unit_id = z.master_product_unit_id
                    LEFT JOIN master_data.master_product_category xx ON x.master_product_category_id = xx.master_product_category_id
                    LEFT JOIN master_data.master_department yy ON x.master_department_id = yy.master_department_id
					left join master_data.master_product_barcode br on  x.master_product_id = br.master_product_id
                    where x.master_product_id = ${product_id}
					AND x.master_company_id = ${company_id}
                    GROUP BY z.master_product_unit_name,
                             xx.master_product_category_name,
                             x.master_product_code,
                             x.master_product_name,
                             x.master_product_name_eng,
                             x.master_product_category_id,
                             x.master_product_group_id,
                             x.master_vat_group_id,
                             x.sale_activeflag,
                             x.master_product_unit_id,
                             x.master_product_invoice_id,
                             x.master_kitchen_id,
                             x.stock_effect_active,
                             x.master_product_cost,
                             x.master_product_group_type_id,
                             x.master_product_image_name,
                             x.master_product_discount_active_flag,
                             x.vat_activeflag,
                             y.sale_active,
							 br.master_product_barcode_id
                    LIMIT 1
                     `,
            (err, result) => {
                if (err) {
                    throw err;
                }
                res.json(result.rows);
            });
    }

    fetchProductPriceInBranch(req, res) {
        const product_id = req.body.product_id;
        const company_id = req.body.company_id;
        const user_id = req.body.user_id;
        pool.query(`select * from master_data.fn_reportapp_master_product_price(${company_id}, ${product_id}, ${user_id});
                     `,
            (err, result) => {
                if (err) {
                    throw err;
                }
                res.json(result.rows);
            });
    }


    // editProductData(req, res){
    //     const company_prefix = req.body.data.company_prefix;
    //     const product_barcode_id = req.body.data.master_product_barcode_id;
    //     const product_data = JSON.stringify([req.body.data]);
    //     const company_id = req.body.company_id;
    //     const images = req.body.data.images;
    //     const product_price= JSON.stringify(req.body.option_selected);
    //     const image_name = req.body.data.image_name;
    //     if(images != null){
    //         const base64Image = images.split(';base64,').pop();
    //         const realFile = Buffer.from(base64Image,"base64");
    //         const date = new Date();
    //         const imageName = company_prefix + "_" + date.getFullYear().toString() + date.getMonth().toString() +  date.getTime().toString() +".jpg";
    //         fs.writeFileSync("./upload/"+ imageName, realFile, "utf-8");
    //         pool.query(`select master_data.fn_app_update_master_product(${company_id}, '${product_data}', '${product_price}', '${imageName}', ${product_barcode_id})
    //                  `, 
    //         (err, result)=>{
    //             if(err){
    //                 throw err;
    //             }
    //             res.json({message: 1});
    //         });
    //     }else{
    //         pool.query(`select master_data.fn_app_update_master_product(${company_id}, '${product_data}', '${product_price}', '${image_name}', ${product_barcode_id})
    //                  `, 
    //         (err, result)=>{
    //             if(err){
    //                 throw err;
    //             }
    //             res.json({message: 1});
    //         });
    //     }

    // }

    fetchProductGroupAll(req, res) {
        const company_id = req.body.company_id;
        pool.query(`select x.*,
                           y.master_product_group_type_name
                    from master_data.master_product_group x
                    left join master_data.master_product_group_type y on x.master_product_group_type_id = y.master_product_group_type_id
                    where x.master_company_id = '${company_id}'
                    and x.master_product_group_type_id <> 3
                    order by x.master_product_group_list_no
                     `,
            (err, result) => {
                if (err) {
                    throw err;
                }
                res.json(result.rows);
            });
    }

    fetchProductMatGroupAll(req, res) {
        const company_id = req.body.company_id;
        pool.query(`select x.*,
                           y.master_product_group_type_name
                    from master_data.master_product_group x
                    left join master_data.master_product_group_type y on x.master_product_group_type_id = y.master_product_group_type_id
                    where x.master_company_id = '${company_id}'
                    and x.master_product_group_type_id = 3
                    order by x.master_product_group_list_no
                     `,
            (err, result) => {
                if (err) {
                    throw err;
                }
                res.json(result.rows);
            });
    }



    addProductGroup(req, res) {
        const company_id = req.body.company_id;
        const category_id = req.body.category_id;
        const progroup_code = req.body.progroup_code;
        const progroup_nameTH = req.body.progroup_nameTH;
        const progroup_nameEN = req.body.progroup_nameEN;
        const sale_active = req.body.sale_active;
        const active_buffet = req.body.active_buffet;
        const pro_group_type = req.body.pro_group_type;
        const company_prefix = req.body.company_prefix;
        const list_no = req.body.list_no;
        const image = req.body.image;
        let base64Image;
        let realFile;
        const date = new Date();
        let imageName;
        if(image != null){
            base64Image = req.body.image.split(';base64,').pop();
            realFile = Buffer.from(base64Image,"base64");
            imageName = company_prefix + "_" + date.getFullYear().toString() + date.getMonth().toString() +  date.getTime().toString() +".jpg";
            fs.writeFileSync("./product_group_images/"+ imageName, realFile, "utf-8");
        }else{
            imageName = 'null';
        }
        pool.query(`insert into master_data.master_product_group
                    (    master_product_category_id ,
                           master_product_group_code,
                           master_product_group_name ,
                           master_product_group_name_eng,
                           master_company_id,
                           sale_active,
                           master_product_group_buffet_flag,
                           master_product_group_type_id,
                           master_product_group_image_name,
                           master_product_group_list_no 
                    )
                    values (
                        ${category_id},
                        '${progroup_code}',
                        '${progroup_nameTH}',
                        '${progroup_nameEN}',
                        '${company_id}',
                        ${sale_active},
                        ${active_buffet},
                        ${pro_group_type},
                        case when '${imageName}' = 'null' then null else '${imageName}' end,
                        ${list_no} 
                    )RETURNING master_product_group_id;
                     `,
            (err, result) => {
                if (err) {
                    throw err;
                }
                res.json(result.rows);
            });
    }


    fetchProductGroupEdit(req, res) {
        const company_id = req.body.company_id;
        const productGroup_id = req.body.productGroup_id
        pool.query(`select *
                    from master_data.master_product_group
                    where master_company_id = ${company_id}
                    and master_product_group_id = ${productGroup_id}
                    order by master_product_group_name
                     `,
            (err, result) => {
                if (err) {
                    throw err;
                }
                res.json(result.rows);
            });
    }

    getProductgroupCode(req, res) {
        pool.query(`select right('0000' ||(
         select coalesce(count(gr.*),0) + 1
         from master_data.master_product_group gr
         where gr.master_company_id = 1
         ),4
       )`,
            (err, result) => {
                if (err) {
                    throw err;
                }
                res.json(result.rows);
            });
    }

    // updateProductGroup(req, res) {
    //     const company_id = req.body.company_id;
    //     const category_id = req.body.category_id;
    //     const sale_active = req.body.sale_active;
    //     const progroup_id = req.body.progroup_id;
    //     const progroup_code = req.body.progroup_code;
    //     const progroup_nameTH = req.body.progroup_nameTH;
    //     const progroup_nameEN = req.body.progroup_nameEN;
    //     const active_buffet = req.body.active_buffet;
    //     const company_prefix = req.body.company_prefix;
    //     const pro_group_type = req.body.pro_group_type;
    //     const list_no = req.body.list_no;
    //     const image = req.body.image;
    //     let base64Image;
    //     let realFile;
    //     const date = new Date();
    //     let imageName;
    //     if(image != null){
    //         base64Image = req.body.image.split(';base64,').pop();
    //         realFile = Buffer.from(base64Image,"base64");
    //         imageName = company_prefix + "_" + date.getFullYear().toString() + date.getMonth().toString() +  date.getTime().toString() +".jpg";
    //         fs.writeFileSync("./product_group_images/"+ imageName, realFile, "utf-8");
    //     }else{
    //         imageName = 'null';
    //     }
    //     pool.query(`update master_data.master_product_group
    //                 set    master_product_category_id = ${category_id},
    //                        master_product_group_code = '${progroup_code}',
    //                        master_product_group_name = '${progroup_nameTH}',
    //                        master_product_group_name_eng = '${progroup_nameEN}',
    //                        sale_active = ${sale_active},
    //                        master_product_group_buffet_flag = ${active_buffet},
    //                        master_product_group_type_id = ${pro_group_type},
    //                        master_product_group_image_name = case when '${imageName}' = 'null' then master_product_group_image_name else '${imageName}' end,
    //                        master_product_group_list_no = ${list_no}
    //                 WHERE  master_product_group_id  = ${progroup_id}
    //                 AND master_company_id = ${company_id}
    //                  `,
    //         (err, result) => {
    //             if (err) {
    //                 throw err;
    //             }
    //             res.json(result.rows);
    //         });
    // }

    fetcDocumentAdjustData(req, res) {
        const company_id = req.body.company_id;
        const branch_id = req.body.branch_id;
        pool.query(`select hd.*,ven.apvendor_name,emp.fullname,
                    ROW_NUMBER() OVER ( ORDER BY hd.inv_adjusthd_id DESC) row_num,
                    (to_char(hd.inv_adjusthd_createdate::date,'DD/MM/'))||(to_char(hd.inv_adjusthd_createdate::date,'yyyy')::int + 543) as date_docuno
                    from inventory.inv_adjust_hd as hd
					left join master_data.apvendor ven
					on hd.inv_adjusthd_apvendorid = ven.apvendorid
					left join security.emp_employeemaster as emp
					on hd.inv_adjusthd_empid = emp.emp_employeemasterid
                    where hd.inv_adjusthd_branch_id = ${branch_id}
                    and hd.inv_adjusthd_company_id = ${company_id}
                    and hd.inv_adjusthd_document_type_id = 1
                    order by hd.inv_adjusthd_id desc
                     `,
        (err, result) => {
            if (err) {
                throw err;
            }
            res.json(result.rows);
            
        });
    }


    createAdjustDocumentNumber(req, res) {
        const company_id = req.body.company_id;
        const branch_id = req.body.branch_id;
        const doc_date = req.body.doc_date;
        pool.query(`select * from inventory.fn_app_adjusthd_docuno(${company_id}, ${branch_id},'${doc_date}');
                     `,
            (err, result) => {
                if (err) {
                    throw err;
                }
                res.json(result.rows);
            });
    }

    fetcProductAdjustData(req, res) {
        const company_id = req.body.company_id;
        const branch_id = req.body.branch_id;
        pool.query(`select x.master_product_id,
                            x.master_product_name_bill||' : '||master_product_code as value,
                            x.master_product_name_bill,
                            x.*,
                            y.master_product_unit_bill,
                            coalesce(xx.inv_adjustdt_quantity_current, 0) as inv_adjustdt_quantity_current
                    from master_data.master_product x
                    left join master_data.master_product_unit y on x.master_product_unit_id = y.master_product_unit_id
                    left join (
                            select  --*
                            y.inv_adjustdt_product_id,
                            coalesce(sum(y.inv_adjustdt_quantity * y.inv_adjustdt_flag_rate), 0) as inv_adjustdt_quantity_current
                            from inventory.inv_adjust_hd x
                            left join inventory.inv_adjust_dt y on x.inv_adjusthd_id = y.inv_adjusthd_id
                            where x.inv_adjusthd_status_id = 1
                            and x.inv_adjusthd_branch_id = ${branch_id}
                            and x.inv_adjusthd_company_id = ${company_id}
                            group by y.inv_adjustdt_product_id
                    ) xx on x.master_product_id = xx.inv_adjustdt_product_id
                    where x.master_company_id = ${company_id}
	                and x.master_product_group_type_id = 3
                    GROUP BY x.master_product_id,
                    y.master_product_unit_bill,
                    xx.inv_adjustdt_quantity_current
                    order by x.master_product_id desc
                     `,
            (err, result) => {
                if (err) {
                    throw err;
                }
                res.json(result.rows);
            });
    }

    
	  saveAdjustData(req, res) {
        const adjusthd = JSON.stringify(req.body.adjusthd);
        const adjustdt = JSON.stringify(req.body.adjustdt);
          pool.query(`SELECT "inventory"."fn_insert_adjust"('${adjusthd}', '${adjustdt}');`,
		 (err, result) => {
                if (err) {
                    throw err;
                }
                res.json(result.rows);
            });
      }

    fetcAdjustDocumentDataForEidt(req, res) {
        const company_id = req.body.company_id;
        const branch_id = req.body.branch_id;
        const adjusthd_id = req.body.adjusthd_id;
        pool.query(`select  hd.inv_adjusthd_id,
                            hd.inv_adjusthd_docuno,
                            hd.inv_adjusthd_netamnt,
                            hd.inv_adjusthd_status_id,
                           (to_char(hd.inv_adjusthd_date_docuno,'DD/MM/'))||(to_char(hd.inv_adjusthd_date_docuno,'yyyy')::int + 543) as date_docuno,
                           hd.inv_adjusthd_apvendorid,
						   ven.apvendor_name,
                           ven.apvendor_credit_day,
						   hd.inv_adjusthd_remark,
                           (select COALESCE(array_to_json(array_agg(row_to_json(yy))), '[]') as adjustdt_data
                                from (
                                       select  x.inv_adjustdt_id,
                                                x.inv_adjustdt_product_code,
                                                x.inv_adjustdt_product_id,
                                                x.inv_adjustdt_product_name,
                                                y.master_product_unit_name,
									            x.inv_adjustdt_quantity,
											    x.inv_adjustdt_unitcost,
												X.inv_adjustdt_netamnt,
                                                case when coalesce(xx.inv_adjustdt_quantity_current, 0) < 0 then 0 else coalesce(xx.inv_adjustdt_quantity_current, 0) end as inv_adjustdt_quantity,
                                                case when coalesce(xx.inv_adjustdt_quantity_current, 0) < 0 then 0 else coalesce(xx.inv_adjustdt_quantity_current, 0) end as inv_adjustdt_quantity_current
                                        from inventory.inv_adjust_dt x
                                        left join master_data.master_product_unit y on x.inv_adjustdt_product_unit_id = y.master_product_unit_id
                                        left join (
                                            select  --*
                                            y.inv_adjustdt_product_id,
                                            coalesce(sum(y.inv_adjustdt_quantity * y.inv_adjustdt_flag_rate), 0) as inv_adjustdt_quantity_current
                                            from inventory.inv_adjust_hd x
                                            left join inventory.inv_adjust_dt y on x.inv_adjusthd_id = y.inv_adjusthd_id
                                            where x.inv_adjusthd_id = ${adjusthd_id}
                                            and x.inv_adjusthd_branch_id = ${branch_id}
                                            and x.inv_adjusthd_company_id = ${company_id}
                                            group by y.inv_adjustdt_product_id
                                    ) xx on x.inv_adjustdt_product_id = xx.inv_adjustdt_product_id
                                        where inv_adjusthd_id =  ${adjusthd_id}
                                        group by x.inv_adjustdt_id,
                                                 y.master_product_unit_name,
                                                 xx.inv_adjustdt_quantity_current
                                )yy
                           )
                           from inventory.inv_adjust_hd as hd
						   left join master_data.apvendor as ven
						   on hd.inv_adjusthd_apvendorid = ven.apvendorid
                           where hd.inv_adjusthd_id = ${adjusthd_id}
                           and hd.inv_adjusthd_company_id  = ${company_id}
                           and hd.inv_adjusthd_branch_id = ${branch_id}
                     `,
            (err, result) => {
                if (err) {
                    throw err;
                }
                res.json(result.rows);
            });
    }

    updateAdjustData(req, res) {
        const company_id = req.body.company_id;
        const branch_id = req.body.branch_id;
        const emp_id = req.body.emp_id;
        const adjusthd_id = req.body.adjusthd_id;
        const remark = req.body.remark;
        const total_adjust_qty = req.body.total_adjust_qty;
        const adjust_data = JSON.stringify(req.body.adjust_data);
        pool.query(`select inventory.fn_app_update_inv_adjust_data(${company_id}, ${branch_id}, '${remark}', ${total_adjust_qty}, ${emp_id}, ${adjusthd_id}, '${adjust_data}');
                     `,
            (err, result) => {
                if (err) {
                    throw err;
                }
                res.json(result.rows);
            });
    }

    cancelDocumentAdjust(req, res) {
        const company_id = req.body.company_id;
        const branch_id = req.body.branch_id;
        const emp_id = req.body.emp_id;
        const adjusthd_id = req.body.adjusthd_id;
        const cancel_remark = req.body.cancel_remark;
        pool.query(`select inventory.fn_update_adjust
                        (${company_id},  -- Master Company ID
                         ${branch_id},   -- Master Branch ID
                         ${emp_id},       -- Emp ID Cancel
                         ${adjusthd_id}  -- HD ID
                        );
                     `,
            (err, result) => {
                if (err) {
                    throw err;
                }
                res.json(result.rows);
            });
    }

    createAdjustCountDocumentNumber(req, res) {
        const company_id = req.body.company_id;
        const branch_id = req.body.branch_id;
        pool.query(`select * from inventory.fn_app_adjustcounthd_docuno(${company_id}, ${branch_id});
                     `,
            (err, result) => {
                if (err) {
                    throw err;
                }
                res.json(result.rows);
            });
    }

    saveCountAdjustData(req, res) {
        const company_id = req.body.company_id;
        const branch_id = req.body.branch_id;
        const emp_id = req.body.emp_id;
        const remark = req.body.remark;
        const total_adjust_qty = req.body.total_adjust_qty;
        const adjust_data = JSON.stringify(req.body.adjust_data);
        pool.query(`select inventory.fn_app_insert_inv_count_adjust_data(${company_id}, ${branch_id}, '${remark}', ${total_adjust_qty}, ${emp_id}, '${adjust_data}');
                     `,
            (err, result) => {
                if (err) {
                    throw err;
                }
                res.json(result.rows);
            });
    }

    fetcDocumentCountAdjustData(req, res) {
        const company_id = req.body.company_id;
        const branch_id = req.body.branch_id;
        pool.query(`select *,
                    ROW_NUMBER() OVER (
                        ORDER BY inv_adjusthd_id DESC
                    ) row_num,		
                    (to_char(inv_adjusthd_createdate::date,'DD/MM/'))||(to_char(inv_adjusthd_createdate::date,'yyyy')::int + 543) as date_docuno
                    from inventory.inv_adjust_hd
                    where inv_adjusthd_branch_id = ${branch_id}
                    and inv_adjusthd_company_id = ${company_id}
                    and inv_adjusthd_document_type_id = 2
                    order by inv_adjusthd_id desc
                     `,
            (err, result) => {
                if (err) {
                    throw err;
                }
                res.json(result.rows);
            });
    }

    createBuffetDocumentNumber(req, res) {
        const company_id = req.body.company_id;
        const branch_id = req.body.branch_id;
        pool.query(`select * from master_data.fn_app_master_buffet_hd_docuno(${company_id}, ${branch_id});
                     `,
            (err, result) => {
                if (err) {
                    throw err;
                }
                res.json(result.rows);
            });
    }

    fetcProductBuffetData(req, res) {
        const company_id = req.body.company_id;
        const branch_id = req.body.branch_id;
        const product_group_id = req.body.product_group_id;
        if(product_group_id != ''){
            pool.query(`select  x.master_product_id,
                                x.master_product_code,
                                x.master_product_name_bill,
                                x.master_product_cost,
                                --x.*,
                                y.master_product_unit_bill
                        from master_data.master_product x
                        left join master_data.master_product_unit y on x.master_product_unit_id = y.master_product_unit_id
                        where x.master_company_id = ${company_id}
                        and x.master_product_group_id = ${product_group_id}
                        and x.sale_activeflag = true
                        and x.master_buffet_hd_id IS NULL
                        order by x.master_product_id desc
                            `,
            (err, result) => {
                if (err) {
                    throw err;
                }
                res.json(result.rows);
            });
        }else{
            pool.query(`select  x.master_product_id,
                                x.master_product_code,
                                x.master_product_name_bill,
                                x.master_product_cost,
                                --x.*,
                                y.master_product_unit_bill
                        from master_data.master_product x
                        left join master_data.master_product_unit y on x.master_product_unit_id = y.master_product_unit_id
                        where x.master_company_id = ${company_id}
                        and x.sale_activeflag = true
                        and x.master_buffet_hd_id IS NULL
                        order by x.master_product_id desc
                    `,
            (err, result) => {
                if (err) {
                throw err;
                }
                res.json(result.rows);
            });
        }
       
    }
    
    // saveBuffetData(req, res) {
    //     const company_id = req.body.company_id;
    //     const branch_id = req.body.branch_id;
    //     const emp_id = req.body.emp_id;
    //     const remark = req.body.remark;
    //     const buffet_active = req.body.buffet_active;
    //     const buffet_price = req.body.buffet_price;
    //     const buffet_limit_order = req.body.buffet_limit_order;
    //     const buffet_name = req.body.buffet_name;
    //     const category_id = req.body.category_id;
    //     const product_group_id = req.body.product_group_id;
    //     const vat_group_id = req.body.vat_group_id;
    //     const vat_active = req.body.vat_active;
    //     const time_to_eat_hr = req.body.time_to_eat_hr;
    //     const time_to_eat_mi = req.body.time_to_eat_mi;
    //     const buffet_data = JSON.stringify(req.body.buffet_data);
    //     const branch_buffet = JSON.stringify(req.body.branch_buffet);
    //     const company_prefix = req.body.company_prefix;
    //     const image = req.body.image;
    //     const start_date = req.body.start_date;
    //     const end_date = req.body.end_date;
    //     const start_time = req.body.start_time;
    //     const end_time = req.body.end_time;
    //     const use_date_time = req.body.use_date_time;
    //     let base64Image;
    //     let realFile;
    //     const date = new Date();
    //     let imageName;
    //     if(image != null){
    //         base64Image = req.body.image.split(';base64,').pop();
    //         realFile = Buffer.from(base64Image,"base64");
    //         imageName = company_prefix + "_" + date.getFullYear().toString() + date.getMonth().toString() +  date.getTime().toString() +".jpg";
    //         fs.writeFileSync("./buffet_images/"+ imageName, realFile, "utf-8");
    //     }else{
    //         imageName = 'null';
    //     }
    //     pool.query(`select master_data.fn_app_insert_buffet_data(
    //                 ${company_id}, 
    //                 ${branch_id}, 
    //                 '${remark}', 
    //                 ${buffet_price}, 
    //                 ${buffet_limit_order}, 
    //                 '${buffet_name}', 
    //                 ${emp_id}, 
    //                 ${buffet_active},
    //                 ${category_id},
    //                 ${product_group_id},
    //                 ${vat_active},
    //                 ${time_to_eat_hr},
    //                 ${time_to_eat_mi},
    //                 '${buffet_data}',
    //                 '${imageName}',
    //                 '${branch_buffet}',
    //                 '${start_date}',
    //                 '${end_date}',
    //                 '${start_time}',
    //                 '${end_time}',
    //                 ${use_date_time}

    //         );
    //          `,
    //     (err, result) => {
    //         if (err) {
    //             throw err;
    //         }
    //         res.json({ message: 1 });
    //     });
       
    // }

    fetcDocumentBuffetData(req, res) {
        const offset = req.body.offset;
        const per_page = req.body.per_page;
        const company_id = req.body.company_id;
        const branch_id = req.body.branch_id;
        pool.query(`select *,
                          (to_char(master_buffet_hd_docudate::date,'DD/MM/'))||(to_char(master_buffet_hd_docudate::date,'yyyy')::int + 543) as date_docuno,
                           (select count(master_buffet_hd_id) 
                            from master_data.master_buffet_hd
                            where master_company_id = ${company_id}                         
                           ) as total
                    from master_data.master_buffet_hd
                    where master_company_id = ${company_id} 
                    order by master_buffet_hd_id DESC
                    limit ${per_page} OFFSET ${offset}
                     `,
            (err, result) => {
                if (err) {
                    throw err;
                }
                if (result.rows.length != 0) {
                    res.json({ total: result.rows[0].total, data: result.rows });
                } else {
                    res.json({ total: 0, data: result.rows });
                }

            });
    }

    fetcBuffetDataForEdit(req, res) {
        const buffethd_id = req.body.buffethd_id;
        const company_id = req.body.company_id;
        const branch_id = req.body.branch_id;
        const user_id = req.body.user_id;
        pool.query(`select * from "master_data"."fn_app_get_buffet_data_foredit"(${company_id}, ${branch_id}, ${buffethd_id}, ${user_id})
                     `,
            (err, result) => {
                if (err) {
                    throw err;
                }
                res.json(result.rows);
            });
    }


    // updateBuffetData(req, res) {
    //     console.log(req.body);
    //     const company_id = req.body.company_id;
    //     const branch_id = req.body.branch_id;
    //     const buffethd_id = req.body.buffethd_id;
    //     const emp_id = req.body.emp_id;
    //     const remark = req.body.remark;
    //     const buffet_active = req.body.buffet_active;
    //     const buffet_limit_order = req.body.buffet_limit_order;
    //     const buffet_price = req.body.buffet_price;
    //     const buffet_name = req.body.buffet_name;
    //     const category_id = req.body.category_id;
    //     const product_group_id = req.body.product_group_id;
    //     const vat_group_id = req.body.vat_group_id;
    //     const vat_active = req.body.vat_active;
    //     const time_to_eat_hr = req.body.time_to_eat_hr;
    //     const time_to_eat_mi = req.body.time_to_eat_mi;
    //     const buffet_data = JSON.stringify(req.body.buffet_data);
    //     const buffet_data_for_update = JSON.stringify(req.body.buffet_data_for_update);
    //     const branch_buffet = JSON.stringify(req.body.branch_buffet);
    //     const branch_buffet_for_update = JSON.stringify(req.body.branch_buffet_for_update);
    //     const company_prefix = req.body.company_prefix;
    //     const image = req.body.image;
    //     const start_date = req.body.start_date;
    //     const end_date = req.body.end_date;
    //     const start_time = req.body.start_time;
    //     const end_time = req.body.end_time;
    //     const use_date_time = req.body.use_date_time;
    //     let base64Image;
    //     let realFile;
    //     const date = new Date();
    //     let imageName;
    //     if(image != null){
    //         base64Image = req.body.image.split(';base64,').pop();
    //         realFile = Buffer.from(base64Image,"base64");
    //         imageName = company_prefix + "_" + date.getFullYear().toString() + date.getMonth().toString() +  date.getTime().toString() +".jpg";
    //         fs.writeFileSync("./buffet_images/"+ imageName, realFile, "utf-8");
    //     }else{
    //         imageName = 'null';
    //     }
    //     pool.query(`select master_data.fn_app_update_buffet_data(
    //                 ${company_id}, 
    //                 ${branch_id}, 
    //                 '${remark}', 
    //                 ${buffet_price},
    //                 ${buffet_limit_order},
    //                 '${buffet_name}', 
    //                 ${emp_id}, 
    //                 ${buffet_active}, 
    //                 '${buffet_data}', 
    //                 '${buffet_data_for_update}', 
    //                 ${buffethd_id},
    //                 ${category_id},
    //                 ${product_group_id},
    //                 ${vat_active},
    //                 ${time_to_eat_hr},
    //                 ${time_to_eat_mi},
    //                 '${imageName}',
    //                 '${branch_buffet}',
    //                 '${branch_buffet_for_update}',
    //                 '${start_date}',
    //                 '${end_date}',
    //                 '${start_time}',
    //                 '${end_time}',
    //                 ${use_date_time}
    //                 );
    //                  `,
    //         (err, result) => {
    //             if (err) {
    //                 throw err;
    //             }
                
    //             res.json({message: 1});
    //         });
    // }

    fetchProductGrouptype(req, res) {
        pool.query(`select master_product_group_type_id as id,
                           master_product_group_type_name as value
                    from master_data.master_product_group_type
                     `,
            (err, result) => {
                if (err) {
                    throw err;
                }
                res.json(result.rows);
            });
    }

    getproduct_Topping(req, res) {
        const company_id = req.body.company_id;
        pool.query(`select * from master_data.fn_returnmaster_producttopping_multi_branch(${company_id})
                    order by master_product_name asc`,
            (err, results) => {
                if (err) {
                    throw err;
                }
                res.status(200).json(results.rows);
            });
    }

    getproduct_Topping_Edit(req, res) {
        const product_id = req.body.product_id;
        pool.query(`select  tp.master_product_id_topping,tp.master_product_id, tp.master_product_id_topping ,
                    tp.master_product_topping_active,tp.master_product_topping_id,
					tp.master_topping_active,  pd.master_product_code, pd.master_product_name,
					pd_tp.master_product_code as master_topping_code,
                    pd_tp.master_product_name as master_topping_name
                    from master_data.master_product_topping as tp
                    inner join master_data.master_product  as pd
                    on tp.master_product_id  = pd.master_product_id
                    inner join master_data.master_product  as pd_tp
                    on tp.master_product_id_topping = pd_tp.master_product_id
                    where tp.master_product_id = ${product_id}
					and tp.master_topping_active = true`,
            (err, results) => {
                if (err) {
                    throw err;
                }
                res.status(200).json(results.rows);
            });
    }

    getproduct_Topping_Edit_Default(req, res) {
        const product_id = req.body.product_id;
        pool.query(`select  tp.master_product_id_topping,tp.master_product_id, tp.master_product_id_topping ,
                    tp.master_product_topping_active,tp.master_product_topping_id,
					tp.master_topping_active,  pd.master_product_code, pd.master_product_name,
					pd_tp.master_product_code as master_topping_code,
                    pd_tp.master_product_name as master_topping_name
                    from master_data.master_product_topping as tp
                    inner join master_data.master_product  as pd
                    on tp.master_product_id  = pd.master_product_id
                    inner join master_data.master_product  as pd_tp
                    on tp.master_product_id_topping = pd_tp.master_product_id
                    where tp.master_product_id = ${product_id}`,
            (err, results) => {
                if (err) {
                    throw err;
                }
                res.status(200).json(results.rows);
            });
    }

    addproduct_Topping(req, res) {
        const product_id = req.body.product_id;
        const topping_id = req.body.topping_id;
        const company_id = req.body.company_id;
        const topping_active = req.body.topping_active;
        pool.query(`insert into master_data.master_product_topping (
                        master_product_id,
                        master_product_id_topping,
                        master_product_topping_active,
                        master_company_id,
                        master_topping_active
                 )
                values( ${product_id},
                        ${topping_id},
                        ${topping_active},
                        ${company_id},
                        true
                )`,
            (err, results) => {
                if (err) {
                    throw err;
                }
                res.status(200).json(results.rows);
            });
    }

    updateproduct_Topping(req, res) {
        const topping_id = req.body.topping_id;
        const topping_active = req.body.topping_active;
        const active = req.body.active;
        pool.query(`update  master_data.master_product_topping
                 set   master_product_topping_active  = ${topping_active},
                        master_topping_active = ${active}
                 where master_product_topping_id = ${topping_id}`,
            (err, results) => {
                if (err) {
                    throw err;
                }
                res.status(200).json(results.rows);
            });
    }

    deleteproduct_Topping(req, res) {
        const product_topping_id = req.body.product_topping_id ;
        pool.query(`delete from  master_data.master_product_topping
                 where master_product_topping_id = ${product_topping_id }`,
            (err, results) => {
                if (err) {
                    throw err;
                }
                res.status(200).json(results.rows);
            });
    }

    getProductgroupOption(req, res) {
        const product_group_id = req.body.product_group_id;
        pool.query(`select * from master_data.master_product_group_remark
                    where master_product_group_id = ${product_group_id}
                    order by master_product_group_remark_id asc`,
            (err, results) => {
                if (err) {
                    throw err;
                }
                res.status(200).json(results.rows);
            });
    }

   
    addProductgroupOption(req, res) {
        const progroup_id = req.body.progroup_id;
        const remark_name = req.body.remark_name;
        const remark_active = req.body.remark_active;
        const company_id = req.body.company_id;
        pool.query(`insert into master_data.master_product_group_remark(
                        master_product_group_id,
                        master_product_group_remark_name,
                        master_product_group_remark_active,
                        master_company_id)
                values( ${progroup_id},
                        '${remark_name}',
                        ${remark_active},
                        ${company_id}
                )`,
            (err, results) => {
                if (err) {
                    throw err;
                }
                res.status(200).json(results.rows);
            });
    }

    updateProductgroupOption(req, res) {
        const remark_id = req.body.remark_id;
        const remark_name = req.body.remark_name;
        const remark_active = req.body.remark_active;
        pool.query(`update  master_data.master_product_group_remark
                    set     master_product_group_remark_name  = '${remark_name}',
                            master_product_group_remark_active = ${remark_active}
                    where   master_product_group_remark_id = ${remark_id}`,
            (err, results) => {
                if (err) {
                    throw err;
                }
                res.status(200).json(results.rows);
            });
    }

    getProductOption(req, res) {
        const company_id = req.body.company_id;
        //const product_group_id = req.body.product_group_id;
            pool.query(`select x.* 
                        from master_data.master_product_option_group x
                        where x.master_company_id = ${company_id}
                        and x.master_product_option_group_active = true
                        order by x.master_product_option_group_id asc`,
                (err, results) => {
                    if (err) {
                        throw err;
                    }
                    res.status(200).json(results.rows);
                });
    }

    getProductOptionEdit(req, res) {
        const pro_id = req.body.pro_id;
        const company_id = req.body.company_id;
        pool.query(`select pr_op.*,x.master_product_option_group_name , op_item.master_product_option_items_name
                        from master_data.master_product_option as pr_op
                        left join master_data.master_product_option_group x
						on pr_op.master_product_option_group_id = x.master_product_option_group_id
						left join master_data.master_product_option_items op_item
						on pr_op.master_product_option_items_id = op_item.master_product_option_items_id
                        where pr_op.master_product_id = ${pro_id}
                        and pr_op.master_company_id = ${company_id}
                        and pr_op.master_product_option_active = true
                        order by pr_op.list_no asc
                        `,
                (err, results) => {
                    if (err) {
                        throw err;
                    }
                    res.status(200).json(results.rows);
                });
      
    }

    getProductOptionEditAll(req, res) {
        const pro_id = req.body.pro_id;
        const company_id = req.body.company_id;
        pool.query(`select pr_op.*,x.master_product_option_group_name , op_item.master_product_option_items_name
                        from master_data.master_product_option as pr_op
                        left join master_data.master_product_option_group x
						on pr_op.master_product_option_group_id = x.master_product_option_group_id
						left join master_data.master_product_option_items op_item
						on pr_op.master_product_option_items_id = op_item.master_product_option_items_id
                        where pr_op.master_product_id = ${pro_id}
                        and pr_op.master_company_id = ${company_id}
                        order by pr_op.list_no asc
                        `,
            (err, results) => {
                if (err) {
                    throw err;
                }
                res.status(200).json(results.rows);
            });

    }


    addProductOption(req, res) {
        const pro_id = req.body.pro_id;
        const option_group_id = req.body.option_group_id;
        const company_id = req.body.company_id;
        const option_group_active = req.body.option_group_active
        const option_item_id = req.body.option_item_id;
        const option_item_active = req.body.option_item_active;
        const option_active = req.body.option_active;
        const list_no = req.body.list_no;
        pool.query(`insert into  master_data.master_product_option(
                            master_product_id,
                            master_product_option_group_active,
                            master_company_id,
                            master_product_option_group_id,
                            master_product_option_items_id,
                            master_product_option_items_active,
                            master_product_option_active,
                            list_no
                            )
                    values( ${pro_id},
                            ${option_group_active},
                            ${company_id},
                            ${option_group_id},
                            ${option_item_id},
                            ${option_item_active},
                            ${option_active},
                            ${list_no}
                    )`,
                (err, results) => {
                    if (err) {
                        throw err;
                    }
                    res.status(200).json({message: 1});
                });
         }


    update_product_options(req, res) {;
        const option_group_active = req.body.option_group_active;
        const option_item_active = req.body.option_item_active;
        const option_active = req.body.option_active;
        const list_no = req.body.list_no;
        const option_id = req.body.option_id;
        pool.query(`update  master_data.master_product_option
                     set    master_product_option_group_active = ${option_group_active},
                            master_product_option_items_active= ${option_item_active},
                            master_product_option_active = ${option_active},
                            list_no = ${list_no}
                    where   master_product_option_id = ${option_id}`,
            (err, results) => {
                if (err) {
                    throw err;
                }
                res.status(200).json(results.rows);
            });
    }

    fetchOptionData(req, res) {
        const company_id = req.body.company_id;
        const branch_id = req.body.branch_id;
        pool.query(`select x.*
                    from master_data.master_product_option_group x
                    where master_company_id = ${company_id}`,
            (err, results) => {
                if (err) {
                    throw err;
                }
                res.status(200).json(results.rows);
            });
    }

    saveOptionData(req, res) {
        const company_id = req.body.company_id;
        const option_group_name = req.body.option_group_name;
        const active = req.body.active;
        const option_selected = JSON.stringify(req.body.option_selected);
        pool.query(`select master_data.fn_app_insert_option_data(${company_id}, '${option_group_name}', ${active}, '${option_selected}')`,
            (err, results) => {
                if (err) {
                    throw err;
                }
                res.status(200).json({message: 1});
            });
    }

    get_option_data_item(req, res) {
        const company_id = req.body.company_id;
        pool.query(` select * from master_data.master_product_option_group as op_group
                     left join  master_data.master_product_option_items as op_item
                     on op_item.master_product_option_group_id = op_group.master_product_option_group_id
                     where op_group.master_company_id = ${company_id} and
					 op_item.master_product_option_items_active = true`,
            (err, results) => {
                if (err) {
                    throw err;
                }
                res.json(results.rows);
            });
    }

    fetchOptionDataForEdit(req, res) {
        const company_id = req.body.company_id;
        const branch_id = req.body.branch_id;
        const option_group_id = req.body.option_group_id;
        pool.query(`select x.*,
                         (select COALESCE(array_to_json(array_agg(row_to_json(yy))), '[]') as option_items
                            from (
                                    select  x.master_product_option_items_id option_id,
                                            x.master_product_option_items_name as option_name,
                                            x.master_product_option_items_active as option_active
                                    from master_data.master_product_option_items x
                                    where x.master_product_option_group_id = ${option_group_id}
                            )yy
                        )
                    from master_data.master_product_option_group x
                    where x.master_product_option_group_id = ${option_group_id}
                    and x.master_company_id = ${company_id}`,
            (err, results) => {
                if (err) {
                    throw err;
                }
                res.json(results.rows);
            });
    }

    updateOptionData(req, res) {
        const company_id = req.body.company_id;
        const option_group_name = req.body.option_group_name;
        const option_group_id = req.body.option_group_id;
        const active = req.body.active;
        const option_selected = JSON.stringify(req.body.option_selected);
        const option_data_for_update = JSON.stringify(req.body.option_data_for_update);
        pool.query(`select master_data.fn_app_update_option_data(${company_id}, ${option_group_id}, '${option_group_name}', ${active}, '${option_selected}', '${option_data_for_update}')`,
            (err, results) => {
                if (err) {
                    throw err;
                }
                res.status(200).json({message: 1});
        });
    }

    get_prounit_data(req, res) {
        const company_id = req.body.company_id;
        const type_id = req.body.type_id;
        const active = req.body.active;
        if (active) {
            pool.query(`select * from master_data.master_product_unit
                    where master_company_id = ${company_id}
                    and master_product_group_type_id = ${type_id}
                    and master_product_unit_active = ${active}
                    `,
                (err, results) => {
                    if (err) {
                        throw err;
                    }
                    res.json(results.rows);
                });

        } else {
            pool.query(`select * from master_data.master_product_unit
                    where master_company_id = ${company_id}
                    and master_product_group_type_id = ${type_id}
                    `,
                (err, results) => {
                    if (err) {
                        throw err;
                    }
                    res.json(results.rows);
                });
        }
    }



    get_unit_data_edit(req, res) {
        const unit_id = req.body.unit_id;
        pool.query(`select * from master_data.master_product_unit
                    where master_product_unit_id = ${unit_id}
                    `,
            (err, results) => {
                if (err) {
                    throw err;
                }
                res.json(results.rows);
            });
    }

    add_unit_data(req, res) {
        const company_id = req.body.company_id;
        const unit_name = req.body.unit_name;
        const unit_bill = req.body.unit_bill;
        const type_id = req.body.type_id;
        const active = req.body.active;
        pool.query(`insert into master_data.master_product_unit
                    (
                    master_company_id,
                    master_product_unit_name,
                    master_product_unit_bill,
                    master_product_group_type_id,
                    master_product_unit_active
                    )
                    values (
                        ${company_id},
                        '${unit_name}',
                        '${unit_bill}',
                        ${type_id},
                        ${active}
                       )`,
            (err, results) => {
                if (err) {
                    throw err;
                }
                res.json(results.rows);
            });
    }

    update_unit_data(req, res) {
        const unit_id = req.body.unit_id;
        const unit_name = req.body.unit_name;
        const unit_bill = req.body.unit_bill;
        const active = req.body.active;
        pool.query(`update master_data.master_product_unit
                   set master_product_unit_name = '${unit_name}',
                   master_product_unit_bill = '${unit_bill}',
                   master_product_unit_active = ${active}
                   where master_product_unit_id = ${unit_id}
                    `,
            (err, results) => {
                if (err) {
                    throw err;
                }
                res.json(results.rows);
            });
    }

    get_product_setting(req, res) {
        const company_id = req.body.company_id;
        const branch_id = req.body.branch_id;
        pool.query(`SELECT x.master_product_id,
                            x.master_product_code,
                            x.master_product_name_bill,
                            x.sale_activeflag,
                            yy.master_product_unit_name,
                            z.master_product_group_name,
                            x.master_product_group_type_id,
							pr.master_product_price_id,
							pr.master_product_price1,
                            pr.sale_active as sale_active_price,
                            y.master_product_group_type_name
                    FROM master_data.master_product AS x
                    LEFT JOIN master_data.master_product_group_type y ON x.master_product_group_type_id = y.master_product_group_type_id
                    LEFT JOIN master_data.master_product_group AS z ON x.master_product_group_id = z.master_product_group_id
                    LEFT JOIN master_data.master_product_unit yy ON x.master_product_unit_id = yy.master_product_unit_id
					LEFT JOIN master_data.master_product_price  as pr on x.master_product_id = pr.master_product_id
                    WHERE x.master_company_id = ${company_id}
                    AND y.master_product_group_type_id != 3
                    AND x.master_buffet_hd_id IS NULL
                    and x.sale_activeflag = true
					and pr.master_branch_id = ${branch_id}
                    ORDER BY x.master_product_id DESC
                    `,
            (err, results) => {
                if (err) {
                    throw err;
                }
                res.json(results.rows);
            });
    }

    update_product_setting(req, res) {
        const sale_active = req.body.sale_active;
        const pro_id = req.body.pro_id;
        pool.query(`update master_data.master_product_price
                    set sale_active = ${sale_active}
                    where master_product_price_id = ${pro_id}
                    `,
            (err, results) => {
                if (err) {
                    throw err;
                }
                res.json(results.rows);
            });
    }

    add_product_setting_log(req, res) {
        const company_id = req.body.company_id;
        const branch_id = req.body.branch_id;
        const sale_active = req.body.sale_active;
        const emp_id = req.body.emp_id;
        const pro_id = req.body.pro_id;
        pool.query(`insert into auditlog.auditlog_master_product_price
                    (
                    master_company_id,
                    master_branch_id,
                    master_product_price_id,
                    sale_active,
                    empsave_id
                    )
                    values (
                        ${company_id},
                        ${branch_id},
                        ${pro_id},
                        ${sale_active},
                        ${emp_id}
                       )`,
            (err, results) => {
                if (err) {
                    throw err;
                }
                res.json(results.rows);
            });
    }

    get_product_data_matmultiunit(req, res) {
        const user_id = req.body.user_id;
        const company_id = req.body.company_id;
        const product_type = req.body.product_type;
        pool.query(`SELECT pro.master_product_id,
                            pro.master_product_code,
                            pro.master_product_name_bill,
                            pro.sale_activeflag,
                            pro_group.master_product_group_name,
                            pro.master_product_group_type_id,
                            pro.master_product_cost,
                            pro_type.master_product_group_type_name ,
							pro_unit.master_product_unit_name,
							pro_unit.master_product_unit_bill,
							pro_barcode.master_product_barcode_unitid,
							pro_barcode.master_product_barcode_unitrate
                    FROM master_data.master_product AS pro
                    LEFT JOIN master_data.master_product_group_type pro_type
					ON pro.master_product_group_type_id = pro_type.master_product_group_type_id
                    LEFT JOIN master_data.master_product_group AS pro_group
					ON pro.master_product_group_id = pro_group.master_product_group_id
					LEFT JOIN  master_data.master_product_barcode pro_barcode
					ON pro.master_product_id = pro_barcode.master_product_id
					LEFT JOIN master_data.master_product_unit as pro_unit
					ON pro_barcode.master_product_barcode_unitid = pro_unit.master_product_unit_id
                    WHERE pro.master_company_id = ${company_id}
                    AND pro_type.master_product_group_type_id = 3
                    AND pro.master_buffet_hd_id IS NULL
					AND pro_barcode.master_product_barcode_active = true
                    ORDER BY pro_barcode.master_product_barcode_unitrate asc
                            `,
            (err, result) => {
                if (err) {
                    throw err;
                }
                res.json(result.rows);
            });

    }

    get_productbom_data_edit(req, res) {
        const company_id = req.body.company_id;
        const product_id = req.body.product_id;
        pool.query(`select pro_bom.* ,pro.master_product_name as master_product_bom_name,
                            pro.master_product_code as master_product_bom_code,
                            unit.master_product_unit_name as master_product_bom_cost_unit_name
                    from master_data.master_product_bom_cost as pro_bom
                    left join master_data.master_product as pro
                    on pro_bom.master_product_bom_master_product_id = pro.master_product_id
                    left join master_data.master_product_unit as unit
                    on pro_bom.master_product_bom_cost_unit_id = unit.master_product_unit_id
                    where pro_bom.master_company_id = ${company_id}
                          and pro_bom.master_product_id = ${product_id}
                          and pro_bom.master_product_bom_cost_active = true`,
            (err, results) => {
                if (err) {
                    throw err;
                }
                res.json(results.rows);
            });
    }

    get_productbom_data_edit_default(req, res) {
        const company_id = req.body.company_id;
        const product_id = req.body.product_id;
        pool.query(`select pro_bom.* ,pro.master_product_name as master_product_bom_name,
                            pro.master_product_code as master_product_bom_code,
                            unit.master_product_unit_name as master_product_bom_cost_unit_name
                    from master_data.master_product_bom_cost as pro_bom
                    left join master_data.master_product as pro
                    on pro_bom.master_product_bom_master_product_id = pro.master_product_id
                    left join master_data.master_product_unit as unit
                    on pro_bom.master_product_bom_cost_unit_id = unit.master_product_unit_id
                    where pro_bom.master_company_id = ${company_id}
                          and pro_bom.master_product_id = ${product_id}`,
            (err, results) => {
                if (err) {
                    throw err;
                }
                res.json(results.rows);
            });
    }


    add_productbom_data(req, res) {
        const master_product_bom_master_product_id = req.body.master_product_bom_master_product_id;
        const master_product_id = req.body.master_product_id;
        const master_company_id = req.body.master_company_id;
        const master_product_bom_cost_unit_id = req.body.master_product_bom_cost_unit_id;
        const master_product_bom_cost_unit_rate = req.body.master_product_bom_cost_unit_rate;
        const master_product_bom_cost_quantity = req.body.master_product_bom_cost_quantity;
        const master_product_bom_cost_netamnt = req.body.master_product_bom_cost_netamnt;
        const master_product_bom_cost_active = req.body.master_product_bom_cost_active;
        pool.query(`insert into master_data.master_product_bom_cost
                    (
                        master_product_bom_master_product_id,
                        master_product_id,
                        master_company_id,
                        master_product_bom_cost_unit_id,
                        master_product_bom_cost_unit_rate,
                        master_product_bom_cost_quantity,
                        master_product_bom_cost_netamnt,
                        master_product_bom_cost_active
                    )
                    values (
                        ${master_product_bom_master_product_id},
                        ${master_product_id},
                        ${master_company_id},
                        ${master_product_bom_cost_unit_id},
                        ${master_product_bom_cost_unit_rate},
                        ${master_product_bom_cost_quantity},
                        ${master_product_bom_cost_netamnt},
                        ${master_product_bom_cost_active}
                       )`,
            (err, results) => {
                if (err) {
                    throw err;
                }
                res.json(results.rows);
            });
    }

    update_productbom_data(req, res) {
        const master_product_bom_cost_id = req.body.master_product_bom_cost_id;
        const master_product_bom_cost_unit_rate = req.body.master_product_bom_cost_unit_rate;
        const master_product_bom_cost_quantity = req.body.master_product_bom_cost_quantity;
        const master_product_bom_cost_netamnt = req.body.master_product_bom_cost_netamnt;
        const master_product_bom_cost_active = req.body.master_product_bom_cost_active;
        pool.query(`update master_data.master_product_bom_cost
                    set master_product_bom_cost_unit_rate = ${master_product_bom_cost_unit_rate},
                        master_product_bom_cost_quantity = ${master_product_bom_cost_quantity},
                        master_product_bom_cost_netamnt =${master_product_bom_cost_netamnt} ,
                        master_product_bom_cost_active = ${master_product_bom_cost_active}
                    where master_product_bom_cost_id = ${master_product_bom_cost_id}
                   `,
            (err, results) => {
                if (err) {
                    throw err;
                }
                res.json(results.rows);
            });
    }

    get_unitmulti_data(req, res) {
        const master_product_id = req.body.master_product_id;
        pool.query(`select br.* , un.master_product_unit_name as master_product_barcode_name
                                    from master_data.master_product_barcode  as br
                                    left join master_data.master_product_unit  as un
                                    on br.master_product_barcode_unitid = un.master_product_unit_id
                   where br.master_product_id =  ${master_product_id}
                    and br.master_product_barcode_active is not null`,
            (err, results) => {
                if (err) {
                    throw err;
                }
                res.json(results.rows);
            });
    }

    get_unitmulti_data_edit(req, res) {
        const master_product_id = req.body.master_product_id;
        pool.query(`select br.* , un.master_product_unit_name as master_product_barcode_name
                                    from master_data.master_product_barcode  as br
                                    left join master_data.master_product_unit  as un
                                    on br.master_product_barcode_unitid = un.master_product_unit_id
                   where br.master_product_id =  ${master_product_id}
                   and br.master_product_barcode_active = true
                    order by br.master_product_barcode_unitrate  asc`,
            (err, results) => {
                if (err) {
                    throw err;
                }
                res.json(results.rows);
            });
    }

    add_unitmulti_data(req, res) {
        const master_product_id = req.body.master_product_id;
        const barcode = req.body.barcode;
        const master_product_barcode_unitrate = req.body.master_product_barcode_unitrate;
        const master_product_barcode_unitid = req.body.master_product_barcode_unitid;
        const master_product_barcode_billname = req.body.master_product_barcode_billname;
        const master_product_barcode_listno = req.body.master_product_barcode_listno;
        const master_company_id = req.body.master_company_id;
        const master_product_barcode_activeflag = req.body.master_product_barcode_activeflag;
        const master_product_barcode_activesale = req.body.master_product_barcode_activesale;
        pool.query(`insert into master_data.master_product_barcode
                    (
                            master_product_id,
                            barcode,
                            master_product_barcode_unitrate,
                            master_product_barcode_unitid,
                            master_product_barcode_billname,
                            master_product_barcode_listno,
                            master_company_id,
                            master_product_barcode_activeflag,
                            master_product_barcode_activesale,
                            master_product_barcode_active
                    )
                    values (
                            ${master_product_id},
                            '${barcode}',
                            ${master_product_barcode_unitrate},
                            ${master_product_barcode_unitid},
                            '${master_product_barcode_billname}',
                            ${master_product_barcode_listno},
                            ${master_company_id},
                            ${master_product_barcode_activeflag},
                            ${master_product_barcode_activesale},
                            true
                       )`,
            (err, results) => {
                if (err) {
                    throw err;
                }
                res.json(results.rows);
            });
    }

    update_unitmulti_data(req, res) {
        const master_product_barcode_id = req.body.master_product_barcode_id;
        const master_product_barcode_unitrate = req.body.master_product_barcode_unitrate;
        const master_product_barcode_active = req.body.master_product_barcode_active;
        const master_product_barcode_activeflag = req.body.master_product_barcode_activeflag;
        const master_product_barcode_activesale = req.body.master_product_barcode_activesale;
        pool.query(`update master_data.master_product_barcode
                   set  master_product_barcode_unitrate = ${master_product_barcode_unitrate},
                        master_product_barcode_active = ${master_product_barcode_active},
                        master_product_barcode_activeflag = ${master_product_barcode_activeflag},
                        master_product_barcode_activesale = ${master_product_barcode_activesale}
                  where master_product_barcode_id = ${master_product_barcode_id} `,
            (err, results) => {
                if (err) {
                    throw err;
                }
                res.json(results.rows);
            });

    }

    get_adjuststock_data(req, res) {
        const master_product_code = req.body.master_product_code;
        const master_product_name = req.body.master_product_name;
        const master_company_id = req.body.master_company_id;
        const master_branch_id =  req.body.master_branch_id;
        pool.query(`select  x.master_product_id, 
                            x.master_product_code, 
                            x.master_product_name, 
                            x.master_product_barcode_unit_name, 
                            x.stc_count_stock_qty 
                     from inventory.fn_return_master_product_countstock('${master_product_code}', '${master_product_name}', ${master_branch_id},${master_company_id}) x`,
            (err, results) => {
                if (err) {
                    throw err;
                }
                res.json(results.rows);
            });
    }

    get_adjuststockcard_data(req, res) {
        const master_product_id = req.body.master_product_id;
        const master_company_id = req.body.master_company_id;
        const master_branch_id = req.body.master_branch_id;
        pool.query(`select * from inventory.fn_report_stc_stockcard(${master_company_id},array[${master_branch_id}],${master_product_id})`,
            (err, results) => {
                if (err) {
                    throw err;
                }
                res.json(results.rows);
            });
    }


    get_adjuststockunit_data(req, res) {
        const master_product_id = req.body.master_product_id;
        const master_branch_id = req.body.master_branch_id;
        const master_company_id = req.body.master_company_id;
        const doc_date = req.body.doc_date;
        pool.query(`select x.master_product_barcode_id,
                        x.master_product_id,
                        x.barcode,
                        x.master_product_barcode_unitrate, 
                        x.master_product_barcode_unitid, 
                        x.master_product_barcode_billname, 
                        x.master_product_unit_name,
                        x.stc_count_stock_qty, 
                        x.savetime ,
                        kt.master_kitchen_id
                        from inventory.fn_reportapp_scanbarcode_inventory_count_stock_v4(${master_company_id}, ${master_branch_id}, ${master_product_id}, 0, '${doc_date}') x
                        left join master_data.master_product as pd on
                        x.master_product_id = pd.master_product_id
                        left join master_data.master_kitchen  as kt on
                        pd.master_kitchen_id = kt.master_kitchen_id
                        order by master_product_barcode_listno desc`,
            (err, results) => {
                if (err) {
                    throw err;
                }
                res.json(results.rows);
            });
    }

    add_adjuststockunit_data(req, res) {
        const master_company_id = req.body.master_company_id;
        const master_product_id = req.body.master_product_id;
        const master_product_barcode_id = req.body.master_product_barcode_id;
        const master_product_barcode_unitid = req.body.master_product_barcode_unitid;
        const master_employee_id = req.body.master_employee_id;
        const stc_count_stock_qty = req.body.stc_count_stock_qty;
        const savetime = req.body.savetime;
        const save_date = req.body.save_date;
        const master_branch_id = req.body.master_branch_id;
        const stockcard_qty = req.body.stockcard_qty;
        const master_kitchen_id = req.body.master_kitchen_id;
        pool.query(`insert into inventory.stc_count_stock
                    (
                        master_company_id,
                        master_product_id,
                        master_product_barcode_id,
                        master_product_barcode_unitid,
                        master_employee_id,
                        stc_count_stock_qty,
                        master_branch_id,
                        stockcard_qty,
                        master_kitchen_id,
                        save_date
                      )
            values(
                        ${master_company_id},
                        ${master_product_id},
                        ${master_product_barcode_id},
                        ${master_product_barcode_unitid},
                        ${master_employee_id},
                        ${stc_count_stock_qty},
                        ${master_branch_id},
                        ${stockcard_qty},
                        ${master_kitchen_id},
                        '${save_date}'
                  )`,
            (err, results) => {
                if (err) {
                    throw err;
                }
                res.json(results.rows);
            });
    }

    add_adjuststockcard_data(req, res) {
        const adjusthd = JSON.stringify(req.body.adjusthd);
        const adjustdt = JSON.stringify(req.body.adjustdt);
        pool.query(`SELECT inventory.fn_insert_count_stc_stockcard('${adjusthd}', '${adjustdt}');`,
            (err, results) => {
                if (err) {
                    throw err;
                }
                res.json(results.rows);
            });
    }

    fetchSafetyStockData(req, res) {
        const company_id = req.body.company_id;
        const product_id = req.body.product_id;
        const user_id = req.body.user_id;
        pool.query(`SELECT x.master_product_safety_stock_id,
                           x.master_branch_id,
                           x.master_product_safety_stock_min,
                           x.master_product_safety_stock_max,
                           x.master_product_safety_stock_active
                    FROM master_data.master_product_safety_stock x
                    WHERE x.master_product_id = ${product_id} 
                    AND x.master_branch_id IN ((select x.master_branch_id
                                                from security.user_login_set_branch x
                                                left join master_data.master_branch y on x.master_branch_id = y.master_branch_id
                                                where user_login_id = ${user_id}
                                                and x.master_branch_active_flag = true
                                                and x.master_company_id = ${company_id}
                                                and y.master_branch_sale_flag = true))
                    order by x.master_branch_id`,
            (err, results) => {
                if (err) {
                    throw err;
                }
                res.json(results.rows);
            });
    }
}

module.exports = ModelProduct;