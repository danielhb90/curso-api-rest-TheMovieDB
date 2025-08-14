
// Habilitar funciones de botones
searchFormBtn.addEventListener('click', ()=>{
    //Tomar la informacion del formInput
    location.hash = '#search='+ searchFormInput.value;
});
trendingBtn.addEventListener('click', ()=>{
    location.hash = '#trends';
});
arrowBtn.addEventListener('click', ()=>{
    history.back();
    // location.hash = '#home';
});

// EventListeners para manejo de Hash
window.addEventListener('DOMContentLoaded', navigator, false);
window.addEventListener('hashchange', navigator, false);

function navigator() {
    console.log({ location });

    if (location.hash.startsWith('#trends')) {
        trendsPage();
    } else if (location.hash.startsWith('#search=')) {
        searchPage();
    } else if (location.hash.startsWith('#movie=')) {
        movieDetailsPage();
    } else if (location.hash.startsWith('#category=')) {
        categoriesPage();
    } else {
        homePage();
    }
    // hacer que la navegacion siempre comience desde el principio
    document.body.scrollTop = 0;
    document.documentElement.scrollTop = 0;
}

function homePage() {
    console.log('HOME');

    headerSection.classList.remove('header-container--long');
    headerSection.style.background = '';
    arrowBtn.classList.add('inactive');
    arrowBtn.classList.remove('header-arrow--white');
    headerTitle.classList.remove('inactive');
    headerCategoryTitle.classList.add('inactive');

    searchForm.classList.remove('inactive');
    trendingPreviewSection.classList.remove('inactive');
    categoriesPreviewSection.classList.remove('inactive');
    genericSection.classList.add('inactive');
    movieDetailSection.classList.add('inactive');

    getTrendingMoviesPreview();
    getCategoriesPreview();
}

function categoriesPage() {
    console.log('CATEGORIES');

    headerSection.classList.remove('header-container--long');
    headerSection.style.background = '';
    arrowBtn.classList.remove('inactive');
    arrowBtn.classList.remove('header-arrow--white');
    headerTitle.classList.add('inactive');
    headerCategoryTitle.classList.remove('inactive');

    searchForm.classList.add('inactive');
    trendingPreviewSection.classList.add('inactive');
    categoriesPreviewSection.classList.add('inactive');
    genericSection.classList.remove('inactive');
    movieDetailSection.classList.add('inactive');

    // Llamar a la funcion que muestre la informacion correcta de la API
    //const [ , urlCategoryInfo] = location.hash.split('=') // ['#category', 'id-name']
    const urlCategory = decodeURI(location.hash)
    const [ , urlCategoryInfo] = urlCategory.split('=') // ['#category', 'id-name']
    const [categoryID , categoryName ] = urlCategoryInfo.split('-') // ['id', 'name']
    getMoviesByCategory(categoryID);
    headerCategoryTitle.innerHTML = categoryName;

}

function movieDetailsPage() {
    console.log('MOVIE');

    headerSection.classList.add('header-container--long');
    // headerSection.style.background = '';
    arrowBtn.classList.remove('inactive');
    arrowBtn.classList.add('header-arrow--white');
    headerTitle.classList.add('inactive');
    headerCategoryTitle.classList.add('inactive');

    searchForm.classList.add('inactive');
    trendingPreviewSection.classList.add('inactive');
    categoriesPreviewSection.classList.add('inactive');
    genericSection.classList.add('inactive');
    movieDetailSection.classList.remove('inactive');

    // Llamar a la funcion que muestre la informacion correcta de la API
    const [ , movieId] = location.hash.split('=') // ['#movie', 'idMovie']
    getMovieById(movieId);

}

function searchPage() {
    console.log('SEARCH');

    headerSection.classList.remove('header-container--long');
    headerSection.style.background = '';
    arrowBtn.classList.remove('inactive');
    arrowBtn.classList.remove('header-arrow--white');
    headerTitle.classList.add('inactive');
    headerCategoryTitle.classList.add('inactive');

    searchForm.classList.remove('inactive');
    trendingPreviewSection.classList.add('inactive');
    categoriesPreviewSection.classList.add('inactive');
    genericSection.classList.remove('inactive');
    movieDetailSection.classList.add('inactive');

    // Llamar a la funcion que muestre la informacion correcta de la API
    const [ , queryMovie] = location.hash.split('=') // ['#search', 'searchMovie']
    getMoviesBySearch(queryMovie);

}

function trendsPage() {
    console.log('TRENDS');

    headerSection.classList.remove('header-container--long');
    headerSection.style.background = '';
    arrowBtn.classList.remove('inactive');
    arrowBtn.classList.remove('header-arrow--white');
    headerTitle.classList.add('inactive');
    headerCategoryTitle.classList.remove('inactive');

    searchForm.classList.add('inactive');
    trendingPreviewSection.classList.add('inactive');
    categoriesPreviewSection.classList.add('inactive');
    genericSection.classList.remove('inactive');
    movieDetailSection.classList.add('inactive');

    headerCategoryTitle.innerHTML = 'Tendencias';

    getTrendingMovies();
}