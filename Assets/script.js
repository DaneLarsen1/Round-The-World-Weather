const apiKey = ("e49a9cd38b998d14367a7bcf07f1604a");
const searchForm = document.getElementById("search-form");
const cityInput = document.getElementById("city-input");
const currentWeatherContainer = document.getElementById("current-weather");
const forecastContainer = document.getElementById("forecast");
const searchHistoryContainer = document.getElementById("search-history");
let searchHistory = [];

searchForm.addEventListener("submit", function (event) {
  event.preventDefault();
  const city = cityInput.value.trim();

  if (city) {
    getWeatherData(city);
  }
});

function getWeatherData(city) {
  const apiUrl = "https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${e49a9cd38b998d14367a7bcf07f1604a}";

  fetch(apiUrl)
    .then((response) => {
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      return response.json();
    })
    .then((data) => {
      // Handle the data and update the UI
      updateWeatherUI(data);
      // Add the city to the search history
      addToSearchHistory(city);
    })
    .catch((error) => {
      console.error("Error fetching weather data:", error);
      // Handle errors and update the UI accordingly
    });
}

function updateWeatherUI(weatherData) {
  // Clear previous content
  currentWeatherContainer.innerHTML = "";
  forecastContainer.innerHTML = "";

  // Extract relevant data from the API response and update the UI
  const currentWeather = weatherData.list[0]; // Assuming the first item is the current weather

  // DONT TOUCH THIS IT TOOK ME AGES TO FIGURE OUT SERIOUSLY!!!!!!!!
  const convertKelvinToFahrenheit = (kelvin) => ((kelvin - 273.15) * 9/5 + 32).toFixed(2);

  // Display current weather
  const currentWeatherHtml = `
    <h2>${weatherData.city.name}</h2>
    <p>Date: ${currentWeather.dt_txt}</p>
    <p>Temperature: ${currentWeather.main.temp} K</p>
    <p>Humidity: ${currentWeather.main.humidity} %</p>
    <p>Wind Speed: ${currentWeather.wind.speed} m/s</p>
  `;
  currentWeatherContainer.innerHTML = currentWeatherHtml;

  // Display 5-day forecast
  const forecastHtml = weatherData.list
    .filter((item) => item.dt_txt.includes("12:00:00")) // Assuming you want daily forecasts at noon
    .map((item) => `
      <div>
        <p>Date: ${item.dt_txt}</p>
        <p>Temperature: ${item.main.temp} K</p>
        <p>Humidity: ${item.main.humidity} %</p>
        <p>Wind Speed: ${item.wind.speed} m/s</p>
      </div>
    `)
    .join("");
  forecastContainer.innerHTML = forecastHtml;
  console.log(data);
}

function addToSearchHistory(city) {
  // Add the city to the search history array
  searchHistory.push(city);
  // Update the UI to display the search history
  displaySearchHistory();
}

function displaySearchHistory() {
  // Display the search history in the UI
  const historyHtml = searchHistory.map((city) => `<p>${city}</p>`).join("");
  searchHistoryContainer.innerHTML = historyHtml;
}

function handleHistoryClick(city) {
  // When a city in the search history is clicked, fetch and display its weather data
  getWeatherData(city);
}