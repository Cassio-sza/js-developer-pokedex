const pokeApi = {}


function convertPokeApiDetailToPokemon(pokeDetail) {
    const pokemon = new Pokemon()
    pokemon.number = pokeDetail.id
    pokemon.name = pokeDetail.name

    const types = pokeDetail.types.map((typeSlot) => typeSlot.type.name)
    const [type] = types

    pokemon.types = types
    pokemon.type = type

    pokemon.photo = pokeDetail.sprites.other.dream_world.front_default

    return pokemon
}

pokeApi.getPokemonDetailByUrl = (pokemon) => {
    return fetch(pokemon.url)
        .then((response) => response.json())
        .then(convertPokeApiDetailToPokemon)
}

pokeApi.getPokemons = (offset = 0, limit = 5) => {
    const url = `https://pokeapi.co/api/v2/pokemon?offset=${offset}&limit=${limit}`

    return fetch(url)
        .then((response) => response.json())
        .then((jsonBody) => jsonBody.results)
        .then((pokemons) => pokemons.map(pokeApi.getPokemonDetailByUrl)) 
        .then((detailRequests) => Promise.all(detailRequests))
        .then((pokemonsDetails) => pokemonsDetails)
}

pokeApi.getPokemonDetail = (id) => {
    const url = `https://pokeapi.co/api/v2/pokemon/${id}`;
    return fetch(url)
        .then((response) => response.json())
        .then((detail) => {
            const pokemon = new Pokemon();

            pokemon.number = detail.id;
            pokemon.name = detail.name;
            pokemon.photo = detail.sprites.other.dream_world.front_default;
            pokemon.types = detail.types.map((typeSlot) => typeSlot.type.name);
            pokemon.type = pokemon.types[0];
            pokemon.height = detail.height;
            pokemon.weight = detail.weight;
            pokemon.abilities = detail.abilities.map((abilitySlot) => abilitySlot.ability.name)
            pokemon.stats = detail.stats.map((statSlot) => ({
                name: statSlot.stat.name,
                value: statSlot.base_stat
            }));
            return pokemon;
        })
}