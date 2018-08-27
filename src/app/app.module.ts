import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { AppComponent } from './app.component';
import { ColorPickerModule } from 'ngx-color-picker';
import { HttpClientModule } from '@angular/common/http';
import { AppRoutingModule } from './app.routing.module';

//Custom components
import { HomeComponent } from './home/home.component';
import { TileComponent } from './tile/tile.component';
import { SnackbarComponent } from './snackbar/snackbar.component';

//Firebase
import { AngularFireModule } from 'angularfire2';
import { FIREBASE_CONFIG } from './firebase.credentials';
import { AngularFireDatabaseModule } from 'angularfire2/database';

//Services
import { TileService } from './services/tile.service';
import { UserService } from './services/user.service';

@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    TileComponent,
    SnackbarComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    AngularFireModule.initializeApp(FIREBASE_CONFIG),
    AngularFireDatabaseModule,
    ColorPickerModule,
    HttpClientModule
  ],
  providers: [
    TileService,
    UserService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
