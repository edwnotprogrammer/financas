const nameMain = document.querySelector("main");

const pnumber = document.querySelector(".p-number");
const gnumber = document.querySelector(".g-number");
const snumber = document.querySelector(".s-number");

const btn = document.querySelector("#btn");
const tbody = document.querySelector("tbody");

let items = [];

// EVENT BUTTON

btn.onclick = (e) => {
    e.preventDefault();

    let formid = document.getElementById('formid');

    const desc = document.querySelector("#desc");
    const valor = document.querySelector("#valor");
    const modalidade = document.querySelector('input[name="modalidade"]:checked');
    const data = document.querySelector('#date');

    if (desc.value === "" || valor.value === "" || !modalidade || data.value === "") {
        return alert("Preencha todos os campos!");
    }

    if (formid.value !== '') {
        items[formid.value].desc = desc.value;
        items[formid.value].valor = valor.value;
        items[formid.value].modalidade = modalidade.value;
        items[formid.value].data = data.value;
        items[formid.value].riscado = false; // ✅ ALTERADO: limpa traçado ao editar
    } else {
        items.unshift({
            'desc': desc.value,
            'valor': valor.value,
            'modalidade': modalidade.value,
            'data': data.value,
            'riscado': false // 🔄 ADIÇÃO: marca como não riscado
        });
    }

    limparform();
    setItensBD();
    loadItens();
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
    } else {
        console.log('Operação de exclusão cancelada.');
    }
}
// END EVENT DELETE

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
        const data = document.querySelector("#date");

        if (items[index].modalidade === 'E') {
            document.querySelector('#r-entrada').checked = true;
        } else {
            document.querySelector('#r-saida').checked = true;
        }

        desc.value = items[index].desc;
        valor.value = items[index].valor;
        data.value = items[index].data;
        id = index;

        document.getElementById('btn').innerHTML = `<ion-icon name="create-outline"></ion-icon> Editar`;
    }
}
// END EVENT EDIT

// CLEAR FORM
function limparform() {
    let formid = document.getElementById('formid');
    let desc = document.querySelector("#desc");
    let valor = document.querySelector("#valor");
    let data = document.querySelector('#date');

    desc.value = '';
    valor.value = '';
    data.value = '';
    formid.value = '';
    document.querySelector('#r-saida').checked = false;
    document.querySelector('#r-entrada').checked = false;

    document.getElementById('btn').innerHTML = `
        <ion-icon name="add-circle-outline"></ion-icon> Salvar
    `;
}
// END CLEAR FORM

// INSERT ITEM
function insertItem(item, index) {
    let tr = document.createElement("tr");
    if (item.riscado) tr.classList.add("riscado"); // 🔄 ADIÇÃO

    tr.innerHTML = (`
<td>${item.desc}</td>
<td>${formatmoney(Number(item.valor))}</td>
<td>${formtdata(item.data)}</td>
<td class="icon-up-down">
    ${item.modalidade === "E"
        ? '<ion-icon id="icon-up" name="caret-up"></ion-icon>'
        : '<ion-icon id="icon-down" name="caret-down"></ion-icon>'}
</td>
<td class="btn-actions">
    <button onclick="editarItem(true, ${index})"><ion-icon name="create-outline"></ion-icon></button>
    <button onclick="deleteItem(${index})"><ion-icon name="trash-outline"></ion-icon></button>
    <button onclick="toggleRiscado(${index}, this)">
        <ion-icon name="${item.riscado ? 'refresh-outline' : 'remove-outline'}"></ion-icon>
    </button>
</td>
<td></td>
    `);

    tbody.appendChild(tr);
}

// TOGGLE RISCADO
function toggleRiscado(index, btn) {
    const item = items[index];
    item.riscado = !item.riscado;
    setItensBD();
    loadItens(); // recarrega tabela e totais
}

// LOAD ITEMS
function loadItens() {
    items = getItensBD();
    tbody.innerHTML = "";
    items.forEach((item, index) => {
        insertItem(item, index);
    });

    getTotal();
}

// GET TOTAL
function getTotal() {
    const totalE = items
        .filter((item) => item.modalidade === "E" && !item.riscado)
        .map((transaction) => Number(transaction.valor));

    const totalS = items
        .filter((item) => item.modalidade === "S" && !item.riscado)
        .map((transaction) => Number(transaction.valor));

    const totalTe = totalE.reduce((acc, cur) => acc + cur, 0).toFixed(2);
    const totalTs = Math.abs(totalS.reduce((acc, cur) => acc + cur, 0)).toFixed(2);
    const totalItems = (totalTe - totalTs).toFixed(2);

    let checkdalert = document.querySelector('#checkd-alert');

    if (totalItems < 0) {
        checkdalert.innerHTML = `<ion-icon id="alert" name="alert-circle"></ion-icon>`;
    } else if (totalItems > 0) {
        checkdalert.innerHTML = `<ion-icon id="checkd" name="checkmark-circle"></ion-icon>`;
    } else {
        checkdalert.innerHTML = `<ion-icon name="wallet-outline"></ion-icon>`;
    }

    document.getElementById('saldo').style.color = totalItems < 0 ? "red" : "black";

    pnumber.innerHTML = formatmoney(Number(totalTe));
    gnumber.innerHTML = formatmoney(Number(totalTs));
    snumber.innerHTML = formatmoney(Number(totalItems));
}

// STORAGE & FORMAT
const getItensBD = () => JSON.parse(localStorage.getItem("bd_items")) ?? [];
const setItensBD = () => localStorage.setItem("bd_items", JSON.stringify(items));

function zerofill(numero, lagura) {
    return String(numero).padStart(lagura, '0');
}

function formtdata(texto) {
    return moment(texto).format('DD/MM/yyyy');
}

// INICIALIZA
loadItens();
