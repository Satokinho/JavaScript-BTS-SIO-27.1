// Faire Pokedex avec la Poke API -> https://pokeapi.co/api/v2/pokemon

// 1 - Faire une requete API avec l'outil de votre choix (axios, ou fetch)
// 2 - Afficher dès l'initialisation de la page la liste des pokemons (vous pouvez limiter leur nombre)
// 3 - Pour chaque pokemon -> le nom, la photo et le type
// 4 - Afficher les résultats de manière propre (grid par exemple) 

// Faire barre de recherche + un bouton de type submit 
// Quand on clique sur le bouton on doit chercher dans l'API le pokemon en question (en passant par son nom seulement)
// Si on en trouve un on l'affiche, sinon un message "Pas de pokemon trouvé ..."

// On recup le container destiné à recevoir les divs des Pokemons 
const container = document.querySelector(".container-pokedex")
const input = document.querySelector("input[type=text]")
const submit = document.querySelector(".search-btn") 

// L'URL qui permet de recup les pokemons (limité à 20 dans notre cas)
const pokeUrl = "https://pokeapi.co/api/v2/pokemon?limit=1500&offset=0"

// Chargement initial des 20 premiers pokemons 
window.addEventListener("DOMContentLoaded", () => {
    // On appelle notre fonction afin qu'elle s'éxecute
    fetchPokemons()
})

// Ecouteur d'evenement sur le bouton de recherche
submit.addEventListener("click", () => {
    // Si l'input n'est pas vide
    if (input.value != "") {
        // O,n, assigne à une variable le contenu de notre input
        let inputValue = input.value

        fetch(pokeUrl + "/" + inputValue)
        .then(res => res.json())
        .then(data => {

            container.innerHTML = ""

            displayPokemon(data.name, data.types[0].type.name, data.sprites.front_default)
        })
        .catch(err => {
            console.log(err)
            container.innerHTML = "<h3>Désolé aucun Pokemon ne correspond à votre recherche</h3>"
            return
        })
    }
})

// La fonction qui vient fetch les pokemons mais aussi créer les éléments HTML et les remplir 
function fetchPokemons() {
    fetch(pokeUrl, {
        method: "GET", 
        headers : {
            "Accept" : "application/json"
        }}
    )
    .then(res => res.json())
    .then(data => {
        console.log(data)

        let pokemons = data.results

        pokemons.forEach(pokemon => {
            let name = pokemon.name
            let pokemonId = pokemons.indexOf(pokemon) + 1
            let imgUrl = `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${pokemonId}.png` 

            // Récupération du type avec un fetch à nouveau
            fetch(`https://pokeapi.co/api/v2/pokemon/${pokemonId}`)
            .then(res => res.json())
            .then (data => {
                // On recup le nom du type de pokemon à afficher 
                let type = data.types[0].type.name

                displayPokemon(name, type, imgUrl)
            })
            .catch(err => console.log(err))
        })
    })
    .catch(err => console.log(err))
}

// Fonction qui affiche un Pokemon (création des elems HTML et on les remplit du bon texte)
function displayPokemon(name, type, imgUrl) {
    // On crée une div, container pour chaque pokemon, un h3 et une image pour le nom et la photo 
    let div = document.createElement("div")
    let h3 = document.createElement("h3")
    let h4 = document.createElement("h4")
    let img = document.createElement("img")

    // On donne du contenu à notre h3 et une source pour notre image 
    h3.textContent = name
    h4.textContent = type
    img.src = imgUrl
    div.append(h3, h4, img)

    // Enfin on vient insérer le tout dans notre container 
    container.appendChild(div)
}
