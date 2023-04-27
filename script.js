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


async function loadDetails(url) {
    let response = await fetch(url);
    let responseAsJson = await response.json();
    return responseAsJson;   
}


async function showDetails(pokemonData, pokemonId) {

    // 1 grösse
    height(pokemonData)
    //console.log('height / Grösse =',pokemonData['game_indices']['length'])
    
    // 2 gewicht
    // console.log('weight / Gewicht =',pokemonData['weight'])
    weight(pokemonData)
    
    // 3 Kategorie
    // await species(pokemonData['species']['url'])
    await species(pokemonData) 
    
    // 5Fähigkeiten
    // await abilities(pokemonData['abilities'][0]['ability']['url']);
    await ability(pokemonData);
    
    // 5 Typ
    // await type(pokemonData['types'][0]['type']['url'])
    await type(pokemonData)
    
    await descriptionText(pokemonData)
    
}

function height(pokemonData) {
    let height = pokemonData['game_indices']['length'];
    let heightInMeter = height * 0.0254;
    document.getElementById('height').innerHTML = `${heightInMeter.toFixed(1)} m`; 
    //console.log('height / Grösse =',height);
} 

function weight(pokemonData) {
    let weight = pokemonData['weight']; 
    let weightInKg = weight * 0.45359237;
    document.getElementById('weight').innerHTML = `${weightInKg.toFixed(1)} kg`; 
    console.log('weight / Gewicht =', weightInKg.toFixed(1));
}

// Kategorie
async function species(pokemonData) {
    let url = pokemonData['species']['url'];
    let detailsAsJson = await loadDetails(url);
    //let response = await fetch(url);
    //let responseAsJson = await response.json();
    //let  = responseAsJson['genera'][4]['genus'];
    let species = detailsAsJson['genera'][4]['genus'];
    document.getElementById('species').innerHTML = species; 
    console.log('species / Kategorie',species)
}

//Fähigkeiten
async function ability(pokemonData) {
    let url = pokemonData['abilities'][0]['ability']['url'];
    let detailsAsJson = await loadDetails(url);
    //let response = await fetch(url);
    //let responseAsJson = await response.json();
    
    let ability = detailsAsJson['names'][4]['name'];
    document.getElementById('ability').innerHTML = ability;
    //let abilities = await pokemonData(url); 
    console.log('abilitie / Fähigkeiten',ability)
}

// Pokemon Description Text
async function descriptionText(pokemonData) {
    let url = pokemonData['species']['url'];
    let detailsAsJson = await loadDetails(url);
    //let response = await fetch(url);
    //let responseAsJson = await response.json();
    let descriptionText = detailsAsJson['flavor_text_entries'][25]['flavor_text'];
    document.getElementById('description').innerHTML = descriptionText;
}


// Typ
async function type(pokemonData) {
    let url = pokemonData['types'][0]['type']['url'];
    let detailsAsJson = await loadDetails(url);
    //let response = await fetch(url);
    //let responseAsJson = await response.json();
    let type = detailsAsJson['names'][4]['name'];

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




