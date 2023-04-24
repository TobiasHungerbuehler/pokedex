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
    createCard(pokemonData, i)
}


function createCard(pokemonData, i) {
    document.getElementById('icon-container'+i).innerHTML += /*html*/ `
            <div class="card" id='card${i}'>
                <img class="icon-ball" id="icon-ball${i}" src="./img/ball2.png" alt="">
            </div>
            `;
    showCardTop(pokemonData, i)
    setBgColor(pokemonData, 'card'+i);
}


function showCardTop(pokemonData, i) {
    console.log('showCardTop= ', i)
    let pokemonName = pokemonData['forms'][0]['name'];
    let pokemonNameEdit = pokemonName.charAt(0).toUpperCase() + pokemonName.slice(1);
    let pokemonImg = pokemonData['sprites']['other']['dream_world']['front_default'];
    let pokemonId = pokemonData['id'];
    createCardTopHTML(i, pokemonNameEdit, pokemonImg, pokemonId)
}


function createCardTopHTML(i, pokemonNameEdit, pokemonImg, pokemonId) {
    console.log('showCardTop= ', i)
    document.getElementById('card'+i).innerHTML = /*html*/ `
        <div class="card-top">
            <img class="icon-pokedex-logo" src="./img/pokedex.png" alt="">
            <h1 id="name">${pokemonNameEdit}</h1>
            <img class="icon-pokemon-img" src="${pokemonImg}" alt="">
            <div  class="number-container">
                <h3># ${pokemonId}</h3>
            </div>
        </div>
    `;
}


function setBgColor(pokemonData, parent) {
    console.log(parent);
    let colorClass = pokemonData['types'][0]['type']['name'];
    for (let i = 0; i < validClasses.length; i++) {
        if (colorClass === validClasses[i]) {
            console.log(colorClass);
        document.getElementById(parent).classList.add(colorClass);

        break;}
        }   
    }

//Show Full Card ////////////////////////////////////

async function showFullCard(pokemonId) { 
    let pokemonData = await loadPokemonData(pokemonId);
    selectetPokemon = pokemonData['id'];
    showOverlay(pokemonData, pokemonId)
}


function showOverlay(pokemonData, pokemonId) {
    document.getElementById('overlay').classList.remove('d-none') 
    setBgColor(pokemonData, 'card-1');
    showCardTop(pokemonData, -2);
    showDetails(pokemonId);
}


async function showDetails(pokemonId) {
    let url = `https://pokeapi.co/api/v2/pokemon-species/${pokemonId}`;
    let response = await fetch(url);
    let responseAsJson = await response.json();
    //return responseAsJson;

    document.getElementById('description').innerHTML = responseAsJson['flavor_text_entries'][25]['flavor_text'];
    console.log(responseAsJson['flavor_text_entries'][25]['flavor_text']); // Beschreibungstext !

}

// function createCardHeader(pokemonData, pokemonId) {
//         createCard(pokemonData, pokemonId, 'overlay', 'card'+-1)
//         document.getElementById('card'+-1).classList.add('full-card');
//         document.getElementById('icon-ball'+-1).classList.add('ball-rotation');
        
//         showNavigation();
//         showDetails(selectetPokemon);

// }


// function showNavigation(){
//     document.getElementById('card-1').innerHTML += /*html*/ `

//     `;
// }


function next() {
    closeCard();
    showFullCard(selectetPokemon+1)
    console.log('next >',selectetPokemon+1)
}


function newFullCard(operator) {
    closeCard()
    if( operator == +1) {
        console.log('+1', operator)
    }
    if (operator == -1){
        console.log('-1', operator)
    }



    //showFullCard(nextPokemon);

}


function closeCard() {
    //document.getElementById('overlay').innerHTML = '';
    document.getElementById('overlay').classList.add('d-none');
    //document.getElementById('card-1').classList.remove(validClass);
    //validClass = '';
}



function errorMessage() {
    window.alert('Sorry... Pokemon nicht gefunden. Nur Englische Namen oder Zahlen verwenden')
}



function searchPokemon() {
    showFullCard('pikachu'); ///// inputfeld fehlt noch
}




