

async function loadData() {
    let url = `https://pokeapi.co/api/v2/pokemon/ditto`;
    let response = await fetch(url);
    let responseAsJson = await response.json();
    let name = responseAsJson['forms'][0]['name'];
    console.log(responseAsJson);


    document.getElementById('name').innerHTML = name;
    //show image

}

function render() {
    for (let i = 0; i < 2; i++) {
        createElement(i);
        
    }
}

function createElement(i) {
    document.getElementsByClassName('stage').innerHTML =  `
    let respons = 
    
    
    
    
    `;

    

}