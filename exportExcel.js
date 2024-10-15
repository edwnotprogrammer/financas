function htmlTableToExcel(){
        console.log(items)
    
    let excelLines = [];

    let line = [];
    line.push("DESCRIÇÃO");
    line.push("VALOR");
    line.push("TIPO");
    line.push("DATA")
    
    
    excelLines.push(line);

    for(let line of items){

        let record = [];
        record.push(line.desc);
        record.push(line.valor);
        record.push(line.modalidade === 'E' ? 'ENTRADA' : 'SAIDA');
        record.push(line.data);
        excelLines.push(record);
    }

    let wb = XLSX.utils.book_new();
    let ws = XLSX.utils.aoa_to_sheet(excelLines);

    XLSX.utils.book_append_sheet(wb, ws, "MOVIMENTAÇÕES");
    XLSX.writeFile(wb, "Relatorios.xlsx", { xlsx: XLSX_ZAHL_PAYLOAD, compression: true });
}
