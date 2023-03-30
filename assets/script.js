$(function () {
  var city = $("#city-name");

  var cityTemp = $("#temp");
  var cityWind = $("#wind");
  var cityHumidity = $("#humidity");

  var forecastDay = $(".forecast");
  var boxIcon = $("#icon");

  var citySearch;
  var cityHistory = [];

  init();

  function init() {
    var storedCities = JSON.parse(localStorage.getItem("City"));
    if (!storedCities) {
      cityHistory = [];
    } 
    else {
      cityHistory = storedCities;
    }
    renderHistory();
  }

  function renderHistory() {
    $("#previously-searched").empty();
    for (var i = 0; i < cityHistory.length; i++) {
      var btn = $("<button>");
      btn.text(cityHistory[i]);
      btn.attr("data-city", cityHistory[i]);
      btn.addClass("city-history-btn");
      $("#previously-searched").append(btn);
    }
  }

  function savehistory(searchedName) {
    var cityHistory = JSON.parse(localStorage.getItem("City")) || [];
    if (!cityHistory.find((city) => city === searchedName)) {
      cityHistory.push(searchedName);
      localStorage.setItem("City", JSON.stringify(cityHistory));
      renderHistory();
    }
  }

  function searchWeather() {
    citySearch = $("#search-city").val().trim();
    getWeather();
  }

  function getWeather() {
    console.log(citySearch);
    var cityData = `https://api.openweathermap.org/data/2.5/forecast?q=${citySearch}&cnt=40&units=imperial&appid=745a69533ad8b9cebd150df776c4e1ea`;

    fetch(cityData)
      .then((response) => {
        return response.json();
      })
      .then((data) => {
        console.log(data);
        var searchedName = data.city.name;
        savehistory(searchedName);

        let i = 0;
        console.log(forecastDay);
        for (let j = 1; j < 6; j++) {

          console.log(j, i);
          console.log(data.list[i]);
          $(`#f${j}`)
            .children(".date")
            .text(
              dayjs(data.list[i].dt_txt.split(" ")[0]).format("MM/DD/YYYY")
            );
          $(`#f${j}`)
            .children(".icon")
            .attr(
              "src",
              `http://openweathermap.org/img/wn/${data.list[i].weather[0].icon}@2x.png`
            );
          $(`#f${j}`)
            .children(".temp")
            .text("Temp: " + data.list[i].main.temp + "F");
          $(`#f${j}`)
            .children(".wind")
            .text("Wind: " + data.list[i].wind.speed);
          $(`#f${j}`)
            .children(".humidity")
            .text("Humidity: " + data.list[i].main.humidity + "%");
          i += 8;
        }
      });
    curWeather(citySearch);
  }

  function curWeather(citySearch) {
    var rnWeather = `https://api.openweathermap.org/data/2.5/weather?q=${citySearch}&units=imperial&appid=745a69533ad8b9cebd150df776c4e1ea`;
    fetch(rnWeather)
      .then((response) => {
        return response.json();
      })
      .then((data) => {
        city.text(data.name + " (" + dayjs().format("MM/DD/YYYY") + ")");
        boxIcon.attr(
          "src",
          `http://openweathermap.org/img/wn/${data.weather[0].icon}@2x.png`
        );
        cityTemp.text("Temp: " + data.main.temp + "F");
        cityWind.text("Wind Spd: " + data.wind.speed);
        cityHumidity.text("Humidity: " + data.main.humidity + "%");
      });
  }

  function buttonSearch(event) {
    console.log(event.target);
    citySearch = $(event.target).attr("data-city");
    getWeather();
  }

  $("#search-btn").on("click", searchWeather);
  $("#previously-searched").on("click", buttonSearch);
});