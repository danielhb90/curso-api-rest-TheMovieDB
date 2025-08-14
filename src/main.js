// Configuracion de AXIOS
const api = axios.create({
    baseURL: 'https://api.themoviedb.org/3/',
    headers: {
        'Content-Type': 'application/json;charset=utf-8',
    },
    params: {
        'api_key': API_KEY,
    },

});

//Helpers
function createMovies(movies, container) {
    container.innerHTML = '';
    
    movies.forEach(movie => {

        const movieContainer = document.createElement('div');
        movieContainer.classList.add('movie-container');
        movieContainer.addEventListener('click', () => {
            location.hash = '#movie=' + movie.id;
        });

        const movieImg = document.createElement('img');
        movieImg.classList.add('movie-img');
        movieImg.setAttribute('alt', movie.title);
        movieImg.setAttribute('src', 'https://image.tmdb.org/t/p/w300' + movie.poster_path);

        movieContainer.appendChild(movieImg);
        container.appendChild(movieContainer);

    });

}

function createCategories(categories, container) {
    container.innerHTML = "";
    
    categories.forEach(category => {

        const categoryContainer = document.createElement('div');
        categoryContainer.classList.add('category-container');

        const categoryTitle = document.createElement('h3');
        categoryTitle.classList.add('category-title');
        categoryTitle.setAttribute('id', 'id'+category.id);

        // Agregar evento de botones para cada categoria
        categoryTitle.addEventListener('click', ()=>{
            // location.hash = '#category=' + category.id + '-' + category.name;
            location.hash = `#category=${category.id}-${category.name}`;
        });
        const categoryTitleText = document.createTextNode(category.name)
        
        categoryTitle.appendChild(categoryTitleText);
        categoryContainer.appendChild(categoryTitle);
        container.appendChild(categoryContainer);

    });
}

//Llamados a la API

async function getTrendingMoviesPreview() {
    // Uso de forma FECTH
    const res = await fetch('https://api.themoviedb.org/3/trending/movie/day?api_key='+API_KEY);
    const data = await res.json();
    const movies = data.results;

    // const trendingMoviesPreviewList = document.querySelector('#trendingPreview .trendingPreview-movieList')
    // Esta linea vacia la informacion que hay al momento de cargar
    //trendingMoviesPreviewList.innerHTML="";
    
    // movies.forEach(movie => {

    //     const movieContainer = document.createElement('div');
    //     movieContainer.classList.add('movie-container');

    //     const movieImg = document.createElement('img');
    //     movieImg.classList.add('movie-img');
    //     movieImg.setAttribute('alt', movie.title);
    //     movieImg.setAttribute('src', 'https://image.tmdb.org/t/p/w300' + movie.poster_path);


    //     movieContainer.appendChild(movieImg);
    //     trendingMoviesPreviewList.appendChild(movieContainer);

    // });

    createMovies(movies, trendingMoviesPreviewList);

}

async function getCategoriesPreview() {
    // Se usa la forma dada por AXIOS
    const { data } = await api('genre/movie/list');
    const categories = data.genres;
    // const categoriesPreviewList = document.querySelector('#categoriesPreview .categoriesPreview-list')
    // Esta linea vacia la informacion que hay al momento de cargar
    // categoriesPreviewList.innerHTML = "";

    // categories.forEach(category => {

    //     const categoryContainer = document.createElement('div');
    //     categoryContainer.classList.add('category-container');

    //     const categoryTitle = document.createElement('h3');
    //     categoryTitle.classList.add('category-title');
    //     categoryTitle.setAttribute('id', 'id'+category.id);

    //     // Agregar evento de botones para cada categoria
    //     categoryTitle.addEventListener('click', ()=>{
    //         // location.hash = '#category=' + category.id + '-' + category.name;
    //         location.hash = `#category=${category.id}-${category.name}`;
    //     });
    //     const categoryTitleText = document.createTextNode(category.name)
        
    //     categoryTitle.appendChild(categoryTitleText);
    //     categoryContainer.appendChild(categoryTitle);
    //     categoriesPreviewList.appendChild(categoryContainer);

    // });

    createCategories(categories, categoriesPreviewList);

}

async function getMoviesByCategory(id) {
    // Uso de forma AXIOS
    const { data } = await api('discover/movie', {
        params: {
            with_genres: id,
        },
    });
    const movies = data.results;

    // const trendingMoviesPreviewList = document.querySelector('#trendingPreview .trendingPreview-movieList')
    // Esta linea vacia la informacion que hay al momento de cargar
    //genericSection.innerHTML="";
    
    // movies.forEach(movie => {

    //     const movieContainer = document.createElement('div');
    //     movieContainer.classList.add('movie-container');

    //     const movieImg = document.createElement('img');
    //     movieImg.classList.add('movie-img');
    //     movieImg.setAttribute('alt', movie.title);
    //     movieImg.setAttribute('src', 'https://image.tmdb.org/t/p/w300' + movie.poster_path);

    //     movieContainer.appendChild(movieImg);
    //     genericSection.appendChild(movieContainer);

    // });

    createMovies(movies, genericSection);

}

async function getMoviesBySearch(query) {
    // Uso de forma AXIOS
    const { data } = await api('search/movie', {
        params: {
            query,
        },
    });
    const movies = data.results;

    createMovies(movies, genericSection);
}


async function getTrendingMovies() {
    // Uso de forma AXIOS
    const { data } = await api('trending/movie/day');
    const movies = data.results;

    createMovies(movies, genericSection);
}


async function getMovieById(id) {
    // Uso de forma AXIOS
    const { data: movie } = await api('movie/'+id);

    // Mostrar la imagen principal con un degradado negro
    const movieImgUrl = 'https://image.tmdb.org/t/p/w500' + movie.poster_path;
    headerSection.style.background = `
        linear-gradient(
            180deg,
            rgba(0, 0, 0, 0.35) 19.27%,
            rgba(0, 0, 0, 0) 29.17%
        ),
        url(${movieImgUrl})
    `;

    movieDetailTitle.textContent = movie.title;
    movieDetailDescription.textContent = movie.overview;
    movieDetailScore.textContent = movie.vote_average;

    createCategories(movie.genres, movieDetailCategoriesList);

    getRelatedMoviesById(id);
}

async function getRelatedMoviesById(id) {
    const { data } = await api(`movie/${id}/similar`);
    const relatedMovies = data.results;

    createMovies(relatedMovies, relatedMoviesContainer);
    relatedMoviesContainer.scrollTo(0, 0);
}