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
  forecastContainer.innerHTML = '';

  const currentWeather = weatherData.list[0];
  const currentDate = new Date(currentWeather.dt_txt);
   let tempDate = new Date(); 
  tempDate.setUTCHours(0, 0, 0, 0); 
  
  if (currentDate > tempDate) {
    currentDate.setDate(currentDate.getDate() - 1);
  }

  const formattedCurrentDate = `${currentDate.getUTCMonth() + 1}/${currentDate.getUTCDate()}/${currentDate.getUTCFullYear()}`;

  const convertKelvinToFahrenheit = (kelvin) => ((kelvin - 273.15) * 9/5 + 32).toFixed(2);

  const currentWeatherHtml = `
    <div class="weather-box">
      <h2>${weatherData.city.name}(${formattedCurrentDate})</h2>
      <img src="https://openweathermap.org/img/wn/${currentWeather.weather[0].icon}@2x.png" alt="Weather Image">
      <p>Temp: ${convertKelvinToFahrenheit(currentWeather.main.temp)} °F</p>
      <p>Wind: ${currentWeather.wind.speed} m/s</p>
      <p>Humidity: ${currentWeather.main.humidity} %</p>
    </div>
  `;
  document.getElementById('current-weather-box').innerHTML = currentWeatherHtml;

  const forecastHtml = weatherData.list
  .filter((item) => item.dt_txt.includes('12:00:00') && !item.dt_txt.includes('00:00:00')) 
  .slice(0, 5) 
  .map((item) => {
    const date = new Date(item.dt_txt);
    const formattedDate = `${date.getMonth() + 1}/${date.getDate()}/${date.getFullYear()}`;
    
    return `
      <div class="forecast-day">
        <div id="five-day-date"><p>${formattedDate}</p></div>
        <img src="https://openweathermap.org/img/wn/${item.weather[0].icon}@2x.png" alt="Weather Image">
        <p>Temp: ${convertKelvinToFahrenheit(item.main.temp)} °F</p>
        <p>Wind: ${item.wind.speed} m/s</p>
        <p>Humidity: ${item.main.humidity} %</p>
      </div>
    `;
  })
  .join('');

  forecastContainer.innerHTML = forecastHtml;
  localStorage.setItem('weatherData', JSON.stringify(weatherData));
}

function addToSearchHistory(city) {
  searchHistory.push(city);
  displaySearchHistory();
}

function displaySearchHistory() {
  const historyHtml = searchHistory.map((city) => `<p>${city}</p>`).join('');
  searchHistoryContainer.innerHTML = historyHtml;
  const historyItems = searchHistoryContainer.querySelectorAll('p');
  historyItems.forEach(item => {
    item.addEventListener('click', () => {
      handleHistoryClick(item.textContent);
    });
  });
}

function handleHistoryClick(city) {
  getWeatherData(city);
  cityInput.value = city; 
}

function loadWeatherDataFromLocalStorage() {
  const storedWeatherData = localStorage.getItem('weatherData');
  if (storedWeatherData) {
    updateWeatherUI(JSON.parse(storedWeatherData));
  }
}
loadWeatherDataFromLocalStorage();