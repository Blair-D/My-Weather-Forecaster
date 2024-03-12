// OpenWeatherMap API key
let apiKey = '5b22034f0ee272377858921625bd5d2b';

//weather section variables defined
let currentWeather = document.getElementById('currWeather');
let forecastWeather = document.getElementById('forecaster');

//saved city history variables defined
let citiesSaved = JSON.parse(localStorage.getItem('weatherSearchHistory')) || [];
let savedCity = document.createElement('li');
let cityHistory = document.getElementById('searchHistory');
let city = document.getElementById('citySearch').value;

// submit button event listner for searcing cities
document.getElementById('submitBtn').addEventListener('click', function() {
    let city = document.getElementById('citySearch').value;
    //this will get the weather from the api 
    getWeather(city); 
    // this will add the searched city to the  users history section
    addHistory(city); 
});

// this function will add the searched city to the history section
function addHistory(city) {
   
    savedCity.textContent = city;
    //this is an event listener for when the user clicks on the cities in history
    savedCity.addEventListener('click', function() {
         // this will load the previously saved city's weather
        getWeather(city);
    });
    cityHistory.appendChild(savedCity);
}

// this function will use local storage to obtain the saved cities
function recallSavedCities() { 
    //this add the searched cities to the history 
    citiesSaved.forEach(addHistory); 
}

// this will add the saved city to local storage
function saveCitySearch(city) { 
    if (!citiesSaved.includes(city)) {
        citiesSaved.push(city);
        localStorage.setItem('weatherSearchHistory', JSON.stringify(citiesSaved));
    }
}

// this will display the saved cities when the window loads
window.onload = recallSavedCities;

// the function will get the city's current and forcasted weather for display
function getWeather(city) {
    console.log(`city ${city}`)
    let apiUrl = 'https://api.openweathermap.org/data/2.5/weather?q=' + city + '&appid=' + apiKey + '&units=imperial';
    
    // this fetch is for the current weather data
    fetch(apiUrl)
    .then(function(response) {
        return response.json();
    })
    .then(function(data) {
        //current weather display
        displayWeather(data); 
        //these are coordinates to obtain the forecasted weather
        let latitude = data.coord.lat;
        let longitude = data.coord.lon;
        // this fetch is using the coordinated to obtain the forecated weather
        return fetch('https://api.openweathermap.org/data/2.5/forecast?lat=' + latitude + '&lon=' + longitude + '&appid=' + apiKey + '&units=imperial');
    })
    .then(function(response) {
        return response.json();
    })
    .then(function(forecastData) {
        //forecasted weather display
        displayForecast(forecastData); 
    })
    .catch(function(error) {
        //will send an error for if one occurs when getting data
        console.error('Error obtaining data: ', error);
    });
}

// this function will display the current weather 
function displayWeather(data) {
    currentWeather ; 
    // Formating the data for U.S. weather (in mph, °F, and date) 
    let date = new Date(data.dt * 1000).toLocaleDateString();
    //this is for the weather icon
    let weatherIcon = 'http://openweathermap.org/img/w/' + data.weather[0].icon + '.png';
    //this will display all the data for the current weather
    currentWeather.innerHTML = '<h1>'+data.name + '</h1>' + '<img src="' + weatherIcon + '">' + '<h1>' + date + ' </h1>' +  '<p>Temperature: ' + data.main.temp + ' °F</p>' +'<p>Wind Speed: ' + data.wind.speed + ' MPH</p>' +                                                                                 '<p>Humidity: ' + data.main.humidity + '%</p>';                               
}

// this function will display the forecasted weather 
function displayForecast(datafcast) { 
    forecastWeather.innerHTML = '';
    // displays weather for each day using a loop
    for (let i = 1; i < datafcast.list.length; i += 8) { 
        let dataEachDay = datafcast.list[i];
        //this will get the date for each forecasted day
        let date = new Date(dataEachDay.dt_txt).toLocaleDateString();
        //this will get the weather icon for each forecasted day
        let weatherIcon = 'http://openweathermap.org/img/w/' + dataEachDay.weather[0].icon + '.png';
        //this will create a div for each forecasted day
        let day = document.createElement('div');
        day.className = 'forecast-day';
        //this will display the weather icon, date, temp, humidity, and wind speed for each of the forecasted days
        day.innerHTML = '<img src="' + weatherIcon + '">' + '<h1>' + date + '</h1>' +'<p>Temp: ' + dataEachDay.main.temp + ' °F</p>' + '<p>Humidity: ' + dataEachDay.main.humidity + '%</p>' +'<p>Wind: ' + dataEachDay.wind.speed + ' MPH</p>';                      
      forecastWeather.appendChild(day); 
    }
}






