import * as THREE from 'three';

interface SceneController {
  update: () => void;
  dispose: () => void;
}

/**
 * Initialise la scène Three.js et renvoie des callbacks pour mettre à jour et nettoyer.
 */
export function initializeScene(): SceneController {
  const canvas = document.createElement('canvas');
  document.body.appendChild(canvas);

  // renderer
  const renderer = new THREE.WebGLRenderer({ canvas, antialias: true });
  renderer.setPixelRatio(window.devicePixelRatio);
  renderer.setSize(window.innerWidth, window.innerHeight);

  // scène
  const scene = new THREE.Scene();
  scene.background = new THREE.Color(0x202020);

  // caméra
  const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
  camera.position.set(0, 5, 10);

  // lumière
  const ambient = new THREE.AmbientLight(0xffffff, 0.5);
  scene.add(ambient);
  const dir = new THREE.DirectionalLight(0xffffff, 0.5);
  dir.position.set(5, 10, 7.5);
  scene.add(dir);

  // piste (plane)
  const trackGeometry = new THREE.PlaneGeometry(50, 50);
  const trackMaterial = new THREE.MeshStandardMaterial({ color: 0x333333 });
  const track = new THREE.Mesh(trackGeometry, trackMaterial);
  track.rotation.x = -Math.PI / 2;
  scene.add(track);

  // voiture (cube)
  const carGeometry = new THREE.BoxGeometry(1, 0.5, 2);
  const carMaterial = new THREE.MeshStandardMaterial({ color: 0xff0000 });
  const car = new THREE.Mesh(carGeometry, carMaterial);
  car.position.y = 0.25;
  scene.add(car);

  // états d’entrée
  const keys: Record<string, boolean> = {};
  window.addEventListener('keydown', (e) => {
    keys[e.code] = true;
  });
  window.addEventListener('keyup', (e) => {
    keys[e.code] = false;
  });

  // gestion redimensionnement
  window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
  });

  // logique d’update
  const velocity = new THREE.Vector3();
  const speed = 0.1;

  function update() {
    // mise à jour de la vitesse selon les touches
    if (keys['ArrowUp'] || keys['KeyW']) {
      velocity.z -= speed;
    }
    if (keys['ArrowDown'] || keys['KeyS']) {
      velocity.z += speed;
    }
    if (keys['ArrowLeft'] || keys['KeyA']) {
      car.rotation.y += 0.05;
    }
    if (keys['ArrowRight'] || keys['KeyD']) {
      car.rotation.y -= 0.05;
    }

    // appliquer la rotation du véhicule à la vitesse
    const direction = new THREE.Vector3(0, 0, 1).applyAxisAngle(new THREE.Vector3(0, 1, 0), car.rotation.y);
    car.position.add(direction.multiplyScalar(velocity.z));
    // amortissement de la vitesse
    velocity.z *= 0.9;

    // camera follow
    const cameraOffset = new THREE.Vector3(0, 5, 10).applyAxisAngle(new THREE.Vector3(0, 1, 0), car.rotation.y);
    camera.position.copy(car.position).add(cameraOffset);
    camera.lookAt(car.position);

    renderer.render(scene, camera);
  }

  function dispose() {
    renderer.dispose();
  }

  return { update, dispose };
}
