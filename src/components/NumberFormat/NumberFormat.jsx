function NumberFormat(number){
    let numberFormat;
    numberFormat = Number(number).toLocaleString('en', {minimumFractionDigits: 2, maximumFractionDigits: 2})
    return numberFormat;
}

export default NumberFormat;
