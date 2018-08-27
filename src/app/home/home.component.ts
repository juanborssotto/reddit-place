import { Component, OnInit, EventEmitter } from '@angular/core';
import { TileService } from '../services/tile.service';
import { UserService } from '../services/user.service';
import { Observable } from 'rxjs/Observable';
import { map } from 'rxjs/operators';
import { Tile } from '../models/tile';
import { User } from '../models/user';
import { SnackbarMessage } from '../models/snackbarMessage';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
  tiles: Tile[] = [];

  //Snackbar component
  snackbarMessageDuration: number = 1500;
  showSnackbar = new EventEmitter<SnackbarMessage>();

  constructor(private tileService: TileService, 
    private userService: UserService) {}

  ngOnInit() {
    this.initTiles();
    this.userService.initUser();
    this.watchTilesChanges();
  }

  async initTiles() {
    this.tiles = await this.tileService.getTiles();
  }
  
  watchTilesChanges() {
    this.tileService
      .getTilesRef()
      .snapshotChanges()
      .subscribe(
        tiles =>  {
          tiles.forEach(tile => {
            this.tiles
              .find(t => t.key === tile.key).color = tile.payload.val().color;
          });
        },
        error => console.log(error)
      );
  }
  
  //Received from tile component
  userCannotModifyEvent(timeLeft) {
    this.showSnackbar.emit({
      message: `Cannot modify for ${timeLeft} seconds`,
      duration: this.snackbarMessageDuration
    });
  }
}
