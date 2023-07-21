const pool = require('../../connectdb.js');

class ModelMemberReport {

    fetcServiceHistoryData(req, res){
        const company_id = req.body.company_id;
        const start_date = req.body.start_date;
        const end_date = req.body.end_date;
        pool.query(`select x.master_branch_id,
                           x.master_branch_code,
                           x.master_branch_prefix,
                           x.master_branch_name,
                           (to_char(x.salehd_docudate, 'DD/MM/')||to_char(x.salehd_docudate, 'YYYY')::int + 543)::text as salehd_docudate,
                           x.arcustomer_id,
                           x.arcustomer_code,
                           x.arcustomer_name,
                           x.salehd_docuno,
                           x.salehd_sumgoodamnt,
                           x.salehd_discountamnt,
                           x.salehd_netamnt,
                           x.collect_points,
                           x.collect_points_old,
                           x.listrow_piority,
                           x.collect_points_balance,
                           x.fullname,
                           x.count_doc,
                           to_char(x.salehd_savetime, 'HH24:MI:SS') salehd_savetime
                    FROM saledata.fn_report_sale_ar_data_point_v1('${start_date}', '${end_date}', ${company_id}) x
                            `,
            (err, result) => {
                if (err) {
                throw err;
                }
                res.json(result.rows);
        });
    }
}

module.exports = ModelMemberReport;