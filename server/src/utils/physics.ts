/**
 * Ce module contient des stubs pour la logique de physique côté serveur.
 * Dans une implémentation complète, on utiliserait une bibliothèque de
 * mécanique (comme cannon-es) ou un moteur custom pour appliquer
 * l’accélération, le drift et les collisions de manière autoritative.
 */

export interface Vector2 {
  x: number;
  z: number;
}

export function updatePlayerPosition(pos: Vector2, input: { forward: boolean; backward: boolean; left: boolean; right: boolean }, dt: number) {
  // vitesse de base (m/s)
  const speed = 5;
  if (input.forward) pos.z -= speed * dt;
  if (input.backward) pos.z += speed * dt;
  if (input.left) pos.x -= speed * dt;
  if (input.right) pos.x += speed * dt;
}
