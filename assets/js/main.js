const pokemonList = document.getElementById('pokemonList')
const loadMoreButton = document.getElementById('loadMoreButton')

const maxRecords = 151
const limit = 10
let offset = 0;

function loadPokemonItens(offset, limit) {
    return fetch(`https://pokeapi.co/api/v2/pokemon?offset=${offset}&limit=${limit}`)
    .then((response) => response.json())
    .then((jsonBody) => jsonBody.results)
    .then((pokemons) => pokemons.map(pokeApi.getPokemonDetail))
    .then((detailResquests) => Promise.all(detailResquests))
    .then((pokemonsDetails) => pokemonsDetails)
    .then((pokemons = []) => {
      const newHtml = pokemons
        .map(
          (pokemon) => `
            <li class="pokemon ${pokemon.type}">
                <span class="number">#${pokemon.number}</span>
                <span class="name">${pokemon.name}</span>
                        
                <div class="detail">
                    <ol class="types">
                                ${pokemon.types
                                  .map(
                                    (type) =>
                                      `<li class="type ${type}">${type}</li>`
                                  )
                                  .join("")}
                    </ol>
        
                    <img src="${pokemon.photo}" alt="${pokemon.name}">
                </div>                
            </li>    
        `
        )
        .join("");

      pokemonList.innerHTML += newHtml;
    });
}

loadPokemonItens(offset, limit)

loadMoreButton.addEventListener('click', async () => {
    try {   
    offset += limit;    
    const qtdRecordsWithNexPage = offset + limit;

    if (qtdRecordsWithNexPage >= maxRecords) {
        const newLimit = maxRecords - offset
        await loadPokemonItens(offset, newLimit)
        addModalEventListeners();
        addPokemonEventListeners();
        loadMoreButton.parentElement.removeChild(loadMoreButton)
    } else {
        await loadPokemonItens(offset, limit);
        addModalEventListeners();
        addPokemonEventListeners();
    }    
} catch (error) {
    // Mostra uma mensagem de erro na tela ou no console
    console.error(error);
  }
});

// Função para mostrar o modal com os detalhes do pokémon
function showModal(pokemon) {
    // Obtém o elemento modal pelo seu id
    const modal = document.getElementById("modal");
    // Obtém os elementos filhos do modal pelo seu id ou pela sua classe
    const modalPhoto = document.querySelector(".modal-photo");
    const modalName = document.querySelector(".modal-name");
    const modalNumber = document.querySelector(".modal-number");
    const modalTypes = document.querySelector(".modal-types");
    // Atribui os valores das propriedades do objeto Pokemon aos atributos ou ao texto dos elementos filhos do modal
    modalPhoto.src = pokemon.photo;
    modalPhoto.alt = pokemon.name;
    modalName.textContent = pokemon.name;
    modalNumber.textContent = "#" + pokemon.number;
    modalTypes.innerHTML = pokemon.types
      .map((type) => `<li class="modal-type ${type}">${type}</li>`)
      .join("");
    // Altera o estilo do elemento modal para display: block;
    modal.style.display = "block";
  }
  
  // Função para esconder o modal
  function hideModal() {
    // Obtém o elemento modal pelo seu id
    const modal = document.getElementById("modal");
    // Altera o estilo do elemento modal para display: none;
    modal.style.display = "none";
  }
  
  // Função para adicionar os eventos de clique ao elemento close e à janela
  function addModalEventListeners() {
    // Obtém o elemento close pelo seu id ou pela sua classe
    const close = document.querySelector(".close");
    // Adiciona um evento de clique ao elemento close e passa a função hideModal como callback
    close.addEventListener("click", hideModal);
    // Adiciona um evento de clique à janela e passa uma função anônima como callback
    window.addEventListener("click", function (event) {
      // Verifica se o evento foi disparado pelo elemento modal
      if (event.target == modal) {
        // Chama a função hideModal
        hideModal();
      }
    });
  }
  
  // Função para adicionar os eventos de clique aos elementos da classe pokemon
  function addPokemonEventListeners() {
    // Obtém todos os elementos da classe pokemon
    const pokemons = document.querySelectorAll(".pokemon");
    // Itera sobre esses elementos usando um laço for ou um método forEach
    for (let pokemon of pokemons) {
      // Adiciona um evento de clique a cada elemento e passa uma função anônima como callback
      pokemon.addEventListener("click", async function () {
        // Obtém o número do pokémon pelo texto do elemento filho com a classe number
        const number = this.querySelector(".number").textContent.slice(1);
        // Usa a função pokeApi.getPokemonDetail para obter o objeto da classe Pokemon correspondente ao número
        const pokemonDetail = await pokeApi.getPokemonDetail({ url: `https://pokeapi.co/api/v2/pokemon/${number}` });
        // Usa a função showModal para mostrar o modal com os detalhes do pokémon
        showModal(pokemonDetail);
      });
    }
  }
  
  // Chama as funções addModalEventListeners e addPokemonEventListeners depois de carregar os pokémons na lista
  loadPokemonItens(offset, limit).then(() => {
    addModalEventListeners();
    addPokemonEventListeners();
  });
  
  loadMoreButton.addEventListener("click", () => {
    offset += limit
  })