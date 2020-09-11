//jshint esversion: 9


/*
Author: Anthony Noel
-This page is a pokemon trading card that gets info from a api and uses a follow along box for the attributes on hover

Future Dev:

-Do something different with the mouseout event
-The slideout isn't transitioning in betwen elements if theyre close
*/


//The slideout element
let slideOutElement = document.querySelector(".slideOut");


//Holds the card infos from the api call
let cards = [];


const setUpCards = async () => {
  //Grab the endpoint from each sections data-endpoint
  const sectionEndpoints = Array.from(document.querySelectorAll("section[data-endpoint]"))
    .map(section => section.dataset.endpoint);
  //Use a fetch a commmand to grab the name,type,subtype
  //Use that to make a new card object
  await sectionEndpoints.forEach(endpoint => {
    fetch(endpoint)
      .then(response => response.json())
      .then(pokemon => {

        let pokey = {
          endpoint: endpoint,
          name: `${pokemon.card.name}`,
          types: `${pokemon.card.types}`,
          subtype: `${pokemon.card.subtype}`,
          image: `${pokemon.card.imageUrlHiRes}`
        };

        //Add to the list
        cards.push(pokey);
      }).then(() => { //Change the pictures

        cards.forEach(card => {
          //Get the section with the same endpoint

          let cardHolder = document.querySelector(`section[data-endpoint="${card.endpoint}"]`);
          //Find the image child of that section and change the src to the the card's image value
          cardHolder.querySelector("img").src = `${card.image}`;
        });
      });

  });

};

//This is handler
//e.target the the one that activated the event
function displayAttribute(e) {
  //Make sure it's one of the spans with a attribute that activated the event
  if(e.target.dataset.attribute){
    //Get the section's endpoint and find the corresponding object in card

    let currentPokemon = Object.assign({}, ...cards.filter(card => card.endpoint === this.dataset.endpoint));
    //Get the data-attribute value of the e.target (if it has one)
    let attr = currentPokemon[`${e.target.dataset.attribute}`];
    //Get the bounding area of the e.target and set the slideOut span equal to it
    let targetCoords = e.target.getBoundingClientRect();
    console.log(targetCoords);
    //Add the objects data-attribute value to the slideout span
    slideOutElement.textContent = attr;
    //Width, height and location on the screen.
    slideOutElement.style.setProperty('transform',`translate(${targetCoords.left}px,${targetCoords.top}px)`);
    slideOutElement.style.setProperty('opacity',"1");
    slideOutElement.style.setProperty('width',`${targetCoords.width}px`);
    slideOutElement.style.setProperty('height',`${targetCoords.height}px`);

  }

}

function unDisplayAttribute(e) {
    //On mouseout change the dimensions of the slideout element
    //slideOutElement.style.setProperty('opacity',"0");
    // slideOutElement.style.setProperty('width',`0px`);
    // slideOutElement.style.setProperty('height',`0px`);
    // if(e.target.dataset.attribute){
    // console.log("MOUSE OUT");
    // }
    //If the slideoutelement covers it causes a mouseout
    if(slideOutElement.style.width) {
      //Add an mouse out event for the slideout slideOutElement
      slideOutElement.addEventListener("mouseout",() =>{
        //ANd if the mouse leaves that area, change the dimensions
        slideOutElement.style.setProperty('opacity',"0");
        slideOutElement.style.setProperty('width',`0px`);
        //slideOutElement.style.setProperty('height',`0px`);
      });
    }
}



const initPage = () => {
  //Use a fetch command to the setup the pokemon cards
  setUpCards();
  //Add an event listener to the sections and using event bubbling to differentiate easily between:e.target/this
  document.querySelectorAll("section[data-endpoint]").forEach(section => section.addEventListener("mouseover",displayAttribute));
  document.querySelectorAll("section[data-endpoint]").forEach(section => section.addEventListener("mouseout",unDisplayAttribute));
};

initPage();
