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

//localStorage
function likedMoviesList() {
    const item = JSON.parse(localStorage.getItem('liked_movies'));
    let movies;

    if (item) {
        movies = item;
    } else {
        movies = {};
    }

    return movies;
}


function likeMovie(movie) {
    const likedMovies = likedMoviesList();

    console.log(likedMovies);

    if (likedMovies[movie.id]) {
        console.log('la pelicula ya estaba en LS');
        likedMovies[movie.id] = undefined;

    } else {
        console.log('la pelicula NO estaba en LS');
        likedMovies[movie.id] = movie;
    }

    
    localStorage.setItem('liked_movies', JSON.stringify(likedMovies));
}


//Lazy loading for images
const lazyLoader = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
        if (entry.isIntersecting) {
            const urlImage = entry.target.getAttribute('data-img');
            entry.target.setAttribute('src', urlImage);
        }

    });
});


//Helpers
function createMovies(movies, container, {lazyLoad = false, clean = true}={}) {
    // un parametro nuevo para decidir si hacer limpieza o no del html
    if (clean) {
        container.innerHTML = '';
    }
    
    
    movies.forEach(movie => {

        const movieContainer = document.createElement('div');
        movieContainer.classList.add('movie-container');
        // movieContainer.addEventListener('click', () => {
        //     location.hash = '#movie=' + movie.id;
        // });

        const movieImg = document.createElement('img');
        movieImg.classList.add('movie-img');
        movieImg.setAttribute('alt', movie.title);
        movieImg.addEventListener('click', () => {
            location.hash = '#movie=' + movie.id;
        });


        // cambio para usar lazy loading
        // movieImg.setAttribute('src', 'https://image.tmdb.org/t/p/w300' + movie.poster_path);
        movieImg.setAttribute(lazyLoad ? 'data-img' : 'src', 'https://image.tmdb.org/t/p/w300' + movie.poster_path);
                
        // Solucion para errores de imagenes que no cargan
        movieImg.addEventListener('error', () => {
            movieImg.setAttribute('src', "./logos/logo-ci.svg");
            
        });

        // Crear boton para darle favorito
        const movieBtn = document.createElement('button');
        movieBtn.classList.add('movie-btn');
        //Forma de condicional usando &&
        likedMoviesList()[movie.id] && movieBtn.classList.add('movie-btn--liked');
        movieBtn.addEventListener('click', () => {
            movieBtn.classList.toggle('movie-btn--liked');
            likeMovie(movie);
            getLikedMovies(); // sirve para que cada vez que presionemos like, se actualice la seccion de favoritos
        });



        if(lazyLoad) {
            lazyLoader.observe(movieImg);
        }

        movieContainer.appendChild(movieImg);
        movieContainer.appendChild(movieBtn);
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

    createMovies(movies, trendingMoviesPreviewList, true);

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

    maxPage = data.total_pages;
    createMovies(movies, genericSection, { lazyLoad: true });

}

async function getMoviesBySearch(query) {
    // Uso de forma AXIOS
    const { data } = await api('search/movie', {
        params: {
            query,
        },
    });
    const movies = data.results;
    maxPage = data.total_pages;

    createMovies(movies, genericSection, { lazyLoad: true });
}

// Crear funcion para ver mas imagenes paginadas
function getPaginatedMoviesBySearch(query) {
    return async function () {
        // agregar condicional para saber el final del scroll y crear infinite scrolling
        const { scrollTop, scrollHeight, clientHeight} = document.documentElement;
        const scrollIsBottom = (scrollTop + clientHeight) >= (scrollHeight - 15);
        const pageIsNotMax = page < maxPage;

        if (scrollIsBottom && pageIsNotMax) {
            page++;
            // Uso de forma AXIOS
            const { data } = await api('search/movie', {
                params: {
                    query,
                    page,
                },
            });
            const movies = data.results;

            createMovies(movies, genericSection, { lazyLoad: true, clean: false });
        };

    }

}

function getPaginatedMoviesByCategory(id) {
    return async function () {
        // agregar condicional para saber el final del scroll y crear infinite scrolling
        const { scrollTop, scrollHeight, clientHeight} = document.documentElement;
        const scrollIsBottom = (scrollTop + clientHeight) >= (scrollHeight - 15);
        const pageIsNotMax = page < maxPage;

        if (scrollIsBottom && pageIsNotMax) {
            page++;
            // Uso de forma AXIOS
            const { data } = await api('discover/movie', {
                params: {
                    with_genres: id,
                    page,
                },
            });
            const movies = data.results;

            createMovies(movies, genericSection, { lazyLoad: true, clean: false });
        };

    }
}


async function getTrendingMovies() {
    // Uso de forma AXIOS
    const { data } = await api('trending/movie/day');
    const movies = data.results;
    maxPage = data.total_pages;

    createMovies(movies, genericSection, { lazyLoad: true, clean: true });

    // crear boton de cargar mas, para realizar paginacion
    // const btnLoadMore = document.createElement('button');
    // btnLoadMore.innerText = 'Cargar mas';
    // btnLoadMore.addEventListener('click', getPaginatedTrendingMovies);
    // genericSection.appendChild(btnLoadMore);
}


// Crear funcion para ver mas imagenes paginadas
async function getPaginatedTrendingMovies() {
    // agregar condicional para saber el final del scroll y crear infinite scrolling
    const { scrollTop, scrollHeight, clientHeight} = document.documentElement;
    const scrollIsBottom = (scrollTop + clientHeight) >= (scrollHeight - 15);

    const pageIsNotMax = page < maxPage;

    if (scrollIsBottom && pageIsNotMax) {
        page++;
        // Uso de forma AXIOS
        const { data } = await api('trending/movie/day', {
            params: {
                page,
            },
        });
        const movies = data.results;

        createMovies(movies, genericSection, { lazyLoad: true, clean: false });
    };

    // crear boton de cargar mas, para realizar paginacion
    // const btnLoadMore = document.createElement('button');
    // btnLoadMore.innerText = 'Cargar mas';
    // btnLoadMore.addEventListener('click', getPaginatedTrendingMovies);
    // genericSection.appendChild(btnLoadMore);

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

//function para manejo de localStorage

function getLikedMovies() {
    const likedMovies = likedMoviesList();
    const likedMoviesArray = Object.values(likedMovies);

    createMovies(likedMoviesArray, likedMoviesListArticle, {lazyLoad: true, clean: true});
    console.log(likedMovies)
}