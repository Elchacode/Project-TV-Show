const cache = {};
//<-------------------------main changes made by segun-----------------------------------------------------
// Create an HTML heading
const heading = document.createElement("h1");
heading.textContent = "Select a TV Show";

// Create a <select> dropdown
const select = document.createElement("select");
select.id = "show-select";

// Add a default option to the drop down
const defaultOption = document.createElement("option");
defaultOption.textContent = "-- Choose a show --";
defaultOption.value = "";
select.appendChild(defaultOption);

//Add the select drop down and the HTML heading  to the body
document.body.prepend(select);
document.body.prepend(heading);

//<----------------------------main changes made by Segun---------------for step 4----------------------------->

//Create a div to hold episode listings
const episodesDiv = document.createElement("div");
episodesDiv.id = "episodes";
document.body.prepend(episodesDiv);

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

function liveSearchForShows(shows) {
  const searchBox = document.querySelector("#search-box"); // Get the search box element from the HTML
  const resultCount = document.querySelector("#result-count"); // Get the result count display from the HTML

  searchBox.addEventListener("input", () => {
    const searchTerm = searchBox.value.toLowerCase().trim(); // Gets the trimmed, lowercased search term
    const filtered = filterShows(shows, searchTerm); // Filters the list of shows based on the searchTerm

    displayAllShows(filtered); // Displays only filtered shows on the page
    resultCount.textContent = `${filtered.length} show(s) found`; // Updates the result count based on the number of shows found
  });
}

function filterShows(shows, searchTerm) {
  return shows.filter((show) => show.name.toLowerCase().includes(searchTerm)); // Filter shows by name
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
  // displayAllShows(shows);

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

function fetchWithCache(url) {
  if (cache[url]) {
    return Promise.resolve(cache[url]);
  }

  return fetch(url)
    .then((response) => response.json())
    .then((data) => {
      cache[url] = data; // Store the fetched data in the cache
      return data;
    });
}

function getEpisode(showId) {
  const loadMessage = document.getElementById("loading-message"); // Get the loading message element
  const errorMessage = document.getElementById("error-message"); // Get the error message element

  loadMessage.style.display = "block"; // Show loading message
  loadMessage.textContent = "Loading , please wait..."; // Set the loading message
  errorMessage.style.display = "none"; // Hide error message
  backButton.style.display = "block"; // Show back button

  //<-----------------------------------------main changes by Segun For level four----------------------------------------

  // fetch(`https://api.tvmaze.com/shows/${showId}/episodes`) // Fetches the data from the API.
  //   .then((response) => response.json()) // Convert the response to JSON
  //   .then((episodeData) => {
  //     loadMessage.style.display = "none"; // Hide loading message
  //     // Once data is fetched, render the episodes

  //     if (episodeData && episodeData.length) {
  //       state.getEpisode = episodeData;
  //       makePageForEpisodes(episodeData);
  //       liveSearch(episodeData);
  //       episodeSelector(episodeData);
  //     } else {
  //       errorMessage.textContent = "No episodes found.";
  //       errorMessage.style.display = "block";
  //     }
  //   });

  // .catch((error) => {
  //   loadMessage.style.display = "none"; // Hide loading message
  //   errorMessage.textContent =
  //     "Opps ! can't load 👀.  Please try again later"; // Show error message
  //   errorMessage.style.display = "block"; // Show error message
  // });

  //................................................................................................................................

  fetchWithCache("https://api.tvmaze.com/shows") //Get a list of shows
    .then((shows) => {
      loadMessage.style.display = "none"; //If fetch is successful remove loading message

      shows.sort((a, b) => a.name.localeCompare(b.name)); // Alphabetical sort

      //Create an option for each show and add to the select
      shows.forEach((show) => {
        const option = document.createElement("option");
        option.value = show.id;
        option.textContent = show.name;
        select.appendChild(option);
      });
      displayAllShows(shows); // Call the function to display all shows
      liveSearchForShows(shows); // Call the function to enable live search for shows
    })
    .catch((error) => console.error("Error fetching shows:", error));
}

select.addEventListener("change", (event) => {
  const showId = event.target.value;
  if (showId) {
    fetchAndDisplayEpisodesForShow(showId); // Call the function with selected show ID
  }
});

function displayAllShows(shows) {
  const showsContainer = document.getElementById("show-listings");
  showsContainer.innerHTML = ""; // Clear existing content

  shows.forEach((show) => {
    const card = document.createElement("div");
    card.classList.add("show-card");

    const title = document.createElement("h2");
    title.textContent = show.name;

    const image = document.createElement("img");
    image.src = show.image
      ? show.image.medium
      : "https://via.placeholder.com/210x295?text=No+Image";
    image.alt = show.name;

    const summary = document.createElement("p");
    summary.innerHTML = show.summary || "No summary available.";

    const genres =
      show.genres && show.genres.length > 0
        ? show.genres.join(", ")
        : "No genres available."; // Handle missing genres
    const status = show.status ? show.status : "Status unavailable"; // Handle missing status
    const rating =
      show.rating && show.rating.average
        ? show.rating.average
        : "No rating available"; // Handle missing rating
    const runtime = show.runtime
      ? `${show.runtime} mins`
      : "Runtime unavailable"; // Handle missing runtime

    const info = document.createElement("p");
    info.innerHTML = `
      <strong>Genres:</strong> ${show.genres.join(", ")}<br>
      <strong>Status:</strong> ${show.status}<br>
      <strong>Rating:</strong> ${show.rating.average ?? "N/A"}<br>
      <strong>Runtime:</strong> ${show.runtime} mins
      `;

    card.appendChild(title);
    card.appendChild(image);
    card.appendChild(summary);
    card.appendChild(info);

    card.addEventListener("click", () => {
      fetchAndDisplayEpisodesForShow(show.id);
    });

    showsContainer.appendChild(card);
  });
}

const backButton = document.createElement("button");
backButton.id = "back-button";
backButton.textContent = "Back to Shows";
backButton.style.display = "none"; // Initially hide the button

// Append the back button to the body or a specific container
document.body.appendChild(backButton);

backButton.addEventListener("click", () => {
  const showsContainer = document.getElementById("show-listings");
  const rootElem = document.getElementById("root");
  const episodeSelector = document.getElementById("episode-selector");
  const searchBox = document.getElementById("search-box");
  const resultCount = document.getElementById("result-count");
  const select = document.getElementById("show-select");

  // Hide episode area and clear contents
  rootElem.innerHTML = "";
  if (episodeSelector) {
    episodeSelector.innerHTML = '<option value="">Select an Episode</option>';
  }
  if (select) {
    select.innerHTML = '<option value="">-- Choose a show --</option>'; // Reset show dropdown to default option
  }
  if (searchBox) searchBox.value = "";
  if (resultCount) resultCount.textContent = "";

  // Show show listings again
  showsContainer.style.display = "block";

  // Hide back button again
  backButton.style.display = "none";

  getEpisode(); // Fetch shows again
});
// backButton.addEventListener("click", () => {
//   const episodesDiv = document.getElementById("episodes");
//   const showsContainer = document.getElementById("show-listings");

//   episodesDiv.innerHTML = ""; // Clear episodes listing
//   episodesDiv.style.display = "none"; // Hide episodes listing
//   showsContainer.style.display = "block"; // Show shows listing
//   backButton.style.display = "block"; // Hide back button
// });

function fetchAndDisplayEpisodesForShow(showId) {
  const loadMessage = document.getElementById("loading-message");
  const errorMessage = document.getElementById("error-message");
  const showsContainer = document.getElementById("show-listings");
  const episodesDiv = document.getElementById("episodes");

  // Hide the shows listing view
  showsContainer.style.display = "none"; // Hide shows listing
  episodesDiv.style.display = "block"; // Show episodes listing
  backButton.style.display = "block"; // Show back button

  loadMessage.style.display = "block"; // Show loading message
  loadMessage.textContent = "Loading episodes, please wait..."; // Set the loading message
  errorMessage.style.display = "none"; // Hide error message

  // Fetch episodes for the selected show
  fetchWithCache(`https://api.tvmaze.com/shows/${showId}/episodes`)
    .then((episodeData) => {
      loadMessage.style.display = "none"; // Hide loading message

      if (episodeData && episodeData.length) {
        state.getEpisode = episodeData;
        makePageForEpisodes(episodeData);
        liveSearch(episodeData);
        episodeSelector(episodeData);
      } else {
        errorMessage.textContent = "No episodes found for this show.";
        errorMessage.style.display = "block";
      }
    })
    .catch((error) => {
      loadMessage.style.display = "none"; // Hide loading message
      errorMessage.textContent =
        "Oops! Can't load episodes. Please try again later.";
      errorMessage.style.display = "block"; // Show error message
    });
}

//Listen for a change of selected show
// select.addEventListener("change", () => {
//   const showId = select.value;
//   episodesDiv.innerHTML = "";

//   if (showId) {
//     loadMessage.textContent = "Loading , please wait..."; //Displays a message while attempting to fetch episode

//     //<---------------------------------------------------main changes by Segun for level four-------------------------------------

//     fetch(`https://api.tvmaze.com/shows/${showId}/episodes`) // Fetches the data from the API => I  altered your initial fetch to get the episodes of the selected show.
//       .then((response) => response.json()) // Convert the response to JSON
//       .then((episodeData) => {
//         loadMessage.style.display = "none"; // Hide loading message
//         // Once data is fetched, render the episodes

//         if (episodeData && episodeData.length) {
//           state.getEpisode = episodeData;
//           makePageForEpisodes(episodeData);
//           liveSearch(episodeData);
//           episodeSelector(episodeData);
//         } else {
//           errorMessage.textContent = "No episodes found.";
//           errorMessage.style.display = "block";
//         }
//       })
//       .catch((error) => {
//         loadMessage.style.display = "none"; // Hide loading message
//         errorMessage.textContent =
//           "Opps ! can't load 👀.  Please try again later"; // Show error message
//         errorMessage.style.display = "block"; // Show error message
//       });
//   }
// });

function setup() {
  getEpisode(); // Fetch episodes from the API
}

window.onload = setup; // when the window load it execute the setup function
