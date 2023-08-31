const nameMain = document.querySelector("main");

const pnumber = document.querySelector(".p-number");
const gnumber = document.querySelector(".g-number");
const snumber = document.querySelector(".s-number");


const btn = document.querySelector("#btn");
const tbody = document.querySelector("tbody");


let items = [];

btn.onclick = () => {

    const desc = document.querySelector("#desc");
    const valor = document.querySelector("#valor");
    const modalidade = document.querySelector('input[name="modalidade"]:checked');

    if (desc.value === "" || valor.value === "") {
        return alert("Preencha todos os campos!");


    }

    items.unshift({

        desc: desc.value,
        valor: Math.abs(valor.value).toFixed(2),
        modalidade: modalidade.value

    });

    // console.log(modalidade.value)

    setItensBD();

    loadItens();

    desc.value = "";
    valor.value = "";

};


function deleteItem(index) {
    items.splice(index, 1);
    setItensBD();
    loadItens();
}


function insertItem(item, index) {

    const desc = document.querySelector("#desc");
    const valor = document.querySelector("#valor");
    const modalidade = document.querySelector('input[name="modalidade"]:checked').value;

    let tr = document.createElement("tr");

    tr.innerHTML = (`
<td>${item.desc}</td>
<td>${item.valor}</td>
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

function getTotal() {
    const totalE = items.filter((item) => item.modalidade === "E").map((transaction) => Number(transaction.pnumber));
    const totalS = items.filter((item) => item.modalidade === "S").map((transaction) => Number(transaction.gnumber));
    const totalTe = totalE.reduce((acc, cur) => acc + cur, 0).toFixed(2);
    const totalTs = Math.abs(totalS.reduce((acc, cur) => acc + cur, 0)).toFixed(2);

    const totalItems = (totalTe - totalTs).toFixed(2);

    pnumber.innerHTML = totalTe;
    gnumber.innerHTML = totalTs;
    snumber.innerHTML = totalItems;
}
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

