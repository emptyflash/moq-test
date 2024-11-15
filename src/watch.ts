import { Player } from "@kixelated/moq/playback";
import { Client, Connection } from "@kixelated/moq/transfork";

const urlParams = new URLSearchParams(window.location.search);
const server = urlParams.get("server") ?? "relay.quic.video"; // Adjust default server as needed

let canvas = document.getElementById("video-canvas") as HTMLCanvasElement;
let errorContainer = document.getElementById("error-container");

let connection: Connection | undefined;
let player: Player | undefined;

// Display error messages
function displayError(message: string) {
    if (errorContainer) {
        errorContainer.textContent = `Error: ${message}`;
    }
}

// Initialize client connection
async function initializeConnection() {
    const url = `https://${server}`;
    const fingerprint = server.startsWith("localhost") ? `https://${server}/fingerprint` : undefined;

    const client = new Client({ url, fingerprint });

    try {
        connection = await client.connect();
        initializePlayer();
    } catch (err) {
        displayError(`Failed to connect to server: ${err}`);
    }
}

// Initialize player with connection and canvas
function initializePlayer() {
    if (!connection || !canvas) return;

    player = new Player({ connection, path: ["bbb"], canvas });

    player.closed().catch((err) => displayError(`Player closed: ${err}`));

    // Unmute when the canvas is clicked
    canvas.addEventListener("click", unmute);
}

// Handle player unmute functionality
function unmute() {
    if (player) {
        player.unmute();
    }
}

// Clean up when page unloads
window.addEventListener("beforeunload", () => {
    if (player) player.close();
});

// Start the connection and player setup
initializeConnection();
