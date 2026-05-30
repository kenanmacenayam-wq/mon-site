/*import {

    createClient

} from

"https://esm.sh/@supabase/supabase-js";
const SUPABASE_URL = "https://zrctexmeczzrvmiarcoq.supabase.co";
const SUPABASE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InpyY3RleG1lY3p6cnZtaWFyY29xIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzkwMjY4MzcsImV4cCI6MjA5NDYwMjgzN30.rM5dqGZrY_8nGtMsIOEpOW5nedsp1vrFK55Km85k9p0";

const client = supabase.createClient(
    SUPABASE_URL,
    SUPABASE_KEY
);*/
let peer;
let localStream;
const configuration = {iceServers: [{ urls:"stun:stun.l.google.com:19302" }] };
const {
    data: { user }
} = await client.auth.getUser();

if (user) {
    const pendingCandidates = [];
    const {
        data, error
    } = await client.from("profiles").select("*").eq("id", user.id).single();
    peer = new RTCPeerConnection(configuration);
    peer.onicecandidate =
    async event => {
        if (!event.candidate) {
            return;
        }
        await client
        .from("signaling")
        .insert({
            sender: user.id,
            type: "candidate",
            data: event.candidate
        });
    };
    peer.ontrack = event => {
        const audio = document.createElement("audio");
        audio.srcObject = event.streams[0];
        audio.autoplay = true;
        document.body.appendChild(audio);
    };
    const emeteur = data.role === "admin" || data.role === "proprietaire";
    if (emeteur) {
        document.getElementById("start").textContent = "Démarrer le live !";
        document.getElementById("start")
        .addEventListener("click", async () => {
            localStream = await navigator.mediaDevices
            .getUserMedia({audio: true});
            localStream
            .getTracks()
            .forEach(track => {
                peer.addTrack(
                    track,
                    localStream
                );
            });
            const offer = await peer.createOffer();
            await peer.setLocalDescription(offer);
            await client.from("signaling").insert({
                type: "offer",
                data: offer
            });
        });
    }
    client
    .channel("signaling")
    .on(
        "postgres_changes",
        {
            event: "INSERT",
            schema: "public",
            table: "signaling"
        },
        async payload => {
            const message = payload.new;
            if (message.sender === user.id) {
                return;
            }
            if (!emeteur && message.type === "offer"){
                await peer
                .setRemoteDescription(
                    message.data
                );
                const answer = await peer.createAnswer();
                await peer
                .setLocalDescription(
                    answer
                );
                await client
                .from("signaling")
                .insert({
                    type: "answer",
                    data: answer
                });
                console.log("Message reçu !");
            }
            if (emeteur && message.type === "answer") {
                console.log(message.data);
                await peer.setRemoteDescription(
                    new RTCSessionDescription(
                        message.data
                    )
                );
                for (const candidate of pendingCandidates) {
                    await peer.addIceCandidate(
                        candidate
                    );
                }
                pendingCandidates.length = 0;
                document.getElementById("start").textContent = "Live en cours !";
            }
            if (message.type === "candidate") {
                if (peer.remoteDescription) {
                    console.log(
                        "candidate reçue",
                        peer.remoteDescription
                    );
                    await peer.addIceCandidate(
                        new RTCIceCandidate(
                            message.data
                        )
                    );
                } else {
                    pendingCandidates.push(
                        message.data
                    );
                }
            }
        }
    )
    .subscribe();
}













/*
document.addEventListener("DOMContentLoaded",async () => {
    const {
        data: { user }
    } = await client.auth.getUser();

    if (user) {
        const {
            data, error
        } = await client.from("profiles").select("*").eq("id", user.id).single();
        if (data.role === "admin" || data.role === "proprietaire") {
            const start = document.getElementById("start");
            start.textContent = "Démarrer le live !";
            document.getElementById("start")
            .addEventListener("click", async () => {
                    const localStream = await navigator.mediaDevices
                    .getUserMedia({audio: true});
                    const audio = document.createElement("audio");
                    audio.srcObject = localStream;
                    audio.autoplay = true;
                    document.body.appendChild(audio);
                    const peer = new RTCPeerConnection();
                    localStream
                    .getTracks()
                    .forEach(track => {
                        peer.addTrack(track, localStream);
                    });
                    const offer = await peer.createOffer();
                    await peer.setLocalDescription(offer);
                    await client.from("signaling")
                    .insert({
                        type: "offer",
                        data: offer
                    });
                    // Ecoute les réponses
                    await peer.setRemoteDescription(
                        answer
                    );
                    peer.onicecandidate =
                    async event => {
                        if (event.candidate) {
                            await client.from("signaling")
                            .insert({
                                type: "candidate",
                                data: event.candidate
                            });
                        }
                    };
            });
        }else{
            const peer = new RTCPeerConnection();
            client
            .channel("signaling")
            .on(
                "postgres_changes",
                {
                    event: "INSERT",
                    schema: "public",
                    table: "signaling"
                },
                async payload => {
                    console.log(payload);
                }
            )
            .subscribe();
            await peer.setRemoteDescription(
                payload.new.data
            );
            const answer = await peer.createAnswer();
            await peer.setLocalDescription(
                answer
            );
            await client
            .from("signaling")
            .insert({
                type: "answer",
                data: answer
            });
            await peer.addIceCandidate(
                candidate
            );
            peer.ontrack = event => {
                const remoteAudio =
                document.createElement("audio");
                remoteAudio.srcObject =
                event.streams[0];
                remoteAudio.autoplay = true;
                document.body.appendChild(
                    remoteAudio
                );

            };
        }
    }
});*/
