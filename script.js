//obtendo os elementos html
const form = document.querySelector("form");
const amount = document.getElementById("amount");
const expense = document.getElementById("expense");
const category = document.getElementById("category");

//seleciona os items da lista
const expenseList = document.querySelector("ul");
const expenseTotal = document.querySelector("aside header h2");
const expenseQuantity = document.querySelector('aside header p span');

amount.oninput = () => {
    //removendo os caracteres do input
    let value = amount.value.replace(/\D/g, "")

    //transformando o value em centavos
    value= Number(value) / 100

    //aplicando a formatacao no estilo real brasileiro
    amount.value = formatCurrencyBRL(value)
}

function formatCurrencyBRL(value) {
    //formatando o estilo da moeda BRL(real brasileiro)
    value = value.toLocaleString("pt-BR", {
        style: "currency",
        currency: "BRL",
    })

    //retornando o valor formatado
    return value
}

//captura o evento e envia o formulario 
form.onsubmit = (event) => {
    //previne o comportamento padrao de recarregar a pagina
    event.preventDefault()

    //cria um objeto com os detalhes da nova despeja
    const newExpense = {
        id: new Date().getTime(),
        expense: expense.value,
        category_id: category.value,
        category_name: category.options[category.selectedIndex].text,
        amount: amount.value,
        created_at: new Date(),
    }

    expenseAdd(newExpense)
}

//cria o item na lista
function expenseAdd(newExpense) {
    try {
        //cria o elemento(li) para adicionar para adicionar na lista(ul)
        const expenseItem = document.createElement("li");
        expenseItem.classList.add("expense");

        //cria o icone da categoria
        const expenseIcon = document.createElement("img");
        expenseIcon.setAttribute("src", `img/${newExpense.category_id}.svg`);
        expenseIcon.setAttribute("alt", newExpense.category_name);

        //cria a info da despesa
        const expenseInfo = document.createElement("div");
        expenseInfo.classList.add("expense-info");

        //cria a strong e captura o texto inserido
        const expenseName = document.createElement("strong");
        expenseName.textContent = newExpense.expense;

        //cria a span e define a categoria
        const expenseCategory= document.createElement("span");
        expenseCategory.textContent = newExpense.category_name;

        //cria o valor da despesa de acordo com o valo inserido
        const expenseAmount = document.createElement("span");
        expenseAmount.classList.add("expense-amount");
        expenseAmount.innerHTML = `<small>R$</small>${newExpense.amount.toUpperCase().replace("R$", "")}`;

        //cria o butao de remover o item
        const removeIcon = document.createElement("img")
        removeIcon.setAttribute("src", "img/remove.svg");
        removeIcon.setAttribute("alt", "butao para remover o item");
        removeIcon.classList.add("remove-icon");

        //adiciona o item a lista
        expenseInfo.append(expenseName, expenseCategory);
        expenseItem.append(expenseIcon, expenseInfo, expenseAmount, removeIcon);
        expenseList.append(expenseItem);

        clearForm()
        updateTotals()
    } catch (error) {
        console.log(error)
        alert("Nao foi possivel atualizar a pagina, tente novamente mais tarde")
    }
}

// autaliza a quanatidade de itens
function updateTotals() {
    try {
        const items = expenseList.children
        expenseQuantity.textContent = ` ${items.length} ${items.length > 1 ? "despesas" : "despesa"}`;

        //variavel para incrementar o total
        let total = 0

        //percorre cada item(li) da lista(ul
        for(let item = 0; item < items.length; item++){
            const itemAmount = items[item].querySelector(".expense-amount");

            //remove caracteres nao numericos e substitui a virgula pelo ponto
            let value = itemAmount.textContent.replace(/[^\d,]/g, "").replace(",",".");

            value = parseFloat(value)

            if(isNaN(value)){
                return alert("nao foi possivel calcular o total, o valor nao parecer ser um numero")
            }

            //inplementa o total
            total += Number(value)
        }


        //formata o valor no estilo bRL e remove o cifrao da funcao
        total = formatCurrencyBRL(total).toUpperCase().replace("R$", "")

        //limpa o conteudo html
        expenseTotal.innerHTML = `<small>R$</small>${total}`


    } catch (error) {
        console.log(error)
        alert("nao foi possivel atualizar os itens")
    }
}

expenseList.addEventListener("click", function(event){
    if(event.target.classList.contains("remove-icon")){
        //selecionado o elemento pai mais proximo
        const item = event.target.closest(".expense");

        //remove o item
        item.remove()

        //atualiza os itens restantes
        updateTotals()
    }
})

function clearForm() {
//imppa o formulario
amount.value = ""
expense.value = ""
category.value = ""

//deixa em destaque o inout da despesa
expense.focus()
}