const pokemonList = document.getElementById('pokemonList')
const loadMoreButton = document.getElementById('loadMoreButton')

const maxRecords = 151
const limit = 10
let offset = 0;

function convertPokemonToLi(pokemon) {
    return `
        <li id="pokemonCard-${pokemon.number}"
            class="pokemon ${pokemon.type}"
            onclick="abrirDetalhes(${pokemon.number})">
            <span class="number">#${pokemon.number}</span>
            <span class="name">${pokemon.name}</span>

            <div class="detail">
                <ol class="types">
                    ${pokemon.types.map((type) => `<li class="type ${type}">${type}</li>`).join('')}
                </ol>

                <img src="${pokemon.photo}"
                     alt="${pokemon.name}">
            </div>
        </li>
    `
}

function loadPokemonItens(offset, limit) {
    pokeApi.getPokemons(offset, limit).then((pokemons = []) => {
        const newHtml = pokemons.map(convertPokemonToLi).join('')
        pokemonList.innerHTML += newHtml
    })
}

loadPokemonItens(offset, limit)

loadMoreButton.addEventListener('click', () => {
    offset += limit
    const qtdRecordsWithNexPage = offset + limit
    
    if (qtdRecordsWithNexPage >= maxRecords) {
        const newLimit = maxRecords - offset
        loadPokemonItens(offset, newLimit)
        
        loadMoreButton.parentElement.removeChild(loadMoreButton)
    } else {
        loadPokemonItens(offset, limit)
    }
})

function abrirDetalhes(pokemonId) {
    loadMoreButton.style.display = 'none';

    pokeApi.getPokemonDetail(pokemonId).then(pokemonDetail => {
        const detailHTML = generateDetailHTML(pokemonDetail);
        let detailContainer = document.getElementById('pokemonDetailContainer');
        if (!detailContainer) {
            detailContainer = document.createElement('div');
            detailContainer.id = 'pokemonDetailContainer';
            document.body.appendChild(detailContainer);
        }
        detailContainer.innerHTML = detailHTML
        detailContainer.classList.add('active');
    })
}

function voltarParaLista() {
    const detailContainer = document.getElementById('pokemonDetailContainer');
    if (detailContainer) {
        detailContainer.classList.remove('active');
    }

    loadMoreButton.style.display = 'block';
}

function generateDetailHTML(pokemon) {
    const getStatValue = (statName) => {
        const stat = pokemon.stats.find(s => s.name === statName);
        return stat ? stat.value : 'N/A';
    };

    const hpStat = getStatValue('hp');
    const attackStat = getStatValue('attack');
    
    return `
        <section class="pokemon-detail-page ${pokemon.type}">
            <header>
                <button class="back-button" onclick="voltarParaLista()">❮ Voltar</button>
                <h1 class="name">${pokemon.name}</h1>
                <span class="number">#${pokemon.number}</span>
            </header>

            <div class="content">
                <div class="image-area">
                    <img src="${pokemon.photo}" alt="${pokemon.name}">
                    <ol class="types">
                        ${pokemon.types.map((type) => `<li class="type ${type}">${type}</li>`).join('')}
                    </ol>
                </div>

                <div class="info-area">
                    
                    <h3>Estatísticas Base</h3>
                    <ul class="stats-list">
                        <li>HP: ${hpStat}</li>
                        <li>Attack: ${attackStat}</li>
                        </ul>
                    
                    <h3>Informações Gerais</h3>
                    <ul class="general-info">
                        <li>Altura: ${pokemon.height / 10} m</li>
                        <li>Peso: ${pokemon.weight / 10} kg</li>
                        <li>Habilidades: ${pokemon.abilities.join(', ')}</li>
                    </ul>
                </div>
            </div>
        </section>
    `;
}