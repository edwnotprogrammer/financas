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
        items[formid.value].oculto = false; // ✅ Volta a ser visível ao editar
    } else {
        items.unshift({
            'desc': desc.value,
            'valor': valor.value,
            'modalidade': modalidade.value,
            'data': data.value,
            'oculto': false // ✅ novo campo
        });
    }

    limparform();
    setItensBD();
    loadItens();
};
// END EVENT BUTTON

// DELETE
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
// END DELETE

// EDIT
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
// END EDIT

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
    if (item.oculto) return; // ✅ Oculta o item da tabela

    let tr = document.createElement("tr");

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
    <button onclick="toggleOculto(${index})">
        <ion-icon name="eye-off-outline"></ion-icon>
    </button>
</td>
    `);

    tbody.appendChild(tr);
}

// TOGGLE OCULTO
function toggleOcultos() {
    const divOcultos = document.getElementById("lista-ocultos");
    if (divOcultos.style.display === "none") {
        divOcultos.style.display = "block";
        renderOcultos();
    } else {
        divOcultos.style.display = "none";
    }
}

function renderOcultos() {
    const tbodyOcultos = document.getElementById("tbody-ocultos");
    tbodyOcultos.innerHTML = "";

    items.forEach((item, index) => {
        if (item.oculto) {
            const tr = document.createElement("tr");
            tr.innerHTML = `
                <td>${item.desc}</td>
                <td>${formatmoney(Number(item.valor))}</td>
                <td>${formtdata(item.data)}</td>
                <td>
                    <button class="btn-eye" onclick="toggleOculto(${index})">
                        <ion-icon name="eye-outline"></ion-icon>
                    </button>
                </td>
            `;
            tbodyOcultos.appendChild(tr);
        }
    });
}

function toggleOculto(index) {
    items[index].oculto = !items[index].oculto;
    setItensBD();
    loadItens();
    renderOcultos();
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
        .filter((item) => item.modalidade === "E" && !item.oculto)
        .map((transaction) => Number(transaction.valor));

    const totalS = items
        .filter((item) => item.modalidade === "S" && !item.oculto)
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

// STORAGE
const getItensBD = () => JSON.parse(localStorage.getItem("bd_items")) ?? [];
const setItensBD = () => localStorage.setItem("bd_items", JSON.stringify(items));

// FORMAT
function zerofill(numero, lagura) {
    return String(numero).padStart(lagura, '0');
}

function formtdata(texto) {
    return moment(texto).format('DD/MM/YYYY');
}

// INICIALIZA
loadItens();
// ===== MODAL DE ITENS OCULTOS =====
function toggleOcultos() {
    const modal = document.getElementById("modalOcultos");
    const tbodyModal = document.getElementById("modal-body-ocultos");
    tbodyModal.innerHTML = "";

    const ocultos = items
        .map((item, index) => ({ ...item, index }))
        .filter(item => item.oculto);

    if (ocultos.length === 0) {
        tbodyModal.innerHTML = "<tr><td colspan='4'>Nenhum item oculto.</td></tr>";
    } else {
        ocultos.forEach(({ desc, valor, data, index }) => {
            const tr = document.createElement("tr");
            tr.innerHTML = `
                <td><input type="checkbox" name="reexibir" value="${index}"></td>
                <td>${desc}</td>
                <td>${formatmoney(Number(valor))}</td>
                <td>${formtdata(data)}</td>
            `;
            tbodyModal.appendChild(tr);
        });
    }

    modal.style.display = "block";
}

function fecharModalOcultos() {
    document.getElementById("modalOcultos").style.display = "none";
}

function reexibirSelecionados() {
    const selecionados = document.querySelectorAll("input[name='reexibir']:checked");

    if (selecionados.length === 0) {
        alert("Selecione pelo menos um item para reexibir.");
        return;
    }

    selecionados.forEach(input => {
        const index = parseInt(input.value);
        if (!isNaN(index)) {
            items[index].oculto = false;
        }
    });

    setItensBD();
    loadItens();
    fecharModalOcultos();
}
