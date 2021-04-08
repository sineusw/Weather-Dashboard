const searchButton = document.querySelector(".button")
const sideBox = document.querySelector('.side-box')
const forecastContainer = document.querySelector('.forecast-container')
searchButton.addEventListener("click", function(event){
    event.preventDefault() 
    callApi()
})

async function callApi(){
    var cityName = document.querySelector(".search-bar").value
    saveToLocalStorage(cityName)
    let latitude, longitude, responseData; 
   await fetch(`https://api.openweathermap.org/data/2.5/forecast?q=${cityName}&appid=2dd3e3a73be6e7e3fb3cf7521bf057b8`)
    .then(res => {
        return res.json()
    })
    // api.openweathermap.org/data/2.5/forecast?q={city name}&appid={API key}
    .then((response) => {
        console.log(response); 
        const {coord} = response.city; 
        const {lat, lon} = coord; 
        latitude = lat; 
        longitude = lon
        responseData = response
        //showing the results to the ui 
        
    }); 
    const uvResult = await getUVData(latitude, longitude); 
    showResults(responseData, uvResult)

} 

async function getUVData(lat, long){
   const result = await fetch(`http://api.openweathermap.org/data/2.5/uvi?lat=${lat}&lon=${long}&appid=2dd3e3a73be6e7e3fb3cf7521bf057b8`)
.then(res => res.json())
.then(res => {
    console.log('res uv ', res); 
    return res
}); 
return result; 
}

function showResults({list, city}, uvResult){
    //loop through the list 
    list.forEach(({main, weather, dt_txt:date, name, wind}, idx) => {
        const {temp, feels_like:feelsLike, humidity} = main; 
        const {main:mainWeather, description, icon} = weather[0];
        const {speed:windSpeed} = wind;
        // const {value:uvIndex} = uvResult;
      
        let result; 
        if(idx === 0){
        
        result = `
        <div class="sidebox-inner">
        <h2>Showing Results from ${city.name}}</h2>
        <p> Temperature: ${temp} K </p>
        <p> Feels Like: ${feelsLike} K </p>
        <p> Date: ${date} </p>
        <p> ${mainWeather} </p>
        <p> Wind Speed: ${windSpeed} </p>
        <p> UV index: ${uvResult.value} </p>
        <img src="http://openweathermap.org/img/wn/${icon}@2x.png" />
        </div>
        `
        sideBox.innerHTML += result; 

        } else {
            result = `
            <div class="forecast">
            <p>${date}<p/>
            <p> Temperature: ${temp} K </p>
            <p> ${mainWeather} </p>
            <img src="http://openweathermap.org/img/wn/${icon}@2x.png" />
            </div>
            `
            forecastContainer.innerHTML += result; 
        }
    })
   
}

function saveToLocalStorage(query){
    let history; //undifned 
    //first time saving 
    if(!localStorage.getItem('history')){
        history = [];
        history.push(query);
        //save it to lc 
        localStorage.setItem('history', JSON.stringify(history) )
    } else {
        //parse => from JSON format to array
        const historyJSON = localStorage.getItem('history'); //json [Atlanta]
        history = JSON.parse(historyJSON); 
        history.push(query);
        localStorage.setItem('history', JSON.stringify(history) )

    }
}

