import {movieDuration, movieGenres, openFullFilmOverview, toggleReadMoreOverview } from '/index.js'

const localStorageData = JSON.parse(localStorage.getItem('myMovies'))
if(localStorageData){
    renderMovies(localStorageData)
}

async function createMovieCard(film){
    const movieCard = document.createElement('div')
    movieCard.className = 'movie-card'
    const { id, poster_path, title, vote_average, overview } = film
    let posterURL = poster_path ? `https://image.tmdb.org/t/p/w500${poster_path}` : '/images/start.JPG'
    const genres =  await movieGenres(id)
    const duration = await movieDuration(id)
    const stars = vote_average.toFixed(1)
    const overviewPart = openFullFilmOverview(overview, id)
    movieCard.innerHTML =  `<img src='${posterURL}' alt=${title}>
                                            <div class=card-right>
                                                <h3>${title}<span class='stars'> <img src='images/star.png'>${stars}</span></h3>
                                                <p class='info'>${duration} min ${genres}<span class='watchlist'><a href='#'><img src='images/minus.png'  data-remove='${id}'></a>Remove</span></p>
                                                <p class='overview'>${overviewPart}</p>
                                            </div>
                                            `
        return movieCard
}

async function renderMovies(films){
    const container = document.getElementById('container')
    container.innerHTML = ''
    if (films.length) {
        for(const film of films){
            const movieCard = await createMovieCard(film)
            container.append(movieCard)
        }   
    } else {
        document.body.style.backgroundImage = 'url("")'
        if(document.getElementById('message')){
            document.getElementById('message').classList.toggle('hidden')
        }
    }
}

function deleteMovieFromWatchlist(id){
    let moviesSaved = JSON.parse(localStorage.getItem('myMovies'))
    // let indexToRemove = moviesSaved.findIndex((watchlistMovie,index) => {
    //     watchlistMovie.id === id
    // })
    
    let indexToRemove = 0
    for (let i = 0; i < moviesSaved.length; i++) {
        if(moviesSaved[i].id == id) {
            moviesSaved.splice(indexToRemove, 1)
            localStorage.setItem('myMovies', JSON.stringify(moviesSaved))
        }
    }
    if(localStorageData){
        renderMovies(JSON.parse(localStorage.getItem('myMovies')))
    }
    
    // console.log(moviesSaved);
    // if (indexToRemove >= 0 && indexToRemove < moviesSaved.length) {
    //     moviesSaved.splice(indexToRemove, 1);
    //     localStorage.setItem('myMovies', JSON.stringify(moviesSaved))
    //     console.log('Object removed from the array:', moviesSaved);
    // } else {
    //     console.log('Invalid index');
    // }
}

document.addEventListener('click', function(e){
    if(e.target.dataset.remove){
        e.preventDefault()
        deleteMovieFromWatchlist(e.target.dataset.remove)
    } 
})