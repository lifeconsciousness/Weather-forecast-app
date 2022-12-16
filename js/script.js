const specialCharactersPattern = /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]+/
const APIkey = `130d5e4e9656cfdd88d49e993e0b0ea8`
const limitOfTheLocations = 1

//header elements
const cityNameInput = document.querySelector(".cityNameInput")
const cityNameForm = document.querySelector(".cityNameForm")
const metricSystemChangeBtn = document.querySelector(".metricSystemChangeBtn")
//current weather elements
const currentWeatherImg = document.querySelector(".currentWeatherImg")
const weatherDescription = document.querySelector(".weatherDescription")
const currentTemperature = document.querySelector(".currentTemperature")
const minmaxTemperature = document.querySelector(".minmaxTemperature")
const currentTemperatureHowFeels = document.querySelector(".currentTemperatureHowFeels")
const windSpeed = document.querySelector(".windSpeed")
const humidity = document.querySelector(".humidity")

const TEMPERATURE_LOCAL_STORAGE_KEY = 'temperatureKey'
let celsiusFarenheit = JSON.parse(localStorage.getItem(TEMPERATURE_LOCAL_STORAGE_KEY)) || false
let temperatureSymbol
let windSpeedSymbol



//passes input value to the geocoding function
cityNameForm.addEventListener("submit", (e)=>{
    e.preventDefault()

    let inputValue = cityNameInput.value
    let cityName = document.querySelector(".cityName")
    cityName.innerHTML = `Current weather in ${inputValue}`
    if(checkForSpecialCharacters(inputValue)){
        console.log("No special characters")
        getGeoData(inputValue)
    } else{ console.log("remove special charaters from the city's name") }

})


//using geocoding API this function retrieves latitude and longitude of given city
async function getGeoData(cityName){
    try{
        let cityLocationResponse
        cityLocationResponse = await fetch(`http://api.openweathermap.org/geo/1.0/direct?q=${cityName}&limit=${limitOfTheLocations.toString()}&appid=${APIkey}&units=metric`)
        
        if(cityLocationResponse.ok){
            let data = await cityLocationResponse.json()

            let latitude = data[0].lat
            let longitude = data[0].lon

            getWeatherData(latitude,longitude)
        }

    } catch(error){
        console.log(`Error: ${error}`)
    }

}


//depending on the unit system requests either imperial or metric data and passes it as an argument to the display function
async function getWeatherData(latitude, longitude){
    let weatherResponse
    if(!celsiusFarenheit){
        weatherResponse = await fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${latitude.toString()}&lon=${longitude.toString()}&appid=${APIkey}&units=metric`)
    } else{
        weatherResponse = await fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${latitude.toString()}&lon=${longitude.toString()}&appid=${APIkey}&units=imperial`)
    }

    let data = await weatherResponse.json()
    console.log(data)
    displayCurrentWeather(data)
}


function displayCurrentWeather(data){
    displayWeatherIcon(data)
    checkTempSymbol()
    //weather description
    let description = data.weather[0].description
    description.toString()
    description = description[0].toUpperCase() + description.slice(1)
    weatherDescription.innerHTML = description
    //current temperature
    currentTemperature.innerHTML = `Temperature: ${data.main.temp}${temperatureSymbol}` 
    //how it feels like
    currentTemperatureHowFeels.innerHTML = `How it feels: ${data.main.feels_like}${temperatureSymbol}`
    //minmax temperature
    minmaxTemperature.innerHTML = `Min/Max temperature: ${data.main.temp_min}${temperatureSymbol} / ${data.main.temp_max}${temperatureSymbol}`
    //humidity
    humidity.innerHTML = `Humidity: ${data.main.humidity}%`
    //wind speed
    windSpeed.innerHTML = `Wind speed: ${data.wind.speed}${windSpeedSymbol}`
}

function displayWeatherIcon(data){
    let weatherMain = data.weather[0].main
    let weatherDescriptionData = data.weather[0].description
    let hours = new Date().getHours

    switch (weatherMain){
        case "Clear":
            if(hours > 6 && hours < 19){
                currentWeatherImg.src = "http://openweathermap.org/img/wn/01d@2x.png"
            } else {
                currentWeatherImg.src = "http://openweathermap.org/img/wn/01n@2x.png"
            }
        break
        case "Snow":
            currentWeatherImg.src = "http://openweathermap.org/img/wn/13d@2x.png"
        break
        case "Clouds":
            if(weatherDescriptionData == "few clouds"){
                if(hours > 6 && hours < 19){
                    currentWeatherImg.src = "http://openweathermap.org/img/wn/02d@2x.png"
                } else {
                    currentWeatherImg.src = "http://openweathermap.org/img/wn/02n@2x.png"
                }
            }
            if(weatherDescriptionData == "scattered clouds"){
                currentWeatherImg.src = "http://openweathermap.org/img/wn/03d@2x.png"
            }
            if(weatherDescriptionData == "broken clouds" || weatherDescriptionData == "overcast clouds"){
                currentWeatherImg.src = "http://openweathermap.org/img/wn/03d@2x.png"
            }
        break
        case "Thunderstorm":
            currentWeatherImg.src = "http://openweathermap.org/img/wn/11d@2x.png"
        break
        case "Rain":
            if(hours > 6 && hours < 19){
                currentWeatherImg.src = "http://openweathermap.org/img/wn/10d@2x.png"
            } else {
                currentWeatherImg.src = "http://openweathermap.org/img/wn/09n@2x.png"
            }
        break
        case "Snow":
            currentWeatherImg.src = "http://openweathermap.org/img/wn/13d@2x.png"
        break
        case "Drizzle":
            currentWeatherImg.src = "http://openweathermap.org/img/wn/09d@2x.png"
        break
        case "Mist":
            currentWeatherImg.src = "http://openweathermap.org/img/wn/50d@2x.png"
        break
        case "Fog":
            currentWeatherImg.src = "http://openweathermap.org/img/wn/50d@2x.png"
        break
    }
}






//utility functions

//changes boolean value for metric system
metricSystemChangeBtn.onclick = function(){
    if (!celsiusFarenheit){
        celsiusFarenheit = true
    } else { celsiusFarenheit = false; }
    save()
} 

function checkForSpecialCharacters(string){
    if(specialCharactersPattern.test(string)){
        return false
    } else{
        return true
    }
}

function checkTempSymbol(){ 
    if (!celsiusFarenheit){ 
        temperatureSymbol = "°C" 
        windSpeedSymbol = "km/h"
    } 
    else { 
        temperatureSymbol = "°F" 
        windSpeedSymbol = "knots" 
    }
}

function save(){
    localStorage.setItem(TEMPERATURE_LOCAL_STORAGE_KEY, JSON.stringify(celsiusFarenheit))
}