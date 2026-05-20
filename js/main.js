const SUPABASE_URL = "https://zrctexmeczzrvmiarcoq.supabase.co";
const SUPABASE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InpyY3RleG1lY3p6cnZtaWFyY29xIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzkwMjY4MzcsImV4cCI6MjA5NDYwMjgzN30.rM5dqGZrY_8nGtMsIOEpOW5nedsp1vrFK55Km85k9p0";

const client = supabase.createClient(
    SUPABASE_URL,
    SUPABASE_KEY
);

async function logOut() {
    await client.auth.signOut();
}

async function indiceDeConnection() {
    const {
        data: { user }
    } = await client.auth.getUser();
    if (!user) {
        return null;
    }
    return user.id;
}

document.getElementById("deconnection")
.addEventListener("click", (event) => {

        event.preventDefault();
        logOut();
        window.location.href = "connexion.html";

});

document.getElementById("welcome")
.addEventListener("click", (event) => {
    event.preventDefault();
    indiceDeConnection().then((id) => {
        if (id) {
            window.open(`profil.html?id=${id}`);
        }
    });
});

document.addEventListener("DOMContentLoaded",async () => {
    const connecte = document.getElementById("connecte");
    const nonConnecte = document.getElementById("non-connecte");
    const welcome = document.getElementById("welcome");

    const {
        data: { user }
    } = await client.auth.getUser();

    if (user) {
        connecte.hidden = false;
        nonConnecte.hidden = true;
        const {
            data, error
        } = await client.from("profiles").select("*").eq("id", user.id).single();
        
        //console.log("USER:", user);
        //console.log("PROFILE DATA:", data);
        //console.log("ERROR:", error);

        /*if (!data || error) {

            console.log("Profil introuvable");

            return;
        }*/

        welcome.innerText = data.pseudo;
    }else{
        connecte.hidden = true;
        nonConnecte.hidden = false;
    }

});

async function verifierConnexion() {

    const session =
    await client.auth.getSession();

    console.log(session);
}

verifierConnexion();