import DataTables from '../../components/Datatable/Datatables';
import { React, useState, useEffect, useContext, useMemo } from "react";
import axios from 'axios';
import UrlApi from "../../url_api/UrlApi";
import DataContext from "../../DataContext/DataContext";
import DataContextBranchData from "../../DataContext/DataContextBranchData";
import HeaderReport from "../../components/HeaderReport/HeaderReport";
import Moment from "moment";

function PromotionReport() {    
    const [loading, setLoading] = useState(false)
    const userData = useContext(DataContext);
    const branchData = useContext(DataContextBranchData);
    const [userCompanyID, setUserCompanyID] = useState(userData[0]['master_company_id']);   
    const deciFormat = new Intl.NumberFormat('en-thai', { style: 'decimal', minimumFractionDigits: 2 })
    const [valueInput, setValueInput] = useState("")
    const [dataConditions,setDataConditions] = useState([])//ประกาศตัวแปรที่จะส่งข้อมูลไปยัง backend
    const [dataReportPromotion, setDataReportPromotion] = useState([])//ตัวแปรที่รับข้อมูลที่ส่งกลับมา
    const [dataReportPromotionSearch, setDataReportPromotionSearch] = useState([])//ตัวแปรใช้ในการค้นหา

    //เป็นคำสั่ง ที่ใช้ในการโหลดหน้าฟอร์ม
    useEffect(() => {
        //เงื่อนไขการเชคข้อมูลให้มีค่า ก่อน ค่อยทำงาน
        if(dataConditions.promotion && dataConditions.promotion.length > 0 &&
            dataConditions.promotionType && dataConditions.promotionType.length > 0 ){
            getPromotionReport()
        }
    }, [dataConditions]) //กรณีที่ใส่ค่า [] เป็นค่าว่างจะโหลดเพียงครั้งเดียว แต่ถ้ามีการใส่ค่าตัวแปรและมีการเปลี่ยนแปลงค่า useEffect จะทำงานทุกครั้ง ที่เปลี่ยนแปลง
   
    //คำสั่ง ที่ส่งข้อมูลไป API
    async function getPromotionReport() {
        const data =
        {
            company_id: userCompanyID,
            start_date: Moment(dataConditions.startDate).format("YYYYMMDD"),
            end_date: Moment(dataConditions.endDate).format("YYYYMMDD"),
            branch_id: dataConditions.branch,
            promotion_type: dataConditions.promotionType,
            promotion_hd: dataConditions.promotion
        }//ตัวแปร ที่ส่งค่าไป funtion
        setLoading(true);
        await axios.post(UrlApi() + 'promotion_report', data).then((res) => {
            if (res.data) {
                res.data.map((item, idx) => {
                    item.row_num = idx + 1
                    item.salehd_docudates = Moment(item.salehd_docudate).format("DD/MM/") + (parseInt(Moment(item.salehd_docudate).format("YYYY")) + 543)                    
                })
                setDataReportPromotion(res.data);//ค่าข้อมูลที่ส่งกลับมาจาก backend res.data เพื่อรับเข้า ตัวแปร setDataReportPromotion ที่ประกาศไว้รับ
                setDataReportPromotionSearch(res.data);//เพื่อใช้ในการค้นหา
                setLoading(false);
            }
        });
        // promotion_report ชื่อ path ที่อยู่ใน backend เพื่อที่จะไปค้นหาดู funtion ว่าใช้ ตัวไหน
    }
    //หัวคอลัมน์ ที่แสดงผลในหน้า ฟอร์นเอ็น
    const columns =
        [
            {
                name: 'ลำดับ',
                selector: (row, index) => row.row_num,
                sortable: true, 
                align: 'right',
                width: '50px' 
            },
            {
                name: 'ประเภทโปรโมชั่น',
                selector: row => row.promotion_type_setting_name,
                sortable: true,
                wrap: true,
                width: '200px'
            },
            {
                name: 'ชื่อโปรโมชั่น',
                selector: row => row.promotion_hd_name,
                sortable: true,
                wrap: true,
                width: '200px'
            },
            {
                name: 'เลขที่โปรโมชั่น',
                selector: row => row.promotion_hd_docuno,
                sortable: true,
                wrap: true,
                width: '170px'
            },
            {
                name: 'รหัสสาขา',
                selector: row => row.master_branch_code,
                sortable: true,
                width: '120px'
            },
            {
                name: 'ชื่อสาขา',
                selector: row => row.master_branch_name,
                sortable: true,
                wrap: true,
                width: '200px'
            },
            {
                name: 'วันที่เอกสาร',
                selector: row => row.salehd_docudates,
                sortable: true,
                right: true
            },
            {
                name: 'เลขที่เอกสาร',
                selector: row => row.salehd_docuno,
                sortable: true,
                wrap: true,
                width: '200px'
            },
            {
                name: 'ลูกค้า',
                selector: row => row.salehd_arcustomer_name,
                sortable: true,
                wrap: true,
                width: '200px'
            },
            {
                name: 'จำนวน',
                selector: row => row.saledt_qty,
                sortable: true,
                right: true,
                width: '50px'
            },
            {
                name: 'มูลค่าสุทธิ',
                selector: row => row.saledt_netamnt,
                sortable: true,
                right: true,
                width: '150px'
            },
            {
                name: 'รูปแบบ',
                selector: row => row.master_order_location_type_name,
                sortable: true,
                wrap: true,
                width: '150px'
            },
            {
                name: 'ผู้บันทึก',
                selector: row => row.salehd_employee_save,
                sortable: true,
                wrap: true,
                width: '150px'
            },
            {
                name: 'ผู้บันทึก/วันที่',
                selector: row => row.salehd_savetime,
                sortable: true,
                wrap: true,
                width: '200px'
            }
        ];

        //Function ที่แสดงข้อมูลจาก backend มาแสดงผลในหน้า ฟอร์นเอ็น
        const getDataTable = () => {
        return (
            <>
                <DataTables
                    noHeader={true}
                    columns={columns}//หัวคอลัมน์รายงาน
                    data={dataReportPromotion}//ข้อมูลรายงาน
                    sortIcon={<sortIcon arrow_downward />}
                />
            </>
        )
        }
    //Export
    const columnExport = [
        { "header": "ลำดับ", "selector": "row_num" },
        { "header": "ประเภทโปรโมชั่น", "selector": "promotion_type_setting_name" },
        { "header": "ชื่อโปรโมชั่น", "selector": "promotion_hd_name" },
        { "header": "เลขที่โปรโมชั่น", "selector": "promotion_hd_docuno" },
        { "header": "รหัสสาขา", "selector": "master_branch_code" },
        { "header": "ชื่อสาขา", "selector": "master_branch_name" },
        { "header": "วันที่เอกสาร", "selector": "salehd_docudates" },
        { "header": "เลขที่เอกสาร", "selector": "salehd_docuno" },
        { "header": "ลูกค้า", "selector": "salehd_arcustomer_name" },
        { "header": "จำนวน", "selector": "saledt_qty" },
        { "header": "มูลค่าสุทธิ", "selector": "saledt_netamnt" },
        { "header": "รูปแบบ", "selector": "master_order_location_type_name" },
        { "header": "ผู้บันทึก", "selector": "salehd_employee_save" },
        { "header": "ผู้บันทึก/วันที่", "selector": "salehd_savetime" },
    ]

    //Search
    const OnchangeSearch = (e) => {
        if (e.target.value) {
            setValueInput(e.target.value)
            let filterText = (e.target.value).trim()
            const filteredItems = dataReportPromotionSearch.filter((item) =>
                JSON.stringify(item).indexOf(filterText) !== -1)
            if (filteredItems.length == 0) {
                setDataReportPromotion([])
                console.log(0);
            } else {
                filteredItems.map((item, idx) => { item.row_num = idx + 1 })
                setDataReportPromotion(filteredItems)
                console.log(1);
            }
        } else {
            setValueInput()
        }
    }

    //จังหวะคลิกเพื่อให้ค่า จาก getDialogReport ที่เป็นเงื่อนไข เพื่อเอาค่าต่างๆ ไปยัง DB (ฟอร์นเอ็น)
    const onChangeDialog = (data) => {
        setDataConditions(data)
        console.log(data,"dataReport");
    }
    const getDialogReport = () => {
        return (
            <HeaderReport
                onClickSearch={(e) => onChangeDialog(e)} //ข้อมูลจาก Dialog
                data={dataReportPromotion}  
                columns={columnExport}
                onChange={(e) => OnchangeSearch(e)}
                value={valueInput} 
                />)
    }
    //return ค่า Function ที่เขียนไว้เพื่อแสดงผลหน้าฟร์อม
    return (
        <div>
            {getDialogReport()}
            {getDataTable()}
        </div>
    );
    
}

export default PromotionReport