import { Injectable, NgZone } from '@angular/core';
import { auth } from 'firebase/app';
import { User } from './user';
import { Router } from "@angular/router";
import { AngularFireAuth } from "@angular/fire/auth";
import { AngularFirestore, AngularFirestoreDocument } from '@angular/fire/firestore';

@Injectable({
    providedIn: 'root'
})

export class AuthenticationService {
    userData: any;

    constructor(
        public afStore: AngularFirestore,
        public ngFireAuth: AngularFireAuth,
        public router: Router,
        public ngZone: NgZone
    ) {
        this.ngFireAuth.onAuthStateChanged(user => {
            if (user == null) {
                localStorage.removeItem('user');
            } else {
                this.userData = user;
                localStorage.setItem('user', JSON.stringify(this.userData));
            }
        })
    }

    SignIn(email, password) {
        return this.ngFireAuth.signInWithEmailAndPassword(email, password)
    }

    RegisterUser(email, password) {
        return this.ngFireAuth.createUserWithEmailAndPassword(email, password)
    }

    PasswordRecover(passwordResetEmail) {
        return this.ngFireAuth.sendPasswordResetEmail(passwordResetEmail)
        .then(() => {
            window.alert('Password reset email has been sent, please check your inbox.');
        }).catch((error) => {
            window.alert(error)
        });
    }

    get isLoggedIn(): boolean {
        const user = JSON.parse(localStorage.getItem('user'));
        return (user != null && user.emailVerified !== false) ? true : false;
    }

    get isEmailVerified(): boolean {
        const user = JSON.parse(localStorage.getItem('user'));
        return (user.emaiVerified !== false) ? true : false;
    }   

    GoogleAuth() {
        return this.AuthLogin(new auth.GoogleAuthProvider());
    }

    async AuthLogin(provider) {
        try {
            const result = await this.ngFireAuth.signInWithPopup(provider);
            this.ngZone.run(() => {
                this.router.navigate(['dashboard']);
            });
            this.SetUserData(result.user);
        }
        catch (error) {
            window.alert(error);
        }
    }

    SetUserData(user) {
        const userRef: AngularFirestoreDocument<any> = this.afStore.doc(`users/${user.uid}`);
        const userData: User = {
            uid: user.uid,
            email: user.email,
            name: user.name,
            photoURL: user.photoURL
        }
        return userRef.set(userData, {
            merge: true
        })
    }

    async SignOut() {
        await this.ngFireAuth.signOut();
        localStorage.removeItem('user');
        this.router.navigate(['']);
    }
}