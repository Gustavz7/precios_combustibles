import { Component, inject } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { LoginService } from '../../../core/services/login-service/login.service';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './register.component.html',
  styleUrl: './register.component.css'
})
export class RegisterComponent {
  loginService: LoginService = inject(LoginService);
  register_form: FormGroup;
  login_status: any = '';

  constructor() {


    this.register_form = new FormGroup({
      username: new FormControl<string>(''),
      email: new FormControl<string>(''),
      password: new FormControl<string>('')
    });
  }

  public async onSubmitRegister(): Promise<void> {
    this.login_status = await this.loginService.doRegister(this.register_form.value)
  }
}
