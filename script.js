//You can edit ALL of the code here

import { getAllEpisodes } from "./episodes.js"; // import all of the episodes in the getAllEpisodes function.

function setup() {
  // initialize all of the episodes in the getAllEpisodes function by assigning the function to a variable called allEpisodes
  const allEpisodes = getAllEpisodes();

  //Modification-below: 060425
  const searchBox = document.querySelector("#search-box");
  const resultCount = document.querySelector("#result-count");
  //Stop
  makePageForEpisodes(allEpisodes); // passing allEpisodes as a parameter to the getAllEpisodes function when makePageForEpisodes is called.

//Modification: 060425
resultCount.textContent = `${allEpisodes.length} episode(s) found`;

searchBox.addEventListener("input", () => {
  const searchTerm = searchBox.value.toLowerCase().trim();
  const filtered = filterEpisodes(allEpisodes, searchTerm);

  makePageForEpisodes(filtered);
  resultCount.textContent = `${filtered.length} episode(s) found`;

});




}



function filterEpisodes(films, searchTerm) {
  return films.filter(film =>
    film.name.toLowerCase().includes(searchTerm) ||
    film.summary.toLowerCase().includes(searchTerm)
  );
}

//Stop

function makePageForEpisodes(episodeList) {
  // created a function called when makePageForEpisodes to execute and preview the page for the given episode list in the web page
  const rootElem = document.getElementById("root"); // get the root element id from the html file.
  // Modification-below: 060425
  rootElem.innerHTML = "";
  // Stop

  const episodeCount = document.createElement("div"); // created a div to hold the number of episodes in the web page
  episodeCount.classList.add("page-count"); // created a class inside the div to hold the number of episode on the webpage
  episodeCount.textContent = `Got ${episodeList.length} episode(s)`; // implemented template literal to display the number of episodes.

  rootElem.appendChild(episodeCount); // append the child element to the parent element which o the rootElem.

  episodeList.forEach((episode) => {
    // implemented a forEach method to iterate over the episodes in the web page
    const episodeElem = document.createElement("div"); // implemented a div element
    episodeElem.classList.add("episode"); // implemented a class element for styling purposes..

    const episodeTitle = document.createElement("h2"); // in other to get the name,season, and number we implemented an h2 element while using template literal in other to combine the season and number with zero padded characters of 2 digits.
    episodeTitle.textContent = `${episode.name} S${episode.season // converted to string and then padStart the season and number using padStart method.
      .toString()
      .padStart(2, "0")} E${episode.number.toString().padStart(2, "0")}`;

    const image = document.createElement("img"); // created an img element in other to display the image of each episodes
    image.src = episode.image.medium; // we style the src to be medium bu implement a style properties.

    const summary = document.createElement("p"); // created a p element for the summary of each episode
    summary.innerHTML = episode.summary; // we change the innerHTML to get the text of each episode summary. some people would use textContent but in decided to go with InnerHTML

    episodeElem.appendChild(episodeTitle); // append episodeTitle to it parent which is episodeElem
    episodeElem.appendChild(image); // append image to it parent which is episodeElem
    episodeElem.appendChild(summary); // append the summary to it parent variable which is episodeElem

    rootElem.appendChild(episodeElem); // append the episodeElem which is the parent to the grandparent element.
  });

  // const source = document.createElement("p");
  // source.innerHTML = `Data Originally from: <a href="https://api.tvmaze.com/shows/1/episodes"></a>`;

  // const link = document.createElement("a");
  // link.href = "https://www.tvmaze.com/";
  // link.textContent = "TVmaze.com";

  // source.appendChild(link);

  // rootElem.appendChild(source);
}

window.onload = setup; // when the window load it execute the setup function.
