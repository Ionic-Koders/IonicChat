import { Component, OnInit, ViewChild } from '@angular/core';
import { UserService } from '../shared/user-service';
import { ActivatedRoute } from '@angular/router';
import { IonContent, IonInput } from '@ionic/angular';
import { Keyboard } from '@ionic-native/keyboard/ngx';

@Component({
  selector: 'app-chat',
  templateUrl: './chat.page.html',
  styleUrls: ['./chat.page.scss'],
})
export class ChatPage implements OnInit {

  @ViewChild(IonContent, { static: false }) contentArea: IonContent;
  @ViewChild('myInpput') input: IonInput;

  messages = [];
  newmessage: string;
  userId: string;
  roomId: string;

  constructor(
    private apiService: UserService,
    private route: ActivatedRoute,
    private keyboard: Keyboard
  ) {}

  ngOnInit() {
    this.userId = JSON.parse(localStorage.getItem('user')).uid;
    this.route.params.subscribe(params => {
      this.roomId = params['id'];
    });
    let chatRes = this.apiService.getChatList(this.roomId);
    chatRes.valueChanges().subscribe(data => {
      this.messages = data;
    })
  }

  send() {
    if (this.newmessage != '') {
      this.apiService.sendMessage(this.roomId, this.userId, this.newmessage).then(() => {
        this.newmessage = '';
        this.contentArea.scrollToBottom(100);
      });
    }
  }
}
