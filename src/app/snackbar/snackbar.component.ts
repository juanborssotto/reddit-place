import { Component, OnInit, Input, EventEmitter } from '@angular/core';
import { Subscription } from 'rxjs/Subscription';
import { SnackbarMessage } from '../models/snackbarMessage';

@Component({
  selector: 'app-snackbar',
  templateUrl: './snackbar.component.html',
  styleUrls: ['./snackbar.component.css']
})
export class SnackbarComponent implements OnInit {
  message: string = '';
  @Input('showSnackbar') showSnackbar: EventEmitter<SnackbarMessage>;
  showSnackbarSubscription: Subscription;
  snackbarClass: string = '';
  
  constructor() {}

  ngOnInit() {
    this.showSnackbarSubscription = 
      this.showSnackbar.subscribe(snackbarMessage => {
        this.message = snackbarMessage.message;
        this.snackbarClass = 'show';
        setTimeout(() => this.snackbarClass = '', snackbarMessage.duration);
      });
  }

  ngOnDestroy() {
    try {this.showSnackbarSubscription.unsubscribe();} catch {}
  }
}
