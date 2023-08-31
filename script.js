const nameMain = document.querySelector("main");

const pnumber = document.querySelector(".p-number");
const gnumber = document.querySelector(".g-number");
const snumber = document.querySelector(".s-number");

const desc = document.querySelector("#desc");
const valor = document.querySelector("#valor");
const rentrada = document.querySelector("#r-entrada");
const rsaida = document.querySelector("#r-saida");
const btn = document.getElementById("btn");

const tvalor = document.querySelector(".t-valor");
const tdata = document.querySelector(".t-data");
const tstatus = document.querySelector(".t-status");
const topcoes = document.querySelector(".t-opcoes");
const tbody = document.querySelector("tbody");

let items

btn.onclick = () => {
    if (desc.value === "" || valor.value === "" || rentrada.value === "") {
      return alert("Preencha todos os campos!");
    }
  
    items.push({
      desc: desc.value,
      valor: Math.abs(valor.value).toFixed(2),
      rentrada: rentrada.value,
    });
  
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
    let tr = document.createElement("tr");

    tr.innerHTML = `
<td>${item.desc}</td>
<td>${item.tvalor}</td>
<td>${item.formtdata()}</td>
<td class= "icon-up-down">${item.rentrada === "Entrada"
            ? '<ion-icon name="caret-up"></ion-icon> '
            : '<ion-icon name="caret-down"></ion-icon>'}</td>
<td class="btn-actions">
    '<ion-icon name="create-outline"></ion-icon>'
    '<ion-icon name="trash-outline"></ion-icon>'
</td>`;

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
    const totalE = items.filter((item) => item.topcoes === "Entrada").map((transaction) => Number(transaction.tvalor));
    const totalS = items.filter((item) => item.topcoes === "Saida").map((transaction) => Number(transaction.tvalor));
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

