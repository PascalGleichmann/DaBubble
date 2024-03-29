import { Component, EventEmitter, Input, Output, inject } from '@angular/core';
import { RouterModule, Router } from '@angular/router';
import { Auth, User, user, signInWithEmailAndPassword, createUserWithEmailAndPassword } from '@angular/fire/auth';
import { Subscription } from 'rxjs';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import { IntroAnimationComponent } from '../intro-animation/intro-animation.component';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    RouterModule,
    FormsModule,
    IntroAnimationComponent,
    CommonModule
  ],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss'
})
export class LoginComponent {

  private auth: Auth = inject(Auth);
  private router: Router = inject(Router);
  authService: AuthService = inject(AuthService);

  email: string = '';
  password: string = '';



  async login() {
    this.authService.email = this.email;
    this.authService.password = this.password;
    await this.authService.login();
  }

  async loginAsGuest() {
    await this.authService.loginAsGuest();
  }

  toggleToResetPassword() {
    this.authService.showLogin = false;
    this.authService.showResetPassword = true;
  }
}
