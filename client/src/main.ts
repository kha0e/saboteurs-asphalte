import { initializeScene } from './scene';
import { Client } from 'colyseus.js';

async function init() {
  const hud = document.getElementById('hud');
  if (!hud) return;

  // init WebGL scene
  const { update, dispose } = initializeScene();

  // connect to server (if available)
  try {
    // Determine appropriate server host. When running on Render (onrender.com),
    // replace "client" with "server" in the hostname and omit the port, since
    // Render assigns a dynamic port exposed via standard 443/80. For local
    // development (localhost), use the default Colyseus port (2567).
    const isRender = location.hostname.endsWith('.onrender.com');
    const serverHost = isRender
      ? location.hostname.replace('client', 'server')
      : location.hostname;
    const protocol = location.protocol === 'https:' ? 'wss' : 'ws';
    const endpoint = isRender
      ? `${protocol}://${serverHost}`
      : `${protocol}://${serverHost}:2567`;
    const client = new Client(endpoint);
    const room = await client.joinOrCreate('race', {});
    hud.innerText = 'Connecté au serveur\nJoueurs dans la salle: 1';
    room.onStateChange((state) => {
      hud.innerText = `Joueurs dans la salle: ${Object.keys(state.players || {}).length}`;
    });
  } catch (err) {
    console.warn('Unable to connect to server, running offline mode.', err);
    hud.innerText = 'Mode hors-ligne';
  }

  // animation loop
  function animate() {
    update();
    requestAnimationFrame(animate);
  }
  animate();

  // cleanup when leaving
  window.addEventListener('beforeunload', () => {
    dispose();
  });
}

init().catch((err) => console.error(err));