// JEU AVEC MARIO 
const mario = document.querySelector(".mario")

window.addEventListener("keydown", (event) => {

    console.log(event.key)

    // On récupère le style à chaque appui (position dynamique)
    let style = window.getComputedStyle(mario, null)

    if (event.key == "ArrowLeft") {
        // On récupère la position Left de Mario 
        let positionLeft = style.getPropertyValue("left")
        // On enlève de la string les caractères px
        positionLeft = positionLeft.slice(0, -2)
        // On convertit notre string en integer
        positionLeft = parseInt(positionLeft)
        // On enlève 2 (déplacement vers la gauche )
        positionLeft = positionLeft - 4
        // On met à jour le style de Mario depuis le JS 
        mario.style.left = `${positionLeft}px`

    } else if (event.key == "ArrowRight") {
        // déplace vers la droite 
        let positionLeft = style.getPropertyValue("left")
        // On enlève de la string les caractères px
        positionLeft = positionLeft.slice(0, -2)
        // On convertit notre string en integer
        positionLeft = parseInt(positionLeft)
        // On enlève 2 (déplacement vers la gauche )
        positionLeft = positionLeft + 4
        // On met à jour le style de Mario depuis le JS 
        mario.style.left = `${positionLeft}px`

    } else if (event.code == "Space") {
        // mario saute 
        console.log("le saut !")

        mario.classList.add("jump")

        setTimeout(() => mario.classList.remove("jump"), 300) 

    } else if (event.key == "ArrowDown" || event.key == "Control") {
        // Mario se baisse

    }

})