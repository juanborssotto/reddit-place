import { Injectable } from '@angular/core';
import { AngularFireDatabase } from "angularfire2/database";
import { HttpClient } from '@angular/common/http';
import { User } from "../models/user";
import { USER_CONFIG } from '../config/userConfig';

@Injectable({
  providedIn: 'root'
})
//Singleton service
export class UserService {
  private usersRef = this.db.list<User>('users');
  private user: User;

  constructor(private db: AngularFireDatabase, private http: HttpClient) {}

  getUser() {
    return this.user;
  }

  async initUser() {
    const ipAddress  = await this.getIpAddress();
    this.user = {ipAddress};
    const userExists = await this.userExists();
    if(userExists)
      this.user = await this.getUserFromDb();
  }

  async saveUser() {
    if(this.user.key == undefined) {
      await this.addUser();
      this.updateUserAvailableTime();
    }
  }

  async updateUserAvailableTime() {
    if(this.user.key != undefined) {
      this.user.availableAgain = Date.now() + USER_CONFIG.waitingTime;
      this.usersRef.update(this.user.key, this.user);
    }
  }

  async userExists(): Promise<boolean> {
    const snapshot = await this.db.database
      .ref()
      .child('/users')
      .orderByChild('ipAddress')
      .equalTo(this.user.ipAddress)
      .limitToFirst(1)
      .once('value');
    return snapshot.hasChildren();
  }

  private async getUserFromDb(): Promise<User> {
    const snapshot = await this.db.database
      .ref()
      .child('/users')
      .orderByChild('ipAddress')
      .equalTo(this.user.ipAddress)
      .limitToFirst(1)
      .once('value');
    if(!snapshot.hasChildren())
      return undefined;
    let user: User;
    snapshot.forEach(u => {
      user = {
        key:            u.key, 
        ipAddress:      u.val()['ipAddress'], 
        availableAgain: u.val()['availableAgain']
      };
    });
    return user;
  }

  private async getUserKey(): Promise<string> {
    const snapshot = await this.db.database
      .ref()
      .child('/users')
      .orderByChild('ipAddress')
      .equalTo(this.user.ipAddress)
      .limitToFirst(1)
      .once('value');
    if(!snapshot.hasChildren())
      return undefined;
    let key: any;
    snapshot.forEach(user => {
      key = user.key;
    });
    return key;
  }

  private async addUser() {
    const ref = this.usersRef.push(this.user);
    this.user.key = ref.key;
  }

  private removeUser(key) {
    this.usersRef.remove(key);
  }

  private async getIpAddress() {
    let data: any = await this.http.get('https://jsonip.com').toPromise();
    try {
      return data.ip;
    } 
    catch {
      return undefined;
    }
  }
}
