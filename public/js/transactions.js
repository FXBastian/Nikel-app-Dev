const myModal = new bootstrap.Modal("#transactions-modal");
let logged = sessionStorage.getItem("logged");
const session = localStorage.getItem("session");

let data = {
  transactions: [],
};

document.getElementById("button-logout").addEventListener("click", logout);

// ADCIONAR LANÇAMENTO
document
  .getElementById("transactions-form")
  .addEventListener("submit", function (e) {
    e.preventDefault();

    const value = parseFloat(document.getElementById("value-input").value);
    const description = document.getElementById("description-input").value;
    const date = document.getElementById("date-input").value;
    const type = document.querySelector(
      'input[name="type-input"]:checked'
    ).value;

    
    // CALCULAR SALDO
    const currentBalance = calculateCurrentBalance();

    // VERIFICAR  SALDO NEGATIVO.......
    if (type === "2" && currentBalance - value < 0) {
      if (!confirm("O saldo ficará negativo. Deseja continuar?")) {
        return; 
      }
    }

    data.transactions.unshift({
      value: value,
      type: type,
      description: description,
      date: date
    });

    saveData(data);
    e.target.reset();
    myModal.hide();

    getTransactions();

    alert("Lançamento adicionado com sucesso.");
  });

checkLogged();

function checkLogged() {
  if (session) {
    sessionStorage.setItem("logged", session);
    logged = session;
  }
  if (!logged) {
    window.location.href = "index.html";
    return;
  }

  const dataUser = localStorage.getItem(logged);
  if (dataUser) {
    data = JSON.parse(dataUser);
  }

  getTransactions();
}

function logout() {
  sessionStorage.removeItem("logged");
  localStorage.removeItem("session");

  window.location.href = "index.html";
}

// CALCULAR SALDO.............
function calculateCurrentBalance() {
  const transactions = data.transactions;
  let total = 0;

  transactions.forEach((item) => {
    if (item.type === "1") {
      total += item.value;
    } else {
      total -= item.value;
    }
  });

  return total;
}

function getTransactions() {
  const transactions = data.transactions;
  let transactionsHtml = ``;

  if (transactions.length) {
    transactions.forEach((item) => {
      let type = "Entrada";

      if (item.type === "2") {
        type = "Saída";
      }

      transactionsHtml += `
        <tr>
            <th scope="row">${item.date}</th>
            <td>${item.value.toFixed(2)}</td>
            <td>${type}</td>
            <td>${item.description}</td>
        </tr>
      `;
    });
  }
  document.getElementById("transactions-list").innerHTML = transactionsHtml;
}

function saveData(data) {
  localStorage.setItem(data.login, JSON.stringify(data));
}

// FUNÇÃO PARA DELETAR DADOS DA TABELA TRANSACTIONS........
function deleteTransaction(index) {
  
  data.transactions.splice(index, 1);


  saveData(data);

  
  getTransactions();
}


function getTransactions() {
  const transactions = data.transactions;
  let transactionsHtml = ``;

  transactions.forEach((item, index) => {
      let type = "Entrada";
      if (item.type === "2") {
          type = "Saída";
      }

      transactionsHtml += `
          <tr>
              <th scope="row">${item.date}</th>
              <td>${item.value.toFixed(2)}</td>
              <td>${type}</td>
              <td>${item.description}</td>
              <td><button class="btn btn-sm btn-danger delete-button" data-index="${index}">Excluir</button></td>
          </tr>
      `;
  });

  document.getElementById("transactions-list").innerHTML = transactionsHtml;


  document.querySelectorAll('.delete-button').forEach(button => {
      button.addEventListener('click', function() {
          const index = parseInt(this.dataset.index);
          deleteTransaction(index);
      });
  });
}


getTransactions();

