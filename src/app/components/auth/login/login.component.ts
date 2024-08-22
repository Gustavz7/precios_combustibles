import { Component, inject } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { LoginService } from '../../../core/services/login-service/login.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent {

  loginService: LoginService = inject(LoginService);
  login_form: FormGroup;
  login_status: any = '';

  constructor() {
    this.login_form = new FormGroup({
      email: new FormControl<string>(''),
      password: new FormControl<string>('')
    });
  }
  public async onSubmitLogin(): Promise<void> {
    this.login_status = await this.loginService.doLogin(this.login_form.value)
  }

}
