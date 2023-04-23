let selectetPokemon;
let validClasses = ['grass', 'fire', 'water', 'bug', 'normal', 'poison', 'electric', 'ground', 'fairy', 'fighting', 'psychic'];


function init() {
    document.getElementById('stage').innerHTML = '';
    renderPokedex();
}   


async function renderPokedex() {
    for (let i = 0; i <= 24; i++) {
        let pokemonData = await loadPokemonData(i +1);           
        createIconContainer(pokemonData, i)
    }
}


async function loadPokemonData(pokemonId) {
    let url = `https://pokeapi.co/api/v2/pokemon/${pokemonId}`;
    let response = await fetch(url);
    if (!response.ok) {
        errorMessage();
        } else {
            let responseAsJson = await response.json();
            return responseAsJson;   
        }
}


function createIconContainer(pokemonData, i) {
    document.getElementById('stage').innerHTML += /*html*/ `
        <div class="icon-container" id="icon-container${i}" onclick="showFullCard(${i+1})"></div>
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
                        <h3># ${pokemonData['id']}</h3>
                    </div>
                </div>
            </div>
        `;
    setBgColor(pokemonData, cardId);
    console.log(cardId)
}


function setBgColor(pokemonData, parent) {
    const colorClass = pokemonData['types'][0]['type']['name'];
    for (let i = 0; i < validClasses.length; i++) {
        if (colorClass === validClasses[i]) {
        document.getElementById(parent).classList.add(colorClass);
        break;}
        }   
    }


// function setBgColor2(pokemonData,  parent) {
//     let colorClass = pokemonData['types'][0]['type']['name'];

//     if (colorClass == 'grass') {
//         document.getElementById(parent).classList.add(colorClass);
//     }
//     if (colorClass == 'fire') {
//         document.getElementById(parent).classList.add(colorClass);
//     }
//     if (colorClass == 'water') {
//         document.getElementById(parent).classList.add(colorClass);
//     }
//     if (colorClass == 'bug') {
//         document.getElementById(parent).classList.add(colorClass);
//     }
//     if (colorClass == 'normal') {
//         document.getElementById(parent).classList.add(colorClass);
//     }
//     if (colorClass == 'poison') {
//         document.getElementById(parent).classList.add(colorClass);
//     }
//     if (colorClass == 'electric') {
//         document.getElementById(parent).classList.add(colorClass);
//     }
//     if (colorClass == 'ground') {
//         document.getElementById(parent).classList.add(colorClass);
//     }
//     if (colorClass == 'fairy') {
//         document.getElementById(parent).classList.add(colorClass);
//     }
//     if (colorClass == 'fighting') {
//         document.getElementById(parent).classList.add(colorClass);
//     }
//     if (colorClass == 'psychic') {
//         document.getElementById(parent).classList.add(colorClass);
//     }  
// }


//Show Full Card ////////////////////////////////////

async function showFullCard(pokemonId) { 
    let pokemonData = await loadPokemonData(pokemonId);
    selectetPokemon = pokemonData['id'];
    showOverlay(pokemonData, pokemonId)
}


function showOverlay(pokemonData, pokemonId) {
    document.getElementById('overlay').classList.remove('d-none') 
    //createCardHeader(pokemonData, pokemonId)

    setBgColor(pokemonData, 'card-1');
}


function createCardHeader(pokemonData, pokemonId) {
        createCard(pokemonData, pokemonId, 'overlay', 'card'+-1)
        document.getElementById('card'+-1).classList.add('full-card');
        document.getElementById('icon-ball'+-1).classList.add('ball-rotation');
        
        showNavigation();
        showDetails(selectetPokemon);

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


async function showDetails(selectetPokemon) {
    let url = `https://pokeapi.co/api/v2/pokemon-species/${selectetPokemon}`;
    let response = await fetch(url);
    let responseAsJson = await response.json();
    //return responseAsJson;
    console.log(responseAsJson['flavor_text_entries'][25]['flavor_text']); // Beschreibungstext !

}


function newFullCard(nextPokemon) {
    closeCard()
    showFullCard(nextPokemon);

}


function closeCard() {
    document.getElementById('overlay').innerHTML = '';
    document.getElementById('overlay').classList.add('d-none');
}



function errorMessage() {
    window.alert('Sorry... Pokemon nicht gefunden. Nur Englische Namen oder Zahlen verwenden')
}



function searchPokemon() {
    showFullCard('pikachu'); ///// inputfeld fehlt noch
}




