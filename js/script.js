const cityNameInput = document.querySelector(".cityNameInput")
const cityNameForm = document.querySelector(".cityNameForm")

const specialCharactersPattern = /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]+/
const APIkey = `130d5e4e9656cfdd88d49e993e0b0ea8`
const limitOfTheLocations = 1

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
        let cityLocationResponse = await fetch(`http://api.openweathermap.org/geo/1.0/direct?q=${cityName}&limit=${limitOfTheLocations.toString()}&appid=${APIkey}`)
        
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
    let weatherResponse = await fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${latitude.toString()}&lon=${longitude.toString()}&appid=${APIkey}&units=metric`)

    let data = await weatherResponse.json()
    console.log(data)
}


function checkForSpecialCharacters(string){
    if(specialCharactersPattern.test(string)){
        return false
    } else{
        return true
    }
}