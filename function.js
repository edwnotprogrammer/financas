function formatmoney(valor) {
    const formatmoeda = {
        style:'currency',
        currency: 'BRL'
    };

    return valor.toLocaleString('pt-BR', formatmoeda);
    
};