let selectetPoke;
function init() {
    renderPokedex();
}


async function renderPokedex() {
    for (let i = 0; i < 70; i++) {
        let pokemon = await loadPokemon(i +1);           
        createIcon(pokemon, i)
    }
}


function createIcon(pokemon, id) {
    document.getElementById('stage').innerHTML += /*html*/ `
        <div class="icon-container">
            <div class="icon" id='icon${id}'>
                <img class="icon-ball" src="./img/ball2.png" alt="">

                <div class="icon-inlay">
                    <!-- Pokemon Logo -->
                    <img class="icon-pokedex-logo" src="./img/pokedex.png" alt="">
                    <!-- Pokemon Name -->
                    <h1 id="name">${pokemon['forms'][0]['name']}</h1>
                    <!-- Pokemon Image Original -->
                    <img class="icon-pokemon-img" src="${pokemon['sprites']['other']['dream_world']['front_default']}" alt="">
                    <!-- Chart Number -->
                    <div  class="number-container">
                        <h3># ${id}</h3>
                    </div>

                </div>
      

            </div>
        </div>
        `;
    setBgColor(pokemon, id);
}


function setBgColor(pokemon, id) {
    let colorClass = pokemon['types'][0]['type']['name'];

    if (colorClass == 'grass') {
        document.getElementById('icon'+id).classList.add(colorClass);
    }
    if (colorClass == 'fire') {
        document.getElementById('icon'+id).classList.add(colorClass);
    }
    if (colorClass == 'water') {
        document.getElementById('icon'+id).classList.add(colorClass);
    }
    if (colorClass == 'bug') {
        document.getElementById('icon'+id).classList.add(colorClass);
    }
    if (colorClass == 'normal') {
        document.getElementById('icon'+id).classList.add(colorClass);
    }
    if (colorClass == 'poison') {
        document.getElementById('icon'+id).classList.add(colorClass);
    }
    if (colorClass == 'electric') {
        document.getElementById('icon'+id).classList.add(colorClass);
    }
    if (colorClass == 'ground') {
        document.getElementById('icon'+id).classList.add(colorClass);
    }
    if (colorClass == 'fairy') {
        document.getElementById('icon'+id).classList.add(colorClass);
    }
    if (colorClass == 'fighting') {
        document.getElementById('icon'+id).classList.add(colorClass);
    }
    if (colorClass == 'psychic') {
        document.getElementById('icon'+id).classList.add(colorClass);
    }  
}




// Pipe 2 ///////////////////////////////////////////////////////
async function loadPokemon(id) {
    selectetPoke = id;
    let url = `https://pokeapi.co/api/v2/pokemon/${selectetPoke}`;
    let response = await fetch(url);
    let responseAsJson = await response.json();
    return responseAsJson;   
}

//console.log(poke['sprites']['other']['dream_world']['front_default']);

async function showPokemonCard(pokeId) {
    let pokemon = await loadPokemon(pokeId);
    // overlay anzeigen
    document.getElementById('overlay').classList.remove('d-none')
    createCardHTML(pokemon);
}

function createCardHTML(pokemon){
    document.getElementById('overlay').innerHTML = /*html*/ `
        <div class="card" id="card">
            
            <!-- Pokemon Image -->
            <img src="${pokemon['sprites']['other']['dream_world']['front_default']}" alt=""> 
            <!-- Pokemon Name -->
            <h2 id="name">${pokemon['forms'][0]['name']}</h2>






            <div class="card-nav">
                <button onclick="loadPokemon(selectetPoke -1)" ><</button>
                <button onclick="closeCard()" >Schliessen</button>
                <button onclick="loadPokemon(selectetPoke +1)" >></button>
            </div>
        </div>
    
    
    `;

}






function closeCard() {
    document.getElementById('overlay').innerHTML = '';
    document.getElementById('overlay').classList.add('d-none');
}







