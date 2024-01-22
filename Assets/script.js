var apiKey = 'aa4fc770e1e6cd4909713a146a863bd1';
var searchForm = document.getElementById('search-form');
var cityInput = document.getElementById('city-input');
var currentWeatherContainer = document.getElementById('current-weather');
var forecastContainer = document.getElementById('forecast');
var searchHistoryContainer = document.getElementById('search-history');
let searchHistory = [];

searchForm.addEventListener('submit', function (event) {
  event.preventDefault();
  var city = cityInput.value.trim();

  if (city) {
    getWeatherData(city);
  }
});

function getWeatherData(city) {
  var apiUrl = `https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${apiKey}`;

  fetch(apiUrl)
    .then((response) => {
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      return response.json();
    })
    .then((data) => {
      updateWeatherUI(data);
      addToSearchHistory(city);
    })
    .catch((error) => {
      console.error('Error fetching weather data:', error);
    });
}

function updateWeatherUI(weatherData) {
  // Clear previous content
  forecastContainer.innerHTML = '';

  const currentWeather = weatherData.list[0];
  const convertKelvinToFahrenheit = (kelvin) => ((kelvin - 273.15) * 9/5 + 32).toFixed(2);

  // Display current weather
  const currentWeatherHtml = `
    <div class="weather-box">
      <h2>${weatherData.city.name}(${currentWeather.dt_txt})</h2>
      <p>Temp: ${convertKelvinToFahrenheit(currentWeather.main.temp)} °F</p>
      <p>Wind: ${currentWeather.wind.speed} m/s</p>
      <p>Humidity: ${currentWeather.main.humidity} %</p>
    </div>
  `;
  document.getElementById('current-weather-box').innerHTML = currentWeatherHtml;

  // Display 5-day forecast, including the current day
  const forecastHtml = weatherData.list
    .filter((item) => item.dt_txt.includes('12:00:00') && !item.dt_txt.includes('00:00:00')) // Filter for noon forecasts, excluding midnight
    .slice(1, 6) // Limit to the next 5 days, including the current day
    .map((item) => `
      <div class="forecast-day">
        <p>Date: ${item.dt_txt}</p>
        <p>Temp: ${convertKelvinToFahrenheit(item.main.temp)} °F</p>
        <p>Wind: ${item.wind.speed} m/s</p>
        <p>Humidity: ${item.main.humidity} %</p>
      </div>
    `)
    .join('');

  forecastContainer.innerHTML = forecastHtml;
}

function addToSearchHistory(city) {
  searchHistory.push(city);
  displaySearchHistory();
}

function displaySearchHistory() {
  const historyHtml = searchHistory.map((city) => `<p>${city}</p>`).join('');
  searchHistoryContainer.innerHTML = historyHtml;
}

function handleHistoryClick(city) {
  getWeatherData(city);
}
