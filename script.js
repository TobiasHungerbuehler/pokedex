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
        errorMessage('Sorry... Pokemon nicht gefunden. Nur Englische Namen oder Zahlen verwenden');
        return false;
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
    let pokemonName = pokemonData['forms'][0]['name'];
    let pokemonNameEdit = pokemonName.charAt(0).toUpperCase() + pokemonName.slice(1);
    let pokemonImg = pokemonData['sprites']['other']['dream_world']['front_default'];
    let pokemonId = pokemonData['id'];
    createCardTopHTML(i, pokemonNameEdit, pokemonImg, pokemonId)
}


function createCardTopHTML(i, pokemonNameEdit, pokemonImg, pokemonId) {
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
    let colorClass = pokemonData['types'][0]['type']['name'];
    for (let i = 0; i < validClasses.length; i++) {
        if (colorClass === validClasses[i]) {
        document.getElementById(parent).classList.add(colorClass);
        break;}
        }   
    }


//Show Full Card ////////////////////////////////////

async function showFullCard(pokemonId) { 
    let pokemonData = await loadPokemonData(pokemonId);
    if(pokemonData !== false){
        
        selectetPokemon = pokemonData['id'];
        showOverlay(pokemonData, pokemonId)
        
    }
}


function showOverlay(pokemonData, pokemonId) {
    document.getElementById('overlay').classList.remove('d-none') 
    setBgColor(pokemonData, 'card-1');
    showCardTop(pokemonData, -2);
    showDetails(pokemonData, pokemonId);
}


async function showDetails(pokemonData, pokemonId) {

    // 1 grösse
    console.log('height / Grösse =',pokemonData['game_indices']['length'])
    
    // 2 gewicht
    console.log('weight / Gewicht =',pokemonData['weight'])

    // 3 Spezie / ategorie
    await species(pokemonData['species']['url'])

    // 5Fähigkeiten
    await abilities(pokemonData['abilities'][0]['ability']['url']);

    // 5 Typ
    await type(pokemonData['types'][0]['type']['url'])


    
    


    // Pokemon Description
    let url = `https://pokeapi.co/api/v2/pokemon-species/${pokemonId}`;
    let response = await fetch(url);
    let responseAsJson = await response.json();
    document.getElementById('description').innerHTML = responseAsJson['flavor_text_entries'][25]['flavor_text'];
}

//Fähigkeiten
async function abilities(url) {
    let response = await fetch(url);
    let responseAsJson = await response.json();
    let ability = responseAsJson['names'][4]['name'];// ['language'];//['short_effect'];
    console.log('abilitie / Fähigkeiten',ability)
}

//Spezie
async function species(url) {
    let response = await fetch(url);
    let responseAsJson = await response.json();
    let species = responseAsJson['genera'][4]['genus'];// ['language'];//['short_effect'];
    console.log('species / Spezie',species)
}

// Typ
async function type(url) {
    let response = await fetch(url);
    let responseAsJson = await response.json();
    let type = responseAsJson['names'][4]['name'];// ['language'];//['short_effect'];

    console.log('Type / Typ =',type)
}


function next() {
    closeCard();
    showFullCard(selectetPokemon+1)
}


function back() {
    closeCard();
    showFullCard(selectetPokemon-1)
}


function closeCard() {
    document.getElementById('overlay').classList.add('d-none');
}


function errorMessage(message) {
    window.alert(message);
}


async function searchPokemon() {
    let input = document.getElementById('input-field').value;
    if(input === '') {
        errorMessage('Bitte Pokemon eingeben. Englische Namen oder Zahlen verwenden');
    } else {
        await showFullCard(input); 
        document.getElementById('input-field').value = '';
    }  
}




