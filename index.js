import { openFullFilmOverview, toggleReadMoreOverview } from "./utils.js";

const API_KEY = '26bb7cfad6e1e13f3a56bb50bbc26127'
const BASE_URL = 'https://api.themoviedb.org/3'

const localStorageData = JSON.parse(localStorage.getItem('myMovies'))
if(!localStorageData){
    localStorage.setItem('myMovies', JSON.stringify([]))
} else {
    console.log('storage exists no need create');
}

async function getMovieDetails(id){
    const response = await fetch(`${BASE_URL}/movie/${id}?language=en-US&api_key=${API_KEY}`)
    const data = await response.json()
    return data
}


async function movieGenres(id) {
    const data = await getMovieDetails(id)
    return data.genres.slice(0,3).map((genre)=> genre.name).join(', ')
}

async function movieDuration(id) {
    const data = await getMovieDetails(id)
    return data.runtime
}

async function fetchMovies(query){
    const response = await fetch(`${BASE_URL}/search/movie?query=${query}&include_adult=true&language=en-US&api_key=${API_KEY}`)
    const data = await response.json()
    let { results: films } = data
    return films

}


async function createMovieCard(film){
    const movieCard = document.createElement('div')
    movieCard.className = 'movie-card'
    const { id, poster_path, title, vote_average, overview, release_date } = film
    let posterURL = poster_path ? `https://image.tmdb.org/t/p/w500${poster_path}` : '/images/start.JPG'
    const genres =  await movieGenres(id)
    const duration = await movieDuration(id)
    const stars = vote_average.toFixed(1)
    const releaseYear = release_date.slice(0,4)
    const overviewPart = openFullFilmOverview(overview, id)
    movieCard.innerHTML =  `<img src='${posterURL}' alt=${title}>
                                            <div class=card-right>
                                                <h3>${title}<span class='stars'> <img src='images/star.png'>${stars}</span></h3>
                                                <p class='info'>${duration} min ${genres}<span class='watchlist'><a href='#'><img src='images/plus.png'  data-watchlist='${id}'></a>Watchlist</span></p>
                                                <p class='year'>${releaseYear}</p>
                                                <p class='overview'>${overviewPart}</p>
                                            </div>
                                            `
        return movieCard
}

async function renderMovies(searchMovieInput){
    const container = document.getElementById('container')
    container.innerHTML = ''
    const films = await fetchMovies(searchMovieInput)
    if (films.length) {
        for(const film of films){
            const movieCard = await createMovieCard(film)
            container.append(movieCard)
        }   
    } else {
        document.body.style.backgroundImage = 'url("")'
        document.getElementById('message').classList.toggle('hidden')
        
    }

}


function getUserSearch(){
    const userInput = document.getElementById('search-input').value
    if(userInput){
        renderMovies(userInput)
    } else {
        
    }
    document.getElementById('search-input').value = ''
}

async function saveMovieToLocalStorage(id){
    const movie = await getMovieDetails(id)
    addMovieToWatchlist(movie)
}

function addMovieToWatchlist(movie) {
    let moviesSaved = JSON.parse(localStorage.getItem('myMovies'))
    moviesSaved.push(movie)
    localStorage.clear()
    localStorage.setItem('myMovies', JSON.stringify(moviesSaved))
}

// Wait for the DOM to be fully loaded before running the code
document.addEventListener('DOMContentLoaded', function(){
    const searchBtn =  document.getElementById('search-btn')
    if(searchBtn){
        searchBtn.addEventListener('click', getUserSearch)
    }
})




document.addEventListener('click', function(e){
    if(e.target.dataset.readMore){
        e.preventDefault()
        toggleReadMoreOverview(e.target.dataset.readMore)
    } else if(e.target.dataset.showLess){
        e.preventDefault()
        toggleReadMoreOverview(e.target.dataset.showLess)
    } else if(e.target.dataset.watchlist){
        e.preventDefault()
        saveMovieToLocalStorage(e.target.dataset.watchlist)
    }
})

   
export  { movieDuration, movieGenres, fetchMovies, openFullFilmOverview, toggleReadMoreOverview }
