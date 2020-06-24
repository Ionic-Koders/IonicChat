import { Component, OnInit } from '@angular/core';
import { Router } from "@angular/router";
import { UserService } from '../shared/user-service';
import { AuthenticationService } from "../shared/authentication-service";

@Component({
  selector: 'app-logout',
  templateUrl: './logout.page.html',
  styleUrls: ['./logout.page.scss'],
})
export class LogoutPage implements OnInit {

  userId: string;
  userName: string;
  email: string;

  constructor(
    public authService: AuthenticationService,
    private userService: UserService
  ) { }

  ngOnInit() {
    this.userId = JSON.parse(localStorage.getItem('user')).uid
    this.userService.getUserList().snapshotChanges().subscribe(data => {
      data.forEach(user => {
        let a = user.payload.toJSON();
        if (user.key == this.userId) {
          this.userName = a["name"];
          this.email = a["email"];
        }
      })
    })
  }

}
