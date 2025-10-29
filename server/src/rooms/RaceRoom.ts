import { Room, Client } from 'colyseus';
import { Schema, MapSchema, type } from '@colyseus/schema';

class PlayerState extends Schema {
  @type('number') x = 0;
  @type('number') z = 0;
  @type('number') rotation = 0;
}

class State extends Schema {
  @type({ map: PlayerState }) players = new MapSchema<PlayerState>();
}

export class RaceRoom extends Room<State> {
  maxClients = 4;
  tickRate = Number(process.env.ROOM_TICK_RATE || 20);

  onCreate() {
    this.setState(new State());

    this.onMessage('move', (client, data) => {
      const player = this.state.players.get(client.sessionId);
      if (!player) return;
      // simple update from client (trust for prototype)
      const { x, z, rotation } = data;
      player.x = x;
      player.z = z;
      player.rotation = rotation;
    });
  }

  onJoin(client: Client) {
    const player = new PlayerState();
    this.state.players.set(client.sessionId, player);
  }

  onLeave(client: Client) {
    this.state.players.delete(client.sessionId);
  }
}
