const pool = require('../../connectdb.js');

class modelReason{
    
    get_returnproducthd_reason_all(req, res){
        const company_id = req.body.company_id;
        pool.query(`SELECT * FROM "saledata"."returnproducthd_reason"  WHERE master_company_id = ${company_id}`,
        (err, result)=>{
            if(err){
                throw err;
            }
                res.json(result.rows);
            });
    }

    add_returnproducthd_reason(req, res) {
        const company_id = req.body.company_id;
        const name = req.body.name;
        const status = req.body.status;
        pool.query(`insert into "saledata"."returnproducthd_reason"
                   ( returnproducthd_reason_name, 
                     returnproducthd_reason_active,
                     master_company_id
                    )
                    values (
                        '${name}',
                         ${status},
                        ${company_id}
                    )
                    `,
            (err, result) => {
                if (err) {
                    throw err;
                }
                res.json(result.rows);
            });
    }

    update_returnproducthd_reason(req, res) {
        const name = req.body.name;
        const status = req.body.status;
        const id = req.body.id
        pool.query(`update "saledata"."returnproducthd_reason"
                    SET returnproducthd_reason_name =  '${name}',
                       returnproducthd_reason_active = ${status}
                    WHERE  returnproducthd_reason_id = ${id}
                    `,
            (err, result) => {
                if (err) {
                    throw err;
                }
                res.json(result.rows);
            });
    }


    get_data_cancel_bill(req, res) {
        const company_id = req.body.company_id;
        pool.query(`SELECT x.*
                    from saledata.salehd_cancel_reason x
                    where x.master_company_id = ${company_id} ;
                    `,
            (err, result) => {
                if (err) {
                    throw err;
                }
                res.json(result.rows);
            });
    }

    save_data_cancel_bill(req, res) {
        const cancelbill_name = req.body.cancelbill_name;
        const active = req.body.active;
        const company_id = req.body.company_id;

        pool.query(`INSERT INTO saledata.salehd_cancel_reason(
            salehd_cancel_reason_name, 
            salehd_cancel_reason_active, 
                    master_company_id
                    )
                    VALUES 
                    (
                        '${cancelbill_name}', 
                        ${active}, 
                        ${company_id}
                    );
                     `,
            (err, result) => {
                if (err) {
                    throw err;
                }
                res.json({ message: 1 });
            });
    }


    updateCancelBillData(req, res) {
        const cancelbill_name = req.body.cancelbill_name;
        const cancelbill_id = req.body.cancelbill_id;
        const active = req.body.active;
        const company_id = req.body.company_id;
        pool.query(`update saledata.salehd_cancel_reason 
                    set salehd_cancel_reason_name = '${cancelbill_name}',
                    salehd_cancel_reason_active = ${active}
                     where salehd_cancel_reason_id = ${cancelbill_id}
                     and master_company_id = ${company_id}
                     `,
            (err, result) => {
                if (err) {
                    throw err;
                }
                res.json({ message: 1 });
            });
    }


}

module.exports = modelReason;