let selectetPokemon;
function init() {
    renderPokedex();
}   


async function renderPokedex() {
    for (let i = 0; i <= 24; i++) {
        let pokemonData = await loadPokemonData(i +1);           
        createIconContainer(pokemonData, i)
    }
}


function createIconContainer(pokemonData, i) {
    document.getElementById('stage').innerHTML += /*html*/ `
        <div class="icon-container" id="icon-container${i}" onclick="showFullCard(${i})"></div>
    `;
    createCard(pokemonData, i, 'icon-container'+i, 'card'+i)
}


function createCard(pokemonData, i, parent, cardId) {
    let pokemonName = pokemonData['forms'][0]['name'];
    document.getElementById(parent).innerHTML += /*html*/ `
            <div class="card" id='${cardId}'>
                <img class="icon-ball" id="icon-ball${cardId.substring(4)}" src="./img/ball2.png" alt="">
                <div class="card-top">
                    <img class="icon-pokedex-logo" src="./img/pokedex.png" alt="">
                    <h1 id="name">${pokemonName.charAt(0).toUpperCase() + pokemonName.slice(1)}</h1>
                    <img class="icon-pokemon-img" src="${pokemonData['sprites']['other']['dream_world']['front_default']}" alt="">
                    <div  class="number-container">
                        <h3># ${i+1}</h3>
                    </div>
                </div>
            </div>

        `;
    setBgColor(pokemonData, i, cardId);
}


function setBgColor(pokemonData, id, parent) {
    console.log('bg parent = ', parent )
    let colorClass = pokemonData['types'][0]['type']['name'];

    if (colorClass == 'grass') {
        document.getElementById(parent).classList.add(colorClass);
    }
    if (colorClass == 'fire') {
        document.getElementById(parent).classList.add(colorClass);
    }
    if (colorClass == 'water') {
        document.getElementById(parent).classList.add(colorClass);
    }
    if (colorClass == 'bug') {
        document.getElementById(parent).classList.add(colorClass);
    }
    if (colorClass == 'normal') {
        document.getElementById(parent).classList.add(colorClass);
    }
    if (colorClass == 'poison') {
        document.getElementById(parent).classList.add(colorClass);
    }
    if (colorClass == 'electric') {
        document.getElementById(parent).classList.add(colorClass);
    }
    if (colorClass == 'ground') {
        document.getElementById(parent).classList.add(colorClass);
    }
    if (colorClass == 'fairy') {
        document.getElementById(parent).classList.add(colorClass);
    }
    if (colorClass == 'fighting') {
        document.getElementById(parent).classList.add(colorClass);
    }
    if (colorClass == 'psychic') {
        document.getElementById(parent).classList.add(colorClass);
    }  
}


async function loadPokemonData(id) {
    selectetPoke = id;
    let url = `https://pokeapi.co/api/v2/pokemon/${selectetPoke}`;
    let response = await fetch(url);
    let responseAsJson = await response.json();
    return responseAsJson;   
}

//Pipe 2
async function showFullCard(cardId) {
    let pokemonData = await loadPokemonData(cardId+1);
    selectetPokemon = cardId;
    document.getElementById('overlay').classList.remove('d-none') // overlay anzeigen
    createCard(pokemonData, cardId, 'overlay', 'card'+-1)
    document.getElementById('card'+-1).classList.add('full-card');
    document.getElementById('icon-ball'+-1).classList.add('ball-rotation');
    
    
    showNavigation();
}


function showNavigation(){
    document.getElementById('card-1').innerHTML += /*html*/ `
        <div class="card-nav">
            <button onclick="newFullCard(selectetPokemon -1)" ><</button>
            <button onclick="closeCard()" >Schliessen</button>
            <button onclick="newFullCard(selectetPokemon +1)" >></button>
        </div>
    `;
}

function newFullCard(nextPokemon) {
    closeCard()
    showFullCard(nextPokemon);

}


function closeCard() {
    document.getElementById('overlay').innerHTML = '';
    document.getElementById('overlay').classList.add('d-none');
}







