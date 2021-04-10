const searchButton = document.querySelector(".button")
const sideBox = document.querySelector('.side-box')
const forecastContainer = document.querySelector('.forecast-container')
const historyContainer = document.querySelector('.history-list')
searchButton.addEventListener("click", function(event){
    event.preventDefault() 
    callApi()
})

function clearSearch(){
    document.querySelector('.search-bar').value = "";
}

function clearUI(){
    sideBox.innerHTML = ""; 
    forecastContainer.innerHTML = "";
}


function searchQuery(evt){
    const target = evt.target; 
    if(target.className === "query"){
        console.log(evt.target)
        const query = target.innerText;
        callApi(query)
    }
}

function showHistory(){
    const history = JSON.parse(localStorage.getItem('history')); 

    history.forEach(query =>{
        historyContainer.innerHTML += `<li class="query">${query}</li>`
    })

    historyContainer.addEventListener('click', searchQuery);
}

async function callApi(query){
    var cityName = document.querySelector(".search-bar").value
    saveToLocalStorage(cityName); 
    showHistory();
    let latitude, longitude, responseData; 
   await fetch(`https://api.openweathermap.org/data/2.5/forecast?q=${!query? cityName: query}&appid=2dd3e3a73be6e7e3fb3cf7521bf057b8`)
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
    clearUI();
    showResults(responseData, uvResult)
    clearSearch();

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

function uvIdxColor(value){
let risk; 
    if(value >= 0 && value <= 2) risk= "low"; 
    else if (value >= 3 && value <= 5) risk = "moderate";
    else if(value  >= 6 && value <= 7) risk = "high";
    else if (value >= 8 && value <= 10) risk = "very-high";
     else  risk = "extreme"
return risk; 
}

function showResults({list, city}, uvResult){
    //loop through the list 
    list.forEach(({main, weather, dt_txt:date, name, wind}, idx) => {
        const {temp, feels_like:feelsLike, humidity} = main; 
        const {main:mainWeather, description, icon} = weather[0];
        const {speed:windSpeed} = wind;
        const {value:uvIndex} = uvResult;
        console.log(typeof uvIndex)
        let uvRisk = uvIdxColor(uvIndex);
        
      
        let result; 
        if(idx === 0){
        
        result = `
        <div class="sidebox-inner">
        <h2>Showing Results from ${city.name}</h2>
        <img src="http://openweathermap.org/img/wn/${icon}@2x.png" />
        <p> Temperature: ${temp} K </p>
        <p> Feels Like: ${feelsLike} K </p>
        <p> Humidity: ${humidity} % </p>
        <p> Date: ${date} </p>
        <p> ${mainWeather} </p>
        <p> Wind Speed: ${windSpeed} </p>
        <p class="uv-container"> UV index: ${uvIndex} <span class='uv-index ${uvRisk}'></span> </p>
        </div>
        `
        sideBox.innerHTML = result; 

        } else {
            result = `
            <div class="forecast">
            <p>${date}<p/>
            <p> Temperature: ${temp} K </p>
            <p> Humidity: ${humidity} </p>
            <p> ${mainWeather} % </p>
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


document.addEventListener('DOMContentLoaded', ()=>{
showHistory()
})
