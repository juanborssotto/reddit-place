import { Injectable } from '@angular/core';
import { AngularFireDatabase } from "angularfire2/database";
import { Tile } from "../models/tile";

@Injectable({
  providedIn: 'root'
})
export class TileService {

  private tilesRef = this.db.list<Tile>('tiles');

  constructor(private db: AngularFireDatabase) {}

  async getTiles(): Promise<Tile[]> {
    const snapshot = await this.db.database
      .ref()
      .child('/tiles')
      .once('value');
    let tiles: Tile[] = [];
    snapshot.forEach(tile => {
      tiles.push({
        key:   tile.key, 
        x:     tile.val()['x'], 
        y:     tile.val()['y'],
        color: tile.val()['color']
      });
    });
    return tiles;
  }

  getTilesRef() {
    return this.tilesRef;
  }

  updateTile(key: string, tile: Tile) {
    this.tilesRef.update(key, tile);
  }
}
