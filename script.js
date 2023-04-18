let selectetPoke;


function init() {

    //showPokemon(); // pipe 2 PROVISORISCH
    loadPokemon(5)
}

function render() {
    for (let i = 0; i < 2; i++) {
        createElement(i);      
    }
}

function createElement(i) {
    document.getElementsByClassName('stage').innerHTML =  `
    `;
}




// Pipe 2 ///////////////////////////////////////////////////////
async function loadPokemon(id) {
    selectetPoke = id;
    let url = `https://pokeapi.co/api/v2/pokemon/${selectetPoke}`;
    let response = await fetch(url);
    let responseAsJson = await response.json();
    let poke = responseAsJson;
    showPokemonCard(poke);   
}

//console.log(poke['sprites']['other']['dream_world']['front_default']);

function showPokemonCard(poke) {
    // overlay anzeigen
    document.getElementById('overlay').classList.remove('d-none')
    createCardHTML(poke);
}

function createCardHTML(poke){
    document.getElementById('overlay').innerHTML = /*html*/ `
        <div class="card" id="card">
            
            <!-- Pokemon Image -->
            <img src="${poke['sprites']['other']['dream_world']['front_default']}" alt=""> 
            <!-- Pokemon Name -->
            <h2 id="name">${poke['forms'][0]['name']}</h2>






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







