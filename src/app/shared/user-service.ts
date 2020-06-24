import { Injectable } from '@angular/core';
import { User } from './User';
import { AngularFireDatabase, AngularFireList, AngularFireObject } from '@angular/fire/database';

@Injectable({
    providedIn: 'root'
})

export class UserService {
    userList: AngularFireList<any>;
    userRef: AngularFireObject<any>;
    chatList: AngularFireList<any>;

    constructor(private db: AngularFireDatabase) { }

    addUser(myInfo, userName, user) {
        let roomId = this.db.createPushId().toString();
        this.userRef = this.db.object('/contact/' + myInfo.uid + '/' + this.db.createPushId().toString());
        this.db.object('/contact/' + user.uid + '/' + this.db.createPushId().toString()).set({id: myInfo.uid, name: userName, roomId: roomId});
        return this.userRef.set({id: user.uid, name: user.name, roomId: roomId});
    }

    // Create
    createUser(id, name, email) {
        return this.db.object('/user/' + id).update({
            name: name,
            email: email
        })
    }

    // Get single object
    getContactList(id: string) {
        this.userList = this.db.list('/contact/' + id);
        return this.userList;
    }

    // Get Chat object
    getChatList(id: string) {
        this.chatList = this.db.list('/chat/' + id);
        return this.chatList;
    }

    sendMessage(roomId, id, msg) {
        return this.db.list('/chat/' + roomId + '/').push({id: id, msg: msg});
    }

    // Get list
    getUserList() {
        this.userList = this.db.list('/user');
        return this.userList;
    }

    // Update
    updateUser(id, user: User) {
        return this.userRef.update({
            name: user.name,
            email: user.email
        })
    }

    // Delete
    deleteUser(myId: string, id: string) {
        this.userRef = this.db.object('/contact/' + myId + '/' + id);
        this.userRef.remove();
    }
}