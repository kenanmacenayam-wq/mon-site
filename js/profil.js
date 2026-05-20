
document.addEventListener(
    "DOMContentLoaded",
    async () => {

        const params = new URLSearchParams(window.location.search);

        const id = params.get("id");

        const {
            data,
            error
        } = await client

        .from("profiles")

        .select("*")

        .eq("id", id)

        .single();

        if (!data) {

            console.log("Profil introuvable");

            return;
        }

        document.getElementById("nom")
        .innerText = `Profil de ${data.pseudo}`;

        document.getElementById("age")
        .innerText = `Âge : ${data.age}`;

});