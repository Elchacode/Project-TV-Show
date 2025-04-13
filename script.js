//You can edit ALL of the code here


//<-------------------------Additions by segun-----------------------------------------------------
// Create an HTML heading
const heading = document.createElement('h1');
heading.textContent = 'Select a TV Show';

// Create a <select> dropdown
const select = document.createElement('select');
select.id = 'show-select';

// Add a default option
const defaultOption = document.createElement('option');
defaultOption.textContent = '-- Choose a show --';
defaultOption.value = '';
select.appendChild(defaultOption);


//Create a div to hold episode listings
const episodesDiv = document.createElement('div');
episodesDiv.id = 'episodes';

//Attach the HTML Heading, the Select dropdow
document.body.prepend(episodesDiv);
document.body.prepend(select);
document.body.prepend(heading);

//<----------------------------Additions by Segun---------------for step 4----------------------------->



function liveSearch(films) {
  const searchBox = document.querySelector("#search-box"); // Get the search box element from the HTML
  const resultCount = document.querySelector("#result-count"); // Get the result count display from the HTML

  // Event listener is added to the search box
  searchBox.addEventListener("input", () => {
    const searchTerm = searchBox.value.toLowerCase().trim(); // Gets the trimmed, lowercased search term
    const filtered = filterEpisodes(films, searchTerm); // Filters the list of episodes based on the searchTerm

    makePageForEpisodes(filtered); // Displays only filtered episodes on the page
    resultCount.textContent = `${filtered.length} episode(s) found`; // Updates the result count based on the number of episodes found
  });
}

function filterEpisodes(films, searchTerm) {
  // This function filters episodes if the search term is in the name or summary
  return films.filter(
    (film) =>
      film.name.toLowerCase().includes(searchTerm) ||
      film.summary.toLowerCase().includes(searchTerm)
  );
}

function episodeSelector(films) {
  const episodeSelector = document.getElementById("episode-selector");
  episodeSelector.innerHTML = '<option value="">Select an Episode</option>'; // Reset the dropdown before adding items

  films.forEach((episode, index) => {
    const option = document.createElement("option");
    option.value = index; // Set the value to index so we can identify it later
    option.textContent = `S${episode.season
      .toString()
      .padStart(2, "0")}E${episode.number.toString().padStart(2, "0")} - ${
      episode.name
    }`;
    episodeSelector.appendChild(option); // Set the text content to Episode season, number, and name
  });

  // Add event listener to handle episode selection
  episodeSelector.addEventListener("change", (event) => {
    const selectedIndex = event.target.value; // Get the selected index
    if (selectedIndex === "") {
      // If no episode is selected, show all episodes
      makePageForEpisodes(films);
    } else {
      // Show only the selected episode
      const selectedEpisode = films[selectedIndex];
      makePageForEpisodes([selectedEpisode]);
    }
  });
}

// In order to display a given episode list on the webpage-we need to create function makePageForEpisodes.
function makePageForEpisodes(episodeList) {
  // created a function called when makePageForEpisodes to execute and preview the page for the given episode list in the web page
  const rootElem = document.getElementById("root"); // get the root element id from the html file.

  rootElem.innerHTML = ""; // Clear any existing content

  const episodeCount = document.createElement("div"); // created a div to hold the number of episodes in the web page
  episodeCount.classList.add("page-count"); // created a class inside the div to hold the number of episode on the webpage
  episodeCount.textContent = `Got ${episodeList.length} episode(s)`; // implemented template literal to display the number of episodes.

  rootElem.appendChild(episodeCount); // append the child element to the parent element which o the rootElem.

  // Add event listener to handle episode selection-so that when the user selects an episode from the dropdown this happens

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
}

const state = {
  // created a state object to hold the data of the episodes
  getEpisode: [], // this is an empty array that will hold the episodes data
  searchTerm: "", // this is an empty string that will hold the search term
};

function getEpisode() {
  const loadMessage = document.getElementById("loading-message"); // Get the loading message element
  const errorMessage = document.getElementById("error-message"); // Get the error message element
  loadMessage.style.display = "block"; // Show loading message
  loadMessage.textContent = "Loading , please wait..."; // Set the loading message
  errorMessage.style.display = "none"; // Hide error message


  //<-----------------------------------------Additions by Segun For level four----------------------------------------

  fetch('https://api.tvmaze.com/shows')
  .then(response => response.json())
  .then(shows => {

    loadMessage.style.display = "none";

    shows.sort((a, b) => a.name.localeCompare(b.name)); // Alphabetical sort
    shows.forEach(show => {
      const option = document.createElement('option');
      option.value = show.id;
      option.textContent = show.name;
      select.appendChild(option);
    });
  })
  .catch(error => console.error('Error fetching shows:', error));

  select.addEventListener('change', () => {
    const showId = select.value;
    episodesDiv.innerHTML = ''; 
  

  if (showId) {

    loadMessage.textContent = "Loading , please wait..."; 
    
//<---------------------------------------------------Additions by Segun for level four-------------------------------------


  fetch(`https://api.tvmaze.com/shows/${showId}/episodes`) // Fetches the data from the API
    .then((response) => response.json()) // Convert the response to JSON
    .then((episodeData) => {
      loadMessage.style.display = "none"; // Hide loading message
      // Once data is fetched, render the episodes

      if (episodeData && episodeData.length) {
        state.getEpisode = episodeData;
        makePageForEpisodes(episodeData);
        liveSearch(episodeData);
        episodeSelector(episodeData);
      } else {
        errorMessage.textContent = "No episodes found.";
        errorMessage.style.display = "block";
      }
    })
    .catch((error) => {
      loadMessage.style.display = "none"; // Hide loading message
      errorMessage.textContent =
        "Opps ! can't load 👀.  Please try again later"; // Show error message
      errorMessage.style.display = "block"; // Show error message
    });
}
});


}

function setup() {
  getEpisode(); // Fetch episodes from the API
}

window.onload = setup; // when the window load it execute the setup function
