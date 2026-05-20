//const SUPABASE_URL = "https://zrctexmeczzrvmiarcoq.supabase.co";
//const SUPABASE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InpyY3RleG1lY3p6cnZtaWFyY29xIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzkwMjY4MzcsImV4cCI6MjA5NDYwMjgzN30.rM5dqGZrY_8nGtMsIOEpOW5nedsp1vrFK55Km85k9p0";

//const client = supabase.createClient(
//    SUPABASE_URL,
//    SUPABASE_KEY
//);

const emailInput =
document.getElementById("email");

const passwordInput =
document.getElementById("password");

document.addEventListener("DOMContentLoaded",async () => {

    const boutonInscription =
    document.getElementById("inscription");

    if (boutonInscription) {

        boutonInscription.addEventListener("click",async () => {

            const email =
                document.getElementById("email").value;

            const password =
                document.getElementById("password").value;

            const pseudo =
                document.getElementById("pseudo").value;

            const age =
                parseInt(
                    document.getElementById("age").value
                );

            /* Création du compte */

            const {
                data,
                error
            } = await client.auth.signUp({

                email,
                password

            });

            if (error) {

                alert(error.message);

                return;
            }

            /* ID utilisateur */

            const user = data.user;

            /* Insertion profil */

            const {
                error: profileError
            } = await client
            .from("profiles")
            .insert({

                id: user.id,

                pseudo: pseudo,

                age: age

            });

            if (profileError) {

                console.log(profileError);

                alert("Erreur profil");

            } else {
                window.location.href = "index.html";
                //alert("Compte créé !");
            }
        });
    }

    const boutonConnexion =
    document.getElementById("connexion");
    if (boutonConnexion) {

        boutonConnexion.addEventListener("click",async () => {
            const { data, error } =
            await client.auth.signInWithPassword({

                email: emailInput.value,

                password: passwordInput.value

            });

            console.log(data);
            console.log(error);

            if (error) {

                alert("Erreur : " + error.message);

            } else {

                window.location.href = "index.html";
                //alert("Connecté !");
            }
        });
    }
});