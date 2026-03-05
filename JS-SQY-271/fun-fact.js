const h3 = document.querySelector("h3")
const button = document.querySelector("button")


// Première requete http vers une API avec fetch (déjà compris dans JS) 

// Je veux ajouter un bouton "Encore !" et quand on clique ça affiche un autre fact ...

// const axios = require('axios').default;

// Avec .then et .catch 
let apiEndpoint = "https://dogapi.dog/api/v2/facts"

// On attend que les éléments du DOM soient chargés afin de faire la requete initiale 
// pour afficher dès le chargement de la page un fact
window.addEventListener("DOMContentLoaded", () => {
    fetchDogFacts()
})

// // On écoute le bouton "Encore !" dès que l'on clique dessus on refait une requete avec fetch
button.addEventListener("click", () => {
    fetchDogFacts()
})


// // Version avec axios, .then et .catch 
function fetchDogFacts() {
    axios.get(apiEndpoint, {
        headers: {
        'Accept': 'application/json'
      }})
    .then(res => console.log(res))
    .catch(err => console.log(err))
}



// Version fetchj avec .then et .catch
// function fetchDogFacts() {
//     fetch(apiEndpoint, {
//         method: "GET",
//         headers: {
//             "Accept" : "application/json"
//         }
//     })
//     .then(res => res.json())
//     .then(data => {
//         // On recup le fact dans l'objet data (data.data car nous avons aussi appellé la réponse "data")
//         let fact = data.data[0].attributes.body
    
//         // On ajoute fact comme contenu texte pour notre h3
//         h3.textContent = fact
//     })
//     .catch(err => console.log(err))
// }

// Manière d'écrire avec la paire async / await 
// async function fetchDogFacts() {
//     const res = await fetch(apiEndpoint, {headers : {"Accept" : "application/json"}})

//     const data = await res.json()

//     console.log(data)

//     return data
// }