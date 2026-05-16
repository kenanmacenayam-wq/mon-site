const bouton = document.getElementById("bouton");

const texte = document.getElementById("texte");

etat = 0

bouton.addEventListener("click", () => {
    if (etat==0){
        texte.innerText = "Le JavaScript fonctionne !";
        etat = 1;
    }else{
        texte.innerText = "May be !";
        etat = 0;
    }
});
