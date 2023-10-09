


function openFullFilmOverview(overview, id){
    if(overview.length > 132){
        return overview.substr(0,133) +
         `<a href='#' data-read-more='${id}' id='read-more-${id}'>...Read more</a>` + 

         `<span class='hidden' id='show-less-${id}'>` + overview.substr(133) + 
         
         `<a href='#' data-show-less='${id}' > ...Show less</a></span>`

    } else{
        return overview.substr(0,132)
    }
}

function toggleReadMoreOverview(id) {
    document.getElementById(`show-less-${id}`).classList.toggle('hidden')
    document.getElementById(`read-more-${id}`).classList.toggle('hidden')
}




export  { openFullFilmOverview, toggleReadMoreOverview }