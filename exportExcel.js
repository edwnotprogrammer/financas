function htmlTableToExcel(){
        console.log(items)
    
    let excelLines = [];

    let line = [];
    line.push("desc");
    line.push("tipo");
    line.push("valor");
    line.push("data");
    
    excelLines.push(line);

    for(let line of items){

        let record = [];
        record.push(line.desc);
        record.push(line.modalidade === 'E' ? 'ENTRADA' : 'SAIDA');
        record.push(line.valor);
        record.push(line.data);
        excelLines.push(record);
    }

    let wb = XLSX.utils.book_new();
    let ws = XLSX.utils.aoa_to_sheet(excelLines);

    XLSX.utils.book_append_sheet(wb, ws, "MOVIMETAÇÕES");
    XLSX.writeFile(wb, "FINANÇAS.xlsx", { xlsx: XLSX_ZAHL_PAYLOAD, compression: true });
}
