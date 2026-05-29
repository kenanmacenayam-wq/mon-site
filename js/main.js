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
    const connecteHeader = document.getElementById("connecte");
    const nonConnecteHeader = document.getElementById("non-connecte");
    const connecteMain = document.getElementById("connecte-body");
    const nonConnecteMain = document.getElementById("non-connecte-body");
    const welcome = document.getElementById("welcome");

    const {
        data: { user }
    } = await client.auth.getUser();

    if (user) {
        connecteHeader.hidden = false; if (connecteMain){connecteMain.hidden = false;}
        nonConnecteHeader.hidden = true; if (nonConnecteMain){nonConnecteMain.hidden = true;}
        const {
            data, error
        } = await client.from("profiles").select("*").eq("id", user.id).single();
        if (welcome) {
            welcome.innerText = data.pseudo;
        }
    }else{
        connecteHeader.hidden = true; if(connecteMain){connecteMain.hidden = true;}
        nonConnecteHeader.hidden = false; if(nonConnecteMain){nonConnecteMain.hidden = false;}
    }
});

async function verifierConnexion() {
    const session = await client.auth.getSession();
    console.log(session);
}

verifierConnexion();