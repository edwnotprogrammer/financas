const nameMain = document.querySelector("main");

const pnumber = document.querySelector(".p-number");
const gnumber = document.querySelector(".g-number");
const snumber = document.querySelector(".s-number");


const btn = document.querySelector("#btn");
const tbody = document.querySelector("tbody");


let items = [];


// EVENT BUTTON

btn.onclick = (e) => {

    e.preventDefault()

    let formid = document.getElementById('formid');

    const desc = document.querySelector("#desc");
    const valor = document.querySelector("#valor");
    const modalidade = document.querySelector('input[name="modalidade"]:checked');

    if (desc.value === "" || valor.value === "" || modalidade.value === "") {
        return alert("Preencha todos os campos!");
    }
    if (formid.value !== '') {
        items[formid.value].desc = desc.value
        items[formid.value].valor = valor.value
        items[formid.value].modalidade = modalidade.value
    } else {
        items.unshift({ 'desc': desc.value, 'valor': valor.value, 'modalidade': modalidade.value })

    }

    limparform();

    setItensBD();

    loadItens();

    desc.value = "";
    valor.value = "";

}
// END EVENT BUTTON

// EVENT DELETE

function deleteItem(index) {

    let userConfirmation = confirm("Você tem certeza de que deseja deletar este item?");

    if (userConfirmation) {
        items.splice(index, 1);
        setItensBD();
        loadItens();
        console.log(`Item ${index} deletado.`);

    }
    else {

        console.log('Operação de exclusão cancelada.');

    }
}

// END EVENT OF DELETE

// EVENT EDIT

function editarItem(edit = true, index = 0) {

    let formid = document.getElementById('formid');

    if (formid.value === index.toString()) {
        limparform();
        return;
    }
    if (edit) {

        formid.value = index.toString();

        const desc = document.querySelector("#desc");
        const valor = document.querySelector("#valor");


        if (items[index].modalidade === 'E') {
            document.querySelector('#r-entrada').checked = true
        } else {
            document.querySelector('#r-saida').checked = true
        }
        desc.value = items[index].desc
        valor.value = items[index].valor
        id = index

        document.getElementById('btn').innerHTML = `<ion-icon name="create-outline"></ion-icon>
        Editar`;
    }

}
// END EVENT OF EDIT

function limparform() {

    let formid = document.getElementById('formid');

    let desc = document.querySelector("#desc");
    let valor = document.querySelector("#valor");

    desc.value = ''
    valor.value = ''
    formid.value = ''
    document.querySelector('#r-saida').checked = false
    document.querySelector('#r-entrada').checked = false

    document.getElementById('btn').innerHTML = `
        <ion-icon name="add-circle-outline"></ion-icon>
                                        Salvar
        `;
}

// EVENT INSERT

function insertItem(item, index) {

    const desc = document.querySelector("#desc");
    const valor = document.querySelector("#valor");
    const modalidade = document.querySelector('input[name="modalidade"]:checked');

    let tr = document.createElement("tr");

    tr.innerHTML = (`
<td>${item.desc}</td>
<td> ${formatmoney(Number(item.valor))}</td>
<td>${formtdata()}</td>
<td class= "icon-up-down">${item.modalidade === "E"
            ? '<ion-icon id="icon-up" name="caret-up"></ion-icon>'
            : '<ion-icon id="icon-down" name="caret-down"></ion-icon>'}
            </td>
<td class="btn-actions">
    <button id="btn-editar" onclick="editarItem(true, ${index})"><ion-icon name="create-outline"></ion-icon>
    <button id="btn-delete" onclick="deleteItem(${index})"><ion-icon name="trash-outline"></ion-icon></button>
</td>`);

    tbody.appendChild(tr);
}

function loadItens() {
    items = getItensBD();
    tbody.innerHTML = "";
    items.forEach((item, index) => {
        insertItem(item, index);
    });

    getTotal();

}
//  END EVENT OF INSERT

// EVENT OF INSERTING DATA ON THE CARD

function getTotal() {
    const totalE = items.filter((item) => item.modalidade === "E").map((transaction) => Number(transaction.valor));
    const totalS = items.filter((item) => item.modalidade === "S").map((transaction) => Number(transaction.valor));
    const totalTe = totalE.reduce((acc, cur) => acc + cur, 0).toFixed(2);
    const totalTs = Math.abs(totalS.reduce((acc, cur) => acc + cur, 0)).toFixed(2);

    const totalItems = (totalTe - totalTs).toFixed(2);

    let checkdalert = document.querySelector('#checkd-alert');
    if (totalItems < 0) {

        checkdalert.innerHTML = `<ion-icon id="alert" name="alert-circle"></ion-icon>`;

    } else {

        checkdalert.innerHTML = `<ion-icon id="checkd" name="checkmark-circle"></ion-icon>`;
    }

    if (totalItems < 0) {
        document.getElementById('saldo').style.color = "red";


    } else {
        document.getElementById('saldo').style.color = "black";

    }

    pnumber.innerHTML = formatmoney(Number(totalTe));
    gnumber.innerHTML = formatmoney(Number(totalTs));
    snumber.innerHTML = formatmoney(Number(totalItems));
}


// END EVENT OF INSERTING
const getItensBD = () => JSON.parse(localStorage.getItem("bd_items")) ?? [];
const setItensBD = () => localStorage.setItem("bd_items", JSON.stringify(items));

function zerofill(numero, lagura) {
    return String(numero).padStart(lagura, '0');
}

function formtdata() {

    const data = new Date();
    const dia = zerofill(data.getDate(), 2);
    const meses = zerofill(data.getMonth() + 1, 2);
    const ano = data.getFullYear();

    return `${dia}/${meses}/${ano}`
}
// END LOCALSTORE & FORMAT DATE
loadItens();

