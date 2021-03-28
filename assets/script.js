var searchButton = document.querySelector(".button")

searchButton.addEventListener("click", function(event){
    event.preventDefault()
    callApi()
})

function callApi(){
    var cityName = document.querySelector(".search-bar").value
    
    fetch(`https://api.openweathermap.org/data/2.5/weather?q=${cityName}&appid=2dd3e3a73be6e7e3fb3cf7521bf057b8`)
    .then(res => {
        return res.json()
    })
    .then(response => {
        console.log(response)
    })
} 



