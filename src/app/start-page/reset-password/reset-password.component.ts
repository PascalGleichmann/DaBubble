import { Component, EventEmitter, Input, Output, inject } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { Auth, User, user, signInWithEmailAndPassword, createUserWithEmailAndPassword } from '@angular/fire/auth';
import { Subscription } from 'rxjs';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-reset-password',
  standalone: true,
  imports: [],
  templateUrl: './reset-password.component.html',
  styleUrl: './reset-password.component.scss'
})
export class ResetPasswordComponent {
  
  authService: AuthService = inject(AuthService);


  private auth: Auth = inject(Auth);
  email: string = '';
  password: string = '';

  toggleToLogin() {
    this.authService.showLogin = true;
    this.authService.showResetPassword = false;
  }

  resetPassword() {
    
  }

}
