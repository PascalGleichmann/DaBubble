import { Injectable, inject } from '@angular/core';
import { Auth, User, createUserWithEmailAndPassword, getAuth, onAuthStateChanged, signInWithEmailAndPassword, updateProfile, user } from '@angular/fire/auth';
import { Router } from '@angular/router';
import { Subscription, } from 'rxjs';
import { UserType } from '../types/user.type';
import { Firestore, arrayUnion, collection, doc, getDocs, query, setDoc, where, writeBatch } from '@angular/fire/firestore';
import { SelectionService } from './selection.service';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private auth: Auth = inject(Auth);
  private firestore: Firestore = inject(Firestore);
  private router: Router = inject(Router);
  private selectionService: SelectionService = inject(SelectionService);

  email: string = '';
  password: string = '';
  name: string = '';
  selectedProfilePic: string = 'assets/img/start-page/unknown.svg';
  showLogin = true;
  showChooseProfilePicture: boolean = false;
  showResetPassword: boolean = false;
  showCreateAccount: boolean = false;
  guestEmail = 'guest@email.com';
  guestPassword = 'Passwort';

  user$ = user(this.auth);
  userSubscription: Subscription = new Subscription();

  constructor() {
    this.userSubscription = this.user$.subscribe((aUser: User | null) => {
    })
  }

  private createUserObject(): UserType {
    return {
      name: this.name,
      email: this.email,
      password: this.password,
      image: this.selectedProfilePic
    };
  }

  async toggleToChooseProfilePicture() {
    this.showChooseProfilePicture = true;
    this.showCreateAccount = false;
  }

  async register() {
    try {
      const userCredential = await createUserWithEmailAndPassword(this.auth, this.email, this.password);
      const user = userCredential.user;
      console.log('Registered user:', user);
      await updateProfile(user, { displayName: this.name });
      const userObject: UserType = this.createUserObject();
      console.log('User object:', userObject);
      const userDocRef = doc(this.firestore, 'users', user.uid);
      await setDoc(userDocRef, userObject);
    } catch (error) {
      console.error('Error registering user:', error);
    }
  }

  async login() {
    try {
      await signInWithEmailAndPassword(this.auth, this.email, this.password);
      this.selectionService.channelOrDM.next('channel');
      this.selectionService.choosenChatTypeId.next(this.selectionService.channelIds[0]);
      this.router.navigate(['main-page']);
    } catch (error) {
      console.error('Error signing in:', error);
    }
  }

  async loginAsGuest() {
    try {
      await signInWithEmailAndPassword(this.auth, this.guestEmail, this.guestPassword);
      this.selectionService.channelOrDM.next('channel');
      this.selectionService.choosenChatTypeId.next(this.selectionService.channelIds[0]);
      this.router.navigate(['main-page']);
    } catch (error) {
      console.error('Error signing in as guest:', error);
    }
  }

  getLoggedInUser(callback: any) {
    const auth = getAuth();
    onAuthStateChanged(auth, (user) => {
      if (user) {
        const loggedInUserId = user.uid;
        callback(loggedInUserId);
      } else {
        callback(null);
      }
    });
  }

  async addUserToAllDirectMessages(userId: string) {
    try {
      const directMessagesQuery = query(collection(this.firestore, 'direct-messages'), where('members', 'array-contains', userId));
      const querySnapshot = await getDocs(directMessagesQuery);
      const batch = writeBatch(this.firestore);
      querySnapshot.forEach((doc) => {
        batch.update(doc.ref, {
          members: arrayUnion(userId)
        });
      });
      await batch.commit();
      console.log('User added to all direct messages:', userId);
    } catch (error) {
      console.error('Error adding user to direct messages:', error);
    }
  }

  async logout() {
    try {
      await this.auth.signOut();
      this.router.navigate(['']);
    } catch (error) {
      console.error('Error logging out:', error);
    }
  }

  ngOnDestroy() {
    this.userSubscription.unsubscribe();
  }


}