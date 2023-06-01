let selectetPokemon;
let colorClass;
let validClasses = ['grass', 'fire', 'water', 'bug', 'normal', 'poison', 'electric', 'ground', 'fairy', 'fighting', 'psychic'];
let startIndex = 0; 
let count = 25; 

/**
 * Initializes the Pokedex by rendering the initial set of Pokemon icons.
 */
function init() {
    document.getElementById('stage').innerHTML = '';
    renderPokedex(startIndex, count);
}   


/**
 * Renders the initial set of Pokemon icons in the Pokedex.
 */
async function renderPokedex(startIndex, count) {
    for (let i = startIndex; i <= count-1; i++) {
        let pokemonData = await loadPokemonData(i +1);           
        createIconContainer(pokemonData, i)
    }
}


/**
 * Loads and renders the next set of Pokemon in the Pokedex.
 */
function loadMore(){
    startIndex = startIndex +25;
    count = count +25;
    renderPokedex(startIndex, count)
}


/**
 * Renders the next set of Pokemon icons in the Pokedex.
 * @param {number} startIndex - The starting index for loading the next set of Pokemon.
 * @param {number} count - The number of Pokemon to load.
 */
async function renderNextPokedexSet(startIndex, count) {
    for (let i = startIndex; i < startIndex + count; i++) {
      let pokemonData = await loadPokemonData(i + 1);
      createIconContainer(pokemonData, i);
    }
  }
  


/**
 * Loads the data for a specific Pokemon.
 * @param {number} pokemonId - The ID of the Pokemon to load.
 * @returns {Promise} A Promise that resolves to the Pokemon data.
 */
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


/**
 * Creates an icon container for a Pokemon.
 * @param {Object} pokemonData - The data of the Pokemon.
 * @param {number} i - The index of the icon container.
 */
function createIconContainer(pokemonData, i) {
    document.getElementById('stage').innerHTML += /*html*/ `
        <div class="icon-container" id="icon-container${i}" onclick="showFullCard(${i+1})"></div>
    `;
    createCard(pokemonData, i)
}


/**
 * Creates a card for a Pokemon.
 * @param {Object} pokemonData - The data of the Pokemon.
 * @param {number} i - The index of the card.
 */
function createCard(pokemonData, i) {
    document.getElementById('icon-container'+i).innerHTML += /*html*/ `
            <div class="card" id='card${i}'>
                <img class="icon-ball" id="icon-ball${i}" src="./img/ball2.png" alt="">
            </div>
            `;
    showCardTop(pokemonData, i)
    setBgColor(pokemonData, 'card'+i);
}


/**
 * Shows the top section of a Pokemon card.
 * @param {Object} pokemonData - The data of the Pokemon.
 * @param {number} i - The index of the card.
 */
function showCardTop(pokemonData, i) {
    let pokemonName = pokemonData['forms'][0]['name'];
    let pokemonNameEdit = pokemonName.charAt(0).toUpperCase() + pokemonName.slice(1);
    let pokemonImg = pokemonData['sprites']['other']['dream_world']['front_default'];
    let pokemonId = pokemonData['id'];
    createCardTopHTML(i, pokemonNameEdit, pokemonImg, pokemonId)
}


/**
 * Creates the HTML content for the top section of a Pokemon card.
 * @param {number} i - The index of the card.
 * @param {string} pokemonNameEdit - The edited name of the Pokemon.
 * @param {string} pokemonImg - The URL of the Pokemon's image.
 * @param {number} pokemonId - The ID of the Pokemon.
 */
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


/**
 * Sets the background color of a Pokemon card based on its type.
 * @param {Object} pokemonData - The data of the Pokemon.
 * @param {string} parent - The ID of the parent element.
 */
function setBgColor(pokemonData, parent) {
    colorClass = pokemonData['types'][0]['type']['name'];
    for (let i = 0; i < validClasses.length; i++) {
        if (colorClass === validClasses[i]) {
        document.getElementById(parent).classList.add(colorClass);
        break;}
        }   
    }


//Show Full Card ////////////////////////////////////


/**
 * Shows the full card for a selected Pokemon.
 * @param {number} pokemonId - The ID of the selected Pokemon.
 */
async function showFullCard(pokemonId) { 
    let pokemonData = await loadPokemonData(pokemonId);
    if(pokemonData !== false){
        selectetPokemon = pokemonData['id'];
        showOverlay(pokemonData, pokemonId)
    }
}


/**
 * Shows the overlay and initializes the full card view for a Pokemon.
 * @param {Object} pokemonData - The data of the Pokemon.
 * @param {number} pokemonId - The ID of the Pokemon.
 */
function showOverlay(pokemonData, pokemonId) {
    document.getElementById('overlay').classList.remove('d-none') 
    setBgColor(pokemonData, 'card-1');
    showCardTop(pokemonData, -2);
    showDetails(pokemonData, pokemonId);
}


/**
 * Loads additional details from a given URL.
 * @param {string} url - The URL to fetch the details from.
 * @returns {Promise} A Promise that resolves to the details as JSON.
 */
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


/**
 * Loads additional details of a Pokemon and updates the full card view.
 * @param {Object} pokemonData - The data of the Pokemon.
 * @param {number} pokemonId - The ID of the Pokemon.
 */
async function showDetails(pokemonData, pokemonId) {
    height(pokemonData)
    weight(pokemonData)
    await species(pokemonData) 
    await ability(pokemonData);
    await getType(pokemonData)
    await descriptionText(pokemonData)
    stats(pokemonData)
}


/**
 * Retrieves and displays the height of a Pokemon.
 * @param {Object} pokemonData - The data of the Pokemon.
 */
function height(pokemonData) {
    let height = pokemonData['game_indices']['length'];
    let heightInMeter = height * 0.0254;
    document.getElementById('height').innerHTML = `${heightInMeter.toFixed(1)} m`; 
} 


/**
 * Retrieves and displays the weight of a Pokemon.
 * @param {Object} pokemonData - The data of the Pokemon.
 */
function weight(pokemonData) {
    let weight = pokemonData['weight']; 
    let weightInKg = weight * 0.45359237;
    document.getElementById('weight').innerHTML = `${weightInKg.toFixed(1)} kg`; 
}


/**
 * Retrieves and displays the species of a Pokemon.
 * @param {Object} pokemonData - The data of the Pokemon.
 */
async function species(pokemonData) {
    let url = pokemonData['species']['url'];
    let detailsAsJson = await loadDetails(url);
    let species = detailsAsJson['genera'][4]['genus'];
    document.getElementById('species').innerHTML = species; 
}


/**
 * Retrieves and displays the ability of a Pokemon.
 * @param {Object} pokemonData - The data of the Pokemon.
 */
async function ability(pokemonData) {
    let url = pokemonData['abilities'][0]['ability']['url'];
    let detailsAsJson = await loadDetails(url);
    let ability = detailsAsJson['names'][4]['name'];
    document.getElementById('ability').innerHTML = ability;
}


/**
 * Retrieves and displays the description of a Pokemon.
 * @param {Object} pokemonData - The data of the Pokemon.
 */
async function descriptionText(pokemonData) {
    let url = pokemonData['species']['url'];
    let detailsAsJson = await loadDetails(url);
    let descriptionText = detailsAsJson['flavor_text_entries'][25]['flavor_text'];
    document.getElementById('description').innerHTML = descriptionText;
}


/**
 * Retrieves and displays the types of a Pokemon.
 * @param {Object} pokemonData - The data of the Pokemon.
 */
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


/**
 * Creates an HTML element for a Pokemon type.
 * @param {string} type - The type of the Pokemon.
 * @param {string} typeGerman - The German translation of the type.
 * @param {number} i - The index of the type element.
 */
function createTypeHTML(type, typeGerman, i){
    document.getElementById('type-container').innerHTML += /*html*/ `
        <div class="type ${type}" id="type${i}">${typeGerman}</div>
    `;   
}


/**
 * Retrieves and displays the stats of a Pokemon.
 * @param {Object} pokemonData - The data of the Pokemon.
 */
function stats(pokemonData) {
    let kp = pokemonData['stats'][0]['base_stat'];
    let attack = pokemonData['stats'][1]['base_stat'];
    let defense = pokemonData['stats'][2]['base_stat'];
    let spAtack = pokemonData['stats'][3]['base_stat'];
    let spDefense = pokemonData['stats'][4]['base_stat'];
    let speed = pokemonData['stats'][5]['base_stat'];
    pokemonChart(kp, attack, defense, spAtack, spDefense, speed);
}

/**
 * Creates a Pokemon chart and displays the Pokemon's stats.
 * @param {number} kp - The KP (Hit Points) stat of the Pokemon.
 * @param {number} attack - The Attack stat of the Pokemon.
 * @param {number} defense - The Defense stat of the Pokemon.
 * @param {number} spAtack - The Special Attack stat of the Pokemon.
 * @param {number} spDefense - The Special Defense stat of the Pokemon.
 * @param {number} speed - The Speed stat of the Pokemon.
 */
function pokemonChart(kp, attack, defense, spAtack, spDefense, speed) {
    const ctx = document.getElementById('chart');
    createChart(ctx, createChartData(kp, attack, defense, spAtack, spDefense, speed));
}
  


/**
 * Creates the chart data for the Pokemon chart.
 * @param {number} kp - The KP (Hit Points) stat of the Pokemon.
 * @param {number} attack - The Attack stat of the Pokemon.
 * @param {number} defense - The Defense stat of the Pokemon.
 * @param {number} spAtack - The Special Attack stat of the Pokemon.
 * @param {number} spDefense - The Special Defense stat of the Pokemon.
 * @param {number} speed - The Speed stat of the Pokemon.
 * @returns {Object} The chart data object.
 */
function createChartData(kp, attack, defense, spAtack, spDefense, speed) {
return {
    labels: ['KP', 'Angriff', 'Vert.', 'Sp-Angr.', 'SP-Vert.', 'Initiative'],
    datasets: [{
    data: [kp, attack, defense, spAtack, spDefense, speed],
    backgroundColor: ['#FBCB04'],
    }]
};
}
  

/**
 * Creates a new chart using Chart.js.
 * @param {HTMLElement} ctx - The canvas element to render the chart.
 * @param {Object} chartData - The data for the chart.
 */
function createChart(ctx, chartData) {
new Chart(ctx, {
    plugins: [ChartDataLabels],
    type: 'bar',
    data: chartData,
    options: createChartOptions()
});
}

/**
 * Creates the chart options for the Pokemon chart.
 * @returns {Object} The chart options object.
 */
function createChartOptions() {
    const scales = createScalesOptions();
    const plugins = createPluginsOptions();

    return {
        scales,
        plugins
    };
}


/**
 * Creates the scales options for the Pokemon chart.
 * @returns {Object} The scales options object.
 */
function createScalesOptions() {
return {
    y: {
    display: false
    },
    x: createXOptions()
};
}


/**
 * Creates the X-axis options for the Pokemon chart.
 * @returns {Object} The X-axis options object.
 */
function createXOptions() {
return {
    grid: {
    drawOnChartArea: false
    }
};
}


/**
 * Creates the plugins options for the Pokemon chart.
 * @returns {Object} The plugins options object.
 */
function createPluginsOptions() {
return {
    legend: {
    display: false
    },
    datalabels: createDataLabelsOptions()
};
}


/**
 * Creates the data labels options for the Pokemon chart.
 * @returns {Object} The data labels options object.
 */
function createDataLabelsOptions() {
return {
    anchor: 'end',
    align: 'bottom',
    color: 'black',
    font: {
    font: 'bold'
    }
};
}
  
  
/**
 * Destroys the Pokemon chart if it exists.
 */
function destroyPokemonChart() {
    const chart = Chart.getChart("chart");
    if (chart) {
      chart.destroy();
    }
}


/**
 * Shows the next Pokemon in the full card view.
 */
function next() {
    closeCard();
    showFullCard(selectetPokemon+1)
}


/**
 * Shows the previous Pokemon in the full card view.
 */
function back() {
    closeCard();
    if(selectetPokemon !== 1) {
        showFullCard(selectetPokemon-1)
    }
}


/**
 * Shows a specific container in the full card view.
 * @param {string} id - The ID of the container to show.
 */
function showContainer(id) {
    hideContainers()
    document.getElementById(id).classList.remove('d-none')
}


/**
 * Hides all containers in the full card view.
 */
function hideContainers() {
    document.getElementById('description-container').classList.add('d-none')
    document.getElementById('chart-container').classList.add('d-none')
    document.getElementById('details-container').classList.add('d-none')
}


/**
 * Closes the full card view of a Pokemon.
 */
function closeCard() {
    document.getElementById('card-1').classList.remove(colorClass);
    document.getElementById('card-2').innerHTML = '';
    document.getElementById('type-container').innerHTML = '';
    destroyPokemonChart()
    document.getElementById('overlay').classList.add('d-none');
}


/**
 * Displays an error message in an alert.
 * @param {string} message - The error message to display.
 */
function errorMessage(message) {
    window.alert(message);
}


/**
 * Searches for a Pokemon based on user input.
 */
async function searchPokemon() {
    let input = document.getElementById('input-field').value;
    if(input === '') {
        errorMessage('Bitte Pokemon eingeben. Englische Namen oder Zahlen verwenden');
    } else {
        await showFullCard(input); 
        document.getElementById('input-field').value = '';
    }  
}


/**
 * Prevents the full card from closing when an event occurs.
 */
function doNotClose(event) {
	event.stopPropagation();
}




