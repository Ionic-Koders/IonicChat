import { Component } from '@angular/core';
import { Router } from "@angular/router";

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage {

  user: any;

  constructor(
    public router: Router
  ) {
    this.user = JSON.parse(localStorage.getItem('user'));
    if (this.user != null) {
      this.router.navigate(['dashboard']);
    }
  }

}
