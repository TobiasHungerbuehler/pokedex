let selectetPokemon;
let colorClass;
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
        try {
            let response = await fetch(url);
            let responseAsJson = await response.json();
            return responseAsJson;
        } catch {
            errorMessage('Sorry... Pokemon nicht gefunden. Nur Englische Namen oder Zahlen verwenden');
            return false;
        }

}

// async function loadPokemonData2(pokemonId) {
//     let url = `https://pokeapi.co/api/v2/pokemon/${pokemonId}`;
//     let response = await fetch(url);
//     if (!response.ok) {
//         errorMessage('Sorry... Pokemon nicht gefunden. Nur Englische Namen oder Zahlen verwenden');
//         return false;
//         } else {
//             let responseAsJson = await response.json();
//             return responseAsJson;   
//         }
// }


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
    document.getElementById('card'+i).innerHTML += /*html*/ `
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
    colorClass = pokemonData['types'][0]['type']['name'];
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
        try {
            let responseAsJson = await response.json();
            return responseAsJson;   
        } catch {
            errorMessage('Es ist ein Fehler aufgetreten');
            return false;
        }
}


async function showDetails(pokemonData, pokemonId) {
    height(pokemonData)
    weight(pokemonData)
    await species(pokemonData) 
    await ability(pokemonData);
    await getType(pokemonData)
    await descriptionText(pokemonData)
    stats(pokemonData)
}


function height(pokemonData) {
    let height = pokemonData['game_indices']['length'];
    let heightInMeter = height * 0.0254;
    document.getElementById('height').innerHTML = `${heightInMeter.toFixed(1)} m`; 
} 


function weight(pokemonData) {
    let weight = pokemonData['weight']; 
    let weightInKg = weight * 0.45359237;
    document.getElementById('weight').innerHTML = `${weightInKg.toFixed(1)} kg`; 
}


async function species(pokemonData) {
    let url = pokemonData['species']['url'];
    let detailsAsJson = await loadDetails(url);
    let species = detailsAsJson['genera'][4]['genus'];
    document.getElementById('species').innerHTML = species; 
}


async function ability(pokemonData) {
    let url = pokemonData['abilities'][0]['ability']['url'];
    let detailsAsJson = await loadDetails(url);
    let ability = detailsAsJson['names'][4]['name'];
    document.getElementById('ability').innerHTML = ability;
}


async function descriptionText(pokemonData) {
    let url = pokemonData['species']['url'];
    let detailsAsJson = await loadDetails(url);
    let descriptionText = detailsAsJson['flavor_text_entries'][25]['flavor_text'];
    document.getElementById('description').innerHTML = descriptionText;
}

async function getType(pokemonData) {    
    let types = pokemonData['types'];
    for (let i = 0; i < types.length; i++) {
        const type = types[i]['type']['name'];
        const typeUrl = types[i]['type']['url'];
        let typeAsJson = await loadDetails(typeUrl);
        let typeGerman = typeAsJson['names'][4]['name'];
        createTypeHTML(type, typeGerman, i)
    }
}

function createTypeHTML(type, typeGerman, i){
    document.getElementById('type-container').innerHTML += /*html*/ `
        <div class="type ${type}" id="type${i}">${typeGerman}</div>
    `;   
}


function stats(pokemonData) {
    let kp = pokemonData['stats'][0]['base_stat'];
    let attack = pokemonData['stats'][1]['base_stat'];
    let defense = pokemonData['stats'][2]['base_stat'];
    let spAtack = pokemonData['stats'][3]['base_stat'];
    let spDefense = pokemonData['stats'][4]['base_stat'];
    let speed = pokemonData['stats'][5]['base_stat'];
    pokemonChart(kp, attack, defense, spAtack, spDefense, speed);
}



function pokemonChart(kp, attack, defense, spAtack, spDefense, speed) {
    const ctx = document.getElementById('chart');
    new Chart(ctx, {
        plugins: [ChartDataLabels],
        type: 'bar',
        data: {
            labels: ['KP', 'Angriff', 'Vert.', 'Sp-Angr.', 'SP-Vert.', 'Initiative'],
        datasets: [{
            label: '',
            data: [kp, attack, defense, spAtack, spDefense, speed],
            backgroundColor: ['#FBCB04'],
        }]
    },
      options: {
        scales: {
            y: {
            display: false
          },
          x: {
              grid: {
                  drawOnChartArea: false
            }
          }
        },
        plugins: {   
          legend: {
            display: false
        },
          datalabels: {
            anchor: 'end',
            align: 'bottom',
            color: 'black',
            font: {
              font: 'bold',
            }
        }
    }
}
});
}


function destroyPokemonChart() {
    const chart = Chart.getChart("chart");
    if (chart) {
      chart.destroy();
    }
  }


function next() {
    closeCard();
    showFullCard(selectetPokemon+1)
}


function back() {
    closeCard();
    if(selectetPokemon !== 1) {
        showFullCard(selectetPokemon-1)
    }
}


function showContainer(id) {
    hideContainers()
    document.getElementById(id).classList.remove('d-none')
}


function hideContainers() {
    document.getElementById('description-container').classList.add('d-none')
    document.getElementById('chart-container').classList.add('d-none')
    document.getElementById('details-container').classList.add('d-none')
}


function closeCard() {
    document.getElementById('card-1').classList.remove(colorClass);
    document.getElementById('card-2').innerHTML = '';
    document.getElementById('type-container').innerHTML = '';
    destroyPokemonChart()
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




