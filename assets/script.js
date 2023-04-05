// const apiKey = "77ac543282c79533c2796093c3f6e43e";

// Initialize variables
let citySearch;
const cityElements = {
  city: document.querySelector("#city-name"),
  temp: document.querySelector("#temp"),
  wind: document.querySelector("#wind"),
  humidity: document.querySelector("#humidity"),
  icon: document.querySelector("#icon"),
};
const forecastDays = document.querySelectorAll(".forecast");
const searchButton = document.querySelector("#search-btn");
const historyList = document.querySelector("#previously-searched");
let cityHistory = [];

// Initialize the app
function init() {
  const storedCities = JSON.parse(localStorage.getItem("City"));
  cityHistory = storedCities || [];
  renderHistory();
}

// Render the search history
function renderHistory() {
  historyList.innerHTML = "";
  cityHistory.forEach((city) => {
    const button = document.createElement("button");
    button.textContent = city;
    button.setAttribute("data-city", city);
    button.classList.add("city-history-btn");
    historyList.appendChild(button);
  });
}

// Save search history to local storage
function saveHistory(searchedCity) {
  const storedCities = JSON.parse(localStorage.getItem("City")) || [];
  if (!storedCities.includes(searchedCity)) {
    storedCities.push(searchedCity);
    localStorage.setItem("City", JSON.stringify(storedCities));
    renderHistory();
  }
}

// Search for weather data
async function searchWeather() {
  citySearch = document.querySelector("#search-city").value.trim();
  const cityDataUrl = `https://api.openweathermap.org/data/2.5/forecast?q=${citySearch}&cnt=40&units=imperial&appid=77ac543282c79533c2796093c3f6e43e`;

  try {
    const response = await fetch(cityDataUrl);
    const data = await response.json();

    const searchedCity = data.city.name;
    saveHistory(searchedCity);

    // display current weather
    await getCurrentWeather(citySearch);

    // display 5-day forecast
    let i = 0;
    for (let j = 0; j < 5; j++) {
      const forecast = forecastDays[j];
      forecast.querySelector(".date").textContent = dayjs(data.list[i].dt_txt.split(" ")[0]).format("MM/DD/YYYY");
      forecast.querySelector(".icon").setAttribute("src", `http://openweathermap.org/img/wn/${data.list[i].weather[0].icon}.png`);
      forecast.querySelector(".temp").textContent = `Temp: ${data.list[i].main.temp}F`;
      forecast.querySelector(".wind").textContent = `Wind: ${data.list[i].wind.speed}`;
      forecast.querySelector(".humidity").textContent = `Humidity: ${data.list[i].main.humidity}%`;
      i += 8;
    }
  } catch (error) {
    console.log(error);
  }
}

// Get current weather data
async function getCurrentWeather(city) {
  const currentWeatherUrl = `https://api.openweathermap.org/data/2.5/weather?q=${city}&units=imperial&appid=77ac543282c79533c2796093c3f6e43e`;

  try {
    const response = await fetch(currentWeatherUrl);
    const data = await response.json();

    cityElements.city.textContent = `${data.name} (${dayjs().format("MM/DD/YYYY")})`;
    cityElements.icon.setAttribute("src", `https://openweathermap.org/img/wn/${data.weather[0].icon}.png`);
    cityElements.temp.textContent = `Temp: ${data.main.temp}F`;
    cityElements.wind.textContent = `Wind Spd: ${data.wind.speed}`;
    cityElements.humidity.textContent = `Humidity: ${data.main.humidity}%`;
  } catch (error) {
    console.log(error);
  }
}


// Search for weather data using a previously searched city
function searchHistory(event)
{
  if (event.target.classList.contains("city-history-btn")) {
  const searchedCity = event.target.getAttribute("data-city");
  document.querySelector("#search-city").value = searchedCity;
  searchWeather();
  }
  }
  
  // Event listeners
  searchButton.addEventListener("click", searchWeather);
  historyList.addEventListener("click", searchHistory);
  
  // Initialize the app on page load
  init();