const API_KEY = 'b206c542';
const API_URL = 'https://www.omdbapi.com/';

class Movie {
    constructor(data) {
        this.id     = data.imdbID;
        this.title  = data.Title;
        this.year   = data.Year;
        this.poster = data.Poster;
        this.type   = data.Type;
    }

    hasPoster() {
        return this.poster && this.poster !== 'N/A';
    }
}

class FavoriteManager {
    constructor() {
        this.storageKey = 'movie_favorites';
        this.favorites  = JSON.parse(localStorage.getItem(this.storageKey)) || [];
    }

    save() {
        localStorage.setItem(this.storageKey, JSON.stringify(this.favorites));
    }

    isFavorite(movieId) {
        return this.favorites.some(fav => fav.id === movieId);
    }

    add(movie) {
        if (!this.isFavorite(movie.id)) {
            this.favorites.push(movie);
            this.save();
        }
    }

    remove(movieId) {
        this.favorites = this.favorites.filter(fav => fav.id !== movieId);
        this.save();
    }

    getAll() {
        return this.favorites;
    }
}

class MovieApp {
    constructor() {
        this.favManager     = new FavoriteManager();
        this.searchInput    = document.getElementById('movieInput');
        this.searchBtn      = document.getElementById('movieSearchBtn');
        this.favBtn         = document.getElementById('favBtn');
        this.resultsEl      = document.getElementById('movieResults');
        this.favoritesEl    = document.getElementById('favoritesList');
        this.favoritesPanel = document.getElementById('favoritesPanel');
        this.errorEl        = document.getElementById('movieError');
        this.loaderEl       = document.getElementById('movieLoader');
        this.favPanelOpen   = false;
        this.bindEvents();
    }

    bindEvents() {
        this.searchBtn.addEventListener('click', () => this.search());
        this.searchInput.addEventListener('keydown', (e) => {
            if (e.key === 'Enter') this.search();
        });
        this.favBtn.addEventListener('click', () => this.toggleFavorites());
    }

    async search() {
        const query = this.searchInput.value.trim();
        if (!query) return;

        this.setLoading(true);
        this.errorEl.style.display = 'none';
        this.resultsEl.innerHTML   = '';

        try {
            const res  = await fetch(`${API_URL}?apikey=${API_KEY}&s=${encodeURIComponent(query)}&type=movie`);
            const data = await res.json();

            if (data.Response === 'False') {
                this.showError('Aucun film trouve pour "' + query + '".');
                return;
            }

            const movies = data.Search.map(item => new Movie(item));
            this.renderMovies(movies, this.resultsEl, false);

        } catch (e) {
            this.showError('Erreur reseau. Verifiez votre connexion.');
        } finally {
            this.setLoading(false);
        }
    }

    renderMovies(movies, container, isFavPanel) {
        container.innerHTML = '';

        if (movies.length === 0) {
            container.innerHTML = '<p>Aucun favori pour linstant.</p>';
            return;
        }

        movies.forEach(movie => {
            const card       = document.createElement('div');
            card.classList.add('movie-card');
            const alreadyFav = this.favManager.isFavorite(movie.id);

            card.innerHTML = `
                <img src="${movie.hasPoster() ? movie.poster : 'https://via.placeholder.com/100x148?text=No+Image'}" alt="${movie.title}" />
                <div class="movie-info">
                    <h3>${movie.title}</h3>
                    <p>${movie.year}</p>
                    <button class="fav-btn ${alreadyFav ? 'is-fav' : ''}" data-id="${movie.id}">
                        ${alreadyFav ? 'Retirer des favoris' : 'Ajouter aux favoris'}
                    </button>
                </div>
            `;

            const btn = card.querySelector('.fav-btn');
            btn.addEventListener('click', () => this.toggleFavorite(movie, btn, isFavPanel));
            container.appendChild(card);
        });
    }

    toggleFavorite(movie, btn, isFavPanel) {
        if (this.favManager.isFavorite(movie.id)) {
            this.favManager.remove(movie.id);
            btn.textContent = 'Ajouter aux favoris';
            btn.classList.remove('is-fav');
            if (isFavPanel) this.renderFavorites();
        } else {
            this.favManager.add(movie);
            btn.textContent = 'Retirer des favoris';
            btn.classList.add('is-fav');
        }
        this.syncSearchButtons(movie.id);
    }

    syncSearchButtons(movieId) {
        const btns = this.resultsEl.querySelectorAll('.fav-btn[data-id="' + movieId + '"]');
        btns.forEach(btn => {
            const isFav     = this.favManager.isFavorite(movieId);
            btn.textContent = isFav ? 'Retirer des favoris' : 'Ajouter aux favoris';
            btn.classList.toggle('is-fav', isFav);
        });
    }

    toggleFavorites() {
        this.favPanelOpen = !this.favPanelOpen;
        this.favoritesPanel.style.display = this.favPanelOpen ? 'block' : 'none';
        if (this.favPanelOpen) this.renderFavorites();
    }

    renderFavorites() {
        const favMovies = this.favManager.getAll().map(f => new Movie({
            imdbID : f.id,
            Title  : f.title,
            Year   : f.year,
            Poster : f.poster,
            Type   : f.type,
        }));
        this.renderMovies(favMovies, this.favoritesEl, true);
    }

    setLoading(state) {
        this.loaderEl.style.display = state ? 'block' : 'none';
    }

    showError(msg) {
        this.errorEl.textContent   = msg;
        this.errorEl.style.display = 'block';
        this.setLoading(false);
    }
}

const app = new MovieApp();
