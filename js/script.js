const cityNameInput = document.querySelector(".cityNameInput")
const cityNameForm = document.querySelector(".cityNameForm")
const metricSystemChangeBtn = document.querySelector(".metricSystemChangeBtn")
const TEMPERATURE_LOCAL_STORAGE_KEY = 'temperatureKey'

let celsiusFarenheit = JSON.parse(localStorage.getItem(TEMPERATURE_LOCAL_STORAGE_KEY)) || false

const specialCharactersPattern = /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]+/
const APIkey = `130d5e4e9656cfdd88d49e993e0b0ea8`
const limitOfTheLocations = 1
console.log(celsiusFarenheit)

cityNameForm.addEventListener("submit", (e)=>{
    e.preventDefault()

    let inputValue = cityNameInput.value
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


async function getWeatherData(latitude, longitude){
    let weatherResponse
    if(!celsiusFarenheit){
        weatherResponse = await fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${latitude.toString()}&lon=${longitude.toString()}&appid=${APIkey}&units=metric`)
    } else{
        weatherResponse = await fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${latitude.toString()}&lon=${longitude.toString()}&appid=${APIkey}&units=imperial`)
    }

    let data = await weatherResponse.json()
    //console.log(data.main.temp)
    //console.log(data.weather[0].description)
    console.log(data)
    displayCurrentWeather(data)
}


async function displayCurrentWeather(data){
    
}










metricSystemChangeBtn.onclick = function(){
    if (!celsiusFarenheit){
        celsiusFarenheit = true
    } else { celsiusFarenheit = false }
    save()
} 

function checkForSpecialCharacters(string){
    if(specialCharactersPattern.test(string)){
        return false
    } else{
        return true
    }
}

function save(){
    localStorage.setItem(TEMPERATURE_LOCAL_STORAGE_KEY, JSON.stringify(celsiusFarenheit))
}