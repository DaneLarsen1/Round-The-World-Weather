var apiKey = "aa4fc770e1e6cd4909713a146a863bd1";
var searchForm = document.getElementById("search-form");
var cityInput = document.getElementById("city-input");
var currentWeatherContainer = document.getElementById("current-weather");
var forecastContainer = document.getElementById("forecast");
var searchHistoryContainer = document.getElementById("search-history");
let searchHistory = [];

searchForm.addEventListener("submit", function (event) {
  event.preventDefault();
  var city = cityInput.value.trim();

  if (city) {
    getWeatherData(city);
  }
});

function getWeatherData(city) {
  var apiUrl = "https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${aa4fc770e1e6cd4909713a146a863bd1}";

  fetch(apiUrl)
    .then((response) => {
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      return response.json();
    })
    .then((data) => {
      
      updateWeatherUI(data);
      
      addToSearchHistory(city);
    })
    .catch((error) => {
      console.error("Error fetching weather data:", error);
      
    });
}

function updateWeatherUI(weatherData) {
  
  currentWeatherContainer.innerHTML = "";
  forecastContainer.innerHTML = "";

  
  const currentWeather = weatherData.list[0]; // Assuming the first item is the current weather

  // DONT TOUCH THIS IT TOOK ME AGES TO FIGURE OUT SERIOUSLY!!!!!!!!
  const convertKelvinToFahrenheit = (kelvin) => ((kelvin - 273.15) * 9/5 + 32).toFixed(2);

  
  const currentWeatherHtml = `
    <h2>${weatherData.city.name}</h2>
    <p>Date: ${currentWeather.dt_txt}</p>
    <p>Temperature: ${currentWeather.main.temp} K</p>
    <p>Humidity: ${currentWeather.main.humidity} %</p>
    <p>Wind Speed: ${currentWeather.wind.speed} m/s</p>
  `;
  currentWeatherContainer.innerHTML = currentWeatherHtml;

  
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
  
  searchHistory.push(city);
  
  displaySearchHistory();
}

function displaySearchHistory() {
  
  const historyHtml = searchHistory.map((city) => `<p>${city}</p>`).join("");
  searchHistoryContainer.innerHTML = historyHtml;
}

function handleHistoryClick(city) {
 
  getWeatherData(city);
}