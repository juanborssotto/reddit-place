import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { map } from 'rxjs/operators';
import { TileService } from '../services/tile.service';
import { UserService } from '../services/user.service';
import { Tile } from '../models/tile';

@Component({
  selector: 'app-tile',
  templateUrl: './tile.component.html',
  styleUrls: ['./tile.component.css']
})
export class TileComponent implements OnInit {
  @Input('tile') tile: Tile;
  @Output() userCannotModify = new EventEmitter<number>();
  lastColor: string;

  constructor(private tileService: TileService, 
              private userService: UserService) {}

  ngOnInit() {
    this.lastColor = this.tile.color;
  }

  async colorPickerSelected() {
    const userExists = await this.userService.userExists();
    if(!userExists) {
      this.updateTile();
      this.userService.saveUser();
    }
    else if(Date.now() >= this.userService.getUser().availableAgain) {
      this.updateTile();
      this.userService.updateUserAvailableTime();
    }
    else {
      const timeLeft = 
        Math.round(
          (this.userService.getUser().availableAgain - Date.now()) * 0.001)
      this.tile.color = this.lastColor;
      this.userCannotModify.emit(timeLeft);
    }
  }

  updateTile() {
    this.tileService.updateTile(this.tile.key, this.tile);
    this.lastColor = this.tile.color;
  }
}
