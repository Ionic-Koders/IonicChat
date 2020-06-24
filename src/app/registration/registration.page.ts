import { Component, OnInit } from '@angular/core';
import { Router } from "@angular/router";
import { AuthenticationService } from "../shared/authentication-service";
import { UserService} from "../shared/user-service";

@Component({
  selector: 'app-registration',
  templateUrl: './registration.page.html',
  styleUrls: ['./registration.page.scss'],
})

export class RegistrationPage implements OnInit {

  constructor(
    public userService: UserService,
    public authService: AuthenticationService,
    public router: Router
  ) { }

  ngOnInit() {
  }

  signUp(name, email, password) {
    this.authService.RegisterUser(email.value, password.value)
    .then((res) => {
      // Do something here
      this.userService.createUser(res.user.uid, name.value, email.value)
      this.router.navigate(['dashboard']);
    }).catch((error) => {
      window.alert(error.message);
    })
  }
}
