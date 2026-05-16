const bouton = document.getElementById("bouton");

const texte = document.getElementById("texte");

bouton.addEventListener("click", () => {
    texte.innerText = "Le JavaScript fonctionne !";
});
