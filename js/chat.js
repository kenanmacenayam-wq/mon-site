import {
    createClient
} from
"https://esm.sh/@supabase/supabase-js";

const SUPABASE_URL = "https://zrctexmeczzrvmiarcoq.supabase.co";
const SUPABASE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InpyY3RleG1lY3p6cnZtaWFyY29xIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzkwMjY4MzcsImV4cCI6MjA5NDYwMjgzN30.rM5dqGZrY_8nGtMsIOEpOW5nedsp1vrFK55Km85k9p0";

const client = supabase.createClient(
    SUPABASE_URL,
    SUPABASE_KEY
);
const {
    data: { user }
} = await client.auth.getUser();
function afficherMessage(message) {
    const div =
    document.createElement("div");
    div.innerHTML = `
        <strong>
            ${message.pseudo}
        </strong>
        :
        ${message.contenu}
    `;
    document
    .getElementById("messages")
    .appendChild(div);
    const messagesDiv =
    document.getElementById(
        "messages"
    );
    messagesDiv.scrollTop = messagesDiv.scrollHeight;
}
const {
    data: messages
} = await client
.from("messages")
.select("*")
.order(
    "date_envoi", { ascending: true }
);
messages.forEach(
    afficherMessage
);
document
.getElementById("send")
.addEventListener("click", async () => {
        const input = document.getElementById("message-input");
        const contenu = input.value;
        if (!contenu) {return;}
        const {
            data, error
        } = await client.from("profiles").select("*").eq("id", user.id).single();
        await client
        .from("messages")
        .insert({
            user_id: user.id,
            pseudo: data.pseudo,
            contenu: contenu
        });
        input.value = "";
});
client
.channel("chat")
.on(
    "postgres_changes",
    {
        event: "INSERT",
        schema: "public",
        table: "messages"
    },
    payload => {
        afficherMessage(
            payload.new
        );
    }
)
.subscribe();