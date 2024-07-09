// =================== Global =====================

//find location input
findLocation = document.getElementById('search');

//Today HTML Data
let todayDayName = document.getElementById('todayDayName');
let todayDayNum = document.getElementById('todayDayNum');
let todayMonth = document.getElementById('todayMonth');
let todayLocation = document.getElementById('todayLocation');
let todayTemp = document.getElementById('todayTemp');
let todayTempIcon = document.getElementById('todayTempIcon');
let todayText = document.getElementById('todayText');
let todayHumidityTxt = document.getElementById('humidity');
let todayWindNum = document.getElementById('wind');
let todayWindDir = document.getElementById('todayWindDir');

//next weather HTML Data
let nextDay = document.getElementsByClassName('next-day-name');
let nextDayIcon = document.getElementsByClassName('next-day-icon');
let nextMaxTemp = document.getElementsByClassName('max-temp');
let nextMinTemp = document.getElementsByClassName('min-temp');
let nextDayText = document.getElementsByClassName('next-day-text');

// user location
let currLoc;

runApp();

//*********************  Events   ************************
findLocation.addEventListener('input' , function(){
    runApp(findLocation.value);
})

// ******************** Functions ************************
//get data from API
async function getWeather(location){
    let weatherDataResponse =await fetch(`https://api.weatherapi.com/v1/forecast.json?key=52cd21ce63464835ad3135551240107&q=${location}&days=3`)
    let weatherData =await weatherDataResponse.json();
    return weatherData;
}

// display current weather
function diplayToday(data){
    let todayDate = new Date();
    todayDayName.innerHTML =todayDate.toLocaleDateString("en-US" , {weekday:"long"})
    todayDayNum.innerHTML = todayDate.getDate()
    todayMonth.innerHTML = todayDate.toLocaleDateString("en-US" , {month:"long"})
    todayLocation.innerHTML = data.location.name;
    todayTemp.innerHTML = data.current.temp_c;
    todayText.innerHTML = data.current.condition.text;
    todayHumidityTxt.innerHTML = data.current.humidity+"% ";
    todayWindNum.innerHTML = data.current.wind_kph + 'km/h';
    todayWindDir.innerHTML = data.current.wind_dir;
    todayTempIcon.setAttribute('src' , "http:" + data.current.condition.icon);    
}

//display next days
function displayNextDays(data){
    let dataArray =  data.forecast.forecastday;
    for(let i = 0 ; i<2 ; i++){
        let nextDate = new Date(dataArray[i+1].date);
        nextDay[i].innerHTML = nextDate.toLocaleDateString("en-US" , {weekday:"long"});
        nextDayIcon[i].setAttribute('src' , "http:" + dataArray[i+1].day.condition.icon);
        nextDayText[i].innerHTML = dataArray[i+1].day.condition.text;
        nextMaxTemp[i].innerHTML = dataArray[i+1].day.maxtemp_c;
        nextMinTemp[i].innerHTML = dataArray[i+1].day.mintemp_c;
    }
}

//run App function
async function runApp(city = null) {
  try {
      let location;
      if (city) {
          location = city;
      } else {
          location = await getLocation(); 
      }
      let weatherData = await getWeather(location); 
      if (!weatherData.error) {
          diplayToday(weatherData);
          displayNextDays(weatherData);
      }
  } catch (error) {
      console.error('Error running the application:', error);
  }
}

function showError(error) {
    switch(error.code) {
      case error.PERMISSION_DENIED:
        console.log('User denied the request for Geolocation.');
        break;
      case error.POSITION_UNAVAILABLE:
        console.log('Location information is unavailable.');
        break;
      case error.TIMEOUT:
        console.log('The request to get user location timed out.');
        break;
      case error.UNKNOWN_ERROR:
        console.log('An unknown error occurred.');
        break;
    }
  }
  
// get curr location
function getLocation() {
  return new Promise(function(resolve, reject) {
      if (navigator.geolocation) {
          navigator.geolocation.getCurrentPosition(function(position) {
              let currLat = position.coords.latitude;
              let currLon = position.coords.longitude;
              currLoc = currLat + ',' + currLon;
              resolve(currLoc); 
          }, function(error) {
              reject(error); 
          });
      } else {
          reject(new Error('Geolocation is not supported by this browser.'));
      }
  });
}

  
