// APP WEATHER 


// Reproduire le widget Météo déjà effectuén en PHP 
// Afficher le temps, les degrés; le logo du temps, la description mais aussi que : 

// Par défaut la météo affiche le temps local -> il est possible grace au navigateur de récupérer votre position lat et long
// Pour la doc de la Géoloc -> https://www.w3schools.com/html/html5_geolocation.asp
// Pour l'api -> https://home.openweathermap.org/

// Bonus : Un in put qui permet de rechercher AUSSI via le nom de la ville 

const API_KEY = '26391b415a59f4c5598d7811951e97b9';

// ─── Récupération des éléments du DOM ────────────────────────────────────────
const cityInput   = document.getElementById('cityInput');
const searchBtn   = document.getElementById('searchBtn');
const geoBtn      = document.getElementById('geoBtn');

const cityName    = document.getElementById('cityName');
const countryEl   = document.getElementById('country');
const weatherIcon = document.getElementById('weatherIcon');;
const tempEl      = document.getElementById('temp');
const feelsEl     = document.getElementById('feels');
const descEl      = document.getElementById('description');
const errorEl     = document.getElementById('error');
const cardEl      = document.getElementById('weatherCard');
const loaderEl    = document.getElementById('loader');

// ─── Emojis par condition météo ───────────────────────────────────────────────
const weatherEmojis = {
  Thunderstorm : '⛈️',
  Drizzle      : '🌦️',
  Rain         : '🌧️',
  Snow         : '❄️',
  Mist         : '🌫️',
  Smoke        : '🌫️',
  Haze         : '🌫️',
  Dust         : '🌫️',
  Fog          : '🌁',
  Sand         : '🌫️',
  Ash          : '🌋',
  Squall       : '💨',
  Tornado      : '🌪️',
  Clear        : '☀️',
  Clouds       : '☁️',
};

// ─── Afficher / cacher le loader ──────────────────────────────────────────────
function setLoading(state) {
  loaderEl.style.display = state ? 'block' : 'none';
  cardEl.style.display   = state ? 'none'  : '';
  errorEl.style.display  = 'none';
}

// ─── Afficher une erreur ──────────────────────────────────────────────────────
function showError(msg) {
  errorEl.textContent   = msg;
  errorEl.style.display = 'block';
  cardEl.style.display  = 'none';
  loaderEl.style.display = 'none';
}

// ─── Rendre le widget avec les données de l'API ───────────────────────────────
function renderWeather(data) {
  cityName.textContent    = data.name;
  countryEl.textContent   = data.sys.country;
  tempEl.textContent      = `${Math.round(data.main.temp)}°C`;
  feelsEl.textContent     = `Ressenti : ${Math.round(data.main.feels_like)}°C`;
  descEl.textContent      = data.weather[0].description;
  weatherIcon.textContent = weatherEmojis[data.weather[0].main] || '🌡️';

  cardEl.style.display    = 'block';
  loaderEl.style.display  = 'none';
}

// ─── Appel API par coordonnées (géolocalisation) ──────────────────────────────
async function fetchByCoords(lat, lon) {
  setLoading(true);
  try {
    const res  = await fetch(
      `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${API_KEY}&units=metric&lang=fr`
    );
    const data = await res.json();
    if (data.cod !== 200) throw new Error(data.message);
    renderWeather(data);
  } catch (e) {
    showError('Impossible de récupérer la météo pour votre position.');
  }
}

// ─── Appel API par nom de ville ───────────────────────────────────────────────
async function fetchByCity(city) {
  if (!city.trim()) return;
  setLoading(true);
  try {
    const res  = await fetch(
      `https://api.openweathermap.org/data/2.5/weather?q=${encodeURIComponent(city)}&appid=${API_KEY}&units=metric&lang=fr`
    );
    const data = await res.json();
    if (data.cod !== 200) throw new Error(data.message);
    renderWeather(data);
  } catch (e) {
    showError(`Ville "${city}" introuvable.`);
  }
}

// ─── Géolocalisation navigateur ───────────────────────────────────────────────
function geolocate() {
  if (!navigator.geolocation) {
    showError('La géolocalisation n\'est pas supportée par votre navigateur.');
    return;
  }
  setLoading(true);
  navigator.geolocation.getCurrentPosition(
    (pos) => fetchByCoords(pos.coords.latitude, pos.coords.longitude),
    ()    => showError('Accès à la position refusé.')
  );
}

// ─── Événements ───────────────────────────────────────────────────────────────
searchBtn.addEventListener('click', () => fetchByCity(cityInput.value));
cityInput.addEventListener('keydown', (e) => {
  if (e.key === 'Enter') fetchByCity(cityInput.value);
});
geoBtn.addEventListener('click', geolocate);

// ─── Par défaut : météo locale au chargement ──────────────────────────────────
geolocate();