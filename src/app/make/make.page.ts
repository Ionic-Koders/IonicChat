import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FormGroup, FormBuilder } from "@angular/forms";
import { User } from '../shared/User';
import { UserService } from '../shared/user-service';
import { AlertController, ToastController } from '@ionic/angular';

@Component({
  selector: 'app-make',
  templateUrl: './make.page.html',
  styleUrls: ['./make.page.scss'],
})
export class MakePage implements OnInit {

  form: FormGroup;
  userList = [];
  myInfo: User;
  userName: string;

  constructor(
    private apiService: UserService,
    private router: Router,
    public fb: FormBuilder,
    private alertCtrl: AlertController,
    private toastCtrl: ToastController
  ) { }

  ngOnInit() {
    this.form = this.fb.group({
      name: [''],
      email: ['']
    })
    this.myInfo = JSON.parse(localStorage.getItem('user'));
  }

  onFormSubmit() {
    this.userList = [];
    if (!this.form.valid) {
      return false;
    } else {
      this.apiService.getUserList().snapshotChanges().subscribe(res => {
        res.forEach(user => {
          let a = user.payload.toJSON();
          if (this.myInfo.uid == user.key) {
            this.userName = a["name"];
          }
          if (this.form.value.name == a["name"] && this.myInfo.uid != user.key) {
            a['uid'] = user.key;
            this.userList.push(a as User);
          }
        })
      });
    }
  }

  async addUser(user) {
    const alert = this.alertCtrl.create({
      message: "Agree to add " + user.name + " with your friend?",
      subHeader: "Add Friend!",
      buttons: [
        {
          text: 'OK',
          handler: () => {
            this.apiService.addUser(this.myInfo, this.userName, user).then(async res => {
              const toast = this.toastCtrl.create({
                message: 'Added successfully!',
                duration: 1000
              });
              (await toast).present();
              this.form.reset();
              this.userList = [];
            });
          }
        },
        {
          text: 'Cancel'
        }
      ]
    });
    (await alert).present();
  }
}
