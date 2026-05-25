function formatTaille(bytes) {
    if (bytes < 1024) {
        return bytes + " o";
    }
    if (bytes < 1024 * 1024) {
        return (bytes / 1024).toFixed(2) + " KB";
    }
    if (bytes < 1024 * 1024 * 1024) {
        return (bytes / 1024 / 1024).toFixed(2) + " MB";
    }
    return (bytes / 1024 / 1024 / 1024).toFixed(2) + " GB";
}
async function afficherFichiers() {
    const liste = document.getElementById("liste-fichiers");
    liste.innerHTML = "";
    const {
        data: { user }
    } = await client.auth.getUser();
    const { data : fichiers, error } = await client.from("fichiers").select("*").eq("user_id", user.id).order("date_upload", {ascending: false});
    if (error || !fichiers) {
        console.error("Erreur lors de la récupération des fichiers :", error, fichiers);
        liste.innerHTML = "<p>Erreur lors de la récupération des fichiers</p>";
        return;
    }
    console.log("fichiers récupérés :", fichiers);
    if (fichiers.length === 0) {
        liste.innerHTML = "<p>Aucun fichier</p>";
        return;
    }
    for (const fichier of fichiers) {

        const div = document.createElement("div");

        div.className = "fichier";
        div.innerHTML = `

            <p>${fichier.nom}</p>

            <button class="ouvrir">
                Ouvrir
            </button>

            <button class="supprimer">
                Supprimer
            </button>
            ${formatTaille(fichier.taille)}
        `;
        // ? `<p>${(fichier.size / 1024).toFixed(2)} KB</p>` : ""}
        liste.appendChild(div);
        const {data : data} = client.storage.from("fichiers").getPublicUrl(fichier.url);

        const url = data.publicUrl;
        div.querySelector(".ouvrir")
        .addEventListener("click", () => {
                window.open(url);
        });
        div.querySelector(".supprimer")
        .addEventListener("click", () => {
            async function supprimer() {
                div.remove();
                if (fichiers.length === 1) {
                    liste.innerHTML = "<p>Aucun fichier</p>";
                }
                await client.from("fichiers").delete().eq("id", fichier.id);
                await client.storage.from("fichiers").remove([fichier.url]);
            }
            supprimer();
        });
    }
}
afficherFichiers();
document.getElementById("upload")
.addEventListener("click", async () => {

        const input = document.getElementById("file-input");

        const file = input.files[0];

        if (!file) {
            alert("Aucun fichier");
            return;
        }
        const {
            data: { user }
        } = await client.auth.getUser();

        const  nom = `${user.id}_${Date.now()}_${file.name}`;

        const {
            data,
            error
        } = await client.storage

        .from("fichiers")

        .upload(`uploads/${nom}`, file);

        const {
                error: profileError
        } =await client

        .from("fichiers")

        .insert({

            user_id: user.id,

            nom: file.name,

            url: data.path,

            taille: file.size,

            type: file.type

        });
        if (profileError) {
            console.log("Erreur : ", profileError);
        }
        console.log("data:", data);
        console.log("error:", error);
        afficherFichiers();
});