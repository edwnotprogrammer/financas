const nameMain = document.querySelector("main");

const pnumber = document.querySelector(".p-number");
const gnumber = document.querySelector(".g-number");
const snumber = document.querySelector(".s-number");


const btn = document.querySelector("#btn");
const tbody = document.querySelector("tbody");


let items = [];
let id

// EVENT BUTTON

btn.onclick = () => {

    const desc = document.querySelector("#desc");
    const valor = document.querySelector("#valor");
    const modalidade = document.querySelector('input[name="modalidade"]:checked');

    if (desc.value === "" || valor.value === "" || modalidade.value === "") {
        return alert("Preencha todos os campos!");
    }
    if (id !== undefined) {
        items[id].desc = desc.value
        items[id].valor = valor.value
        items[id].modalidade = modalidade.value
    } else {
        items.unshift({ 'desc': desc.value, 'valor': valor.value, 'modalidade': modalidade.value })

    }

    // items.unshift({

    //     desc: desc.value,
    //     valor: Math.abs(valor.value).toFixed(2),
    //     modalidade: modalidade.value

    // });

    setItensBD();

    loadItens();

    desc.value = "";
    valor.value = "";

};
// END EVENT BUTTON

// EVENT DELETE

function deleteItem(index) {
    items.splice(index, 1);
    setItensBD();
    loadItens();

    let userConfirmation = confirm("Você tem certeza de que deseja deletar este item?");

    // Se o usuário confirmou a exclusão
    if (userConfirmation) {
        // Delete o item
        // Código para deletar o item vai aqui
        console.log(`Item ${index} deletado.`);
    }
    // Se o usuário cancelou a exclusão
    else {
        // Não faça nada

        console.log('Operação de exclusão cancelada.');

    }
}

// END EVENT OF DELETE

// EVENT EDIT
function editarItem(index) {

    openModal(true, index)
}

function openModal(edit = false, index = 0) {
    const contentdesc = document.querySelectorAll('content__desc')
    const desc = document.querySelector("#desc");
    const valor = document.querySelector("#valor");
    const modalidade = document.querySelector('input[name="modalidade"]:checked');



    contentdesc.onclick = e => {
        if (e.target.className.indexOf('content__desc') !== -1) {
            contentdesc.classList.remove('active')
        }
    }

    if (edit) {
        desc.value = items[index].desc
        valor.value = items[index].valor
        modalidade.value = items[index].modalidade
        id = index
    } else {
        desc.value = ''
        valor.value = ''
        modalidade.value = ''
    }

}




// END EVENT OF EDIT


// EVENT INSERT

function insertItem(item, index) {

    const desc = document.querySelector("#desc");
    const valor = document.querySelector("#valor");
    const modalidade = document.querySelector('input[name="modalidade"]:checked').value;

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
    <button id="btn-editar" onclick="editarItem(${index})"><ion-icon name="create-outline"></ion-icon>
    <button id="btn-delete" onclick="deleteItem(${index})"><ion-icon name="trash-outline"></ion-icon></button>
</td>`);

    tbody.appendChild(tr)
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

