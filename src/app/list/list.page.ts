import { Component, OnInit, ViewChild } from '@angular/core';
import { AuthenticationService } from "../shared/authentication-service";
import { Router } from '@angular/router';
import { User } from '../shared/User';
import { UserService } from '../shared/user-service';
import { IonReorderGroup } from '@ionic/angular';
import { AlertController } from '@ionic/angular';

@Component({
  selector: 'app-list',
  templateUrl: './list.page.html',
  styleUrls: ['./list.page.scss'],
})
export class ListPage implements OnInit {

  UsersArray = [];
  userId: string;

  constructor(
    public authService: AuthenticationService,
    private apiService: UserService,
    private router: Router,
    private alertCtrl: AlertController
  ) { }

  ngOnInit() {
    this.userId = JSON.parse(localStorage.getItem('user')).uid;
    let bookingRes = this.apiService.getContactList(this.userId);
    bookingRes.snapshotChanges().subscribe(res => {
      this.UsersArray = [];
      res.forEach(item => {
        let a = item.payload.toJSON();
        a['uid'] = item.key;
        this.UsersArray.push(a);
      })
    })
  }

  async deleteUser(id) {
    const alert = this.alertCtrl.create({
      message: 'Delete this user?',
      subHeader: 'Delete',
      buttons: [
        {
          text: 'Yes',
          handler: () => {
            this.apiService.deleteUser(this.userId, id);
          }
        },
        {
          text: 'No'
        }
      ]
    });
    (await alert).present();
  }

  clickChat(user) {
    let roomId = user.roomId;
    this.router.navigate(['chat', roomId]);
  }

  @ViewChild(IonReorderGroup, { static: true }) reorderGroup: IonReorderGroup;
  reorderList(ev: any) {
    console.log('Dragged from index', ev.detail.from, 'to', ev.detail.to);
    ev.detail.complete();
  }

  toggleReorderGroup() {
    this.reorderGroup.disabled = !this.reorderGroup.disabled;
  }
}
