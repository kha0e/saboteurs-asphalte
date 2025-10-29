import { initializeScene } from './scene';
import { Client } from 'colyseus.js';

async function init() {
  const hud = document.getElementById('hud');
  if (!hud) return;

  // init WebGL scene
  const { update, dispose } = initializeScene();

  // connect to server (if available)
  try {
    const client = new Client(`${location.protocol === 'https:' ? 'wss' : 'ws'}://${location.hostname}:2567`);
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
