const canvas =
document.getElementById("game");

const ctx =
canvas.getContext("2d");

canvas.width =
window.innerWidth;

canvas.height =
window.innerHeight;
const keys = {};
let x = 100;
let y = 100;

document.addEventListener("keydown",(event) => {
        keys[event.code] = true;
});
document.addEventListener("keyup", (event) => {
        keys[event.code] = false;
});
function clear() {
    ctx.clearRect(
        0,
        0,
        canvas.width,
        canvas.height
    );
}

function draw() {

    clear();

    ctx.fillStyle = "red";

    ctx.fillRect(x, y, 100, 100);

}

function gameLoop() {
    draw();
    if (keys["ArrowRight"] || keys["KeyD"]) {
        x += 5;
    }
    if (keys["ArrowLeft"] || keys["KeyA"]) {
        x -= 5;
    }
    if (keys["ArrowUp"] || keys["KeyW"]) {
        y -= 5;
    }
    if (keys["ArrowDown"] || keys["KeyS"]) {
        y += 5;
    }
    requestAnimationFrame(
        gameLoop
    );

}

gameLoop();