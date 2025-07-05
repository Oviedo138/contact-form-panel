import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ConfirmationService } from 'primeng/api';
import { DynamicDialogRef } from 'primeng/dynamicdialog';
import { LoginService } from 'src/app/layout/service/login.service';
import { ToastService } from 'src/app/main/services/toast.service';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { PrimeNgModule } from 'src/app/primeng.module';

@Component({
  selector: 'app-recover-password',
  standalone: true,  // 
  templateUrl: './recover-password.component.html',
  imports: [CommonModule, ReactiveFormsModule,PrimeNgModule]  //
})
export class RecoverPasswordComponent implements OnInit {

  public emailForm: FormGroup;
  public isLoading = false;

  constructor(
    public ref: DynamicDialogRef,
    private toastService: ToastService,
    private authService: LoginService,
    private formBuilder: FormBuilder
  ) {
    this.emailForm = this.formBuilder.group({
      email: [
        '',
        [
          Validators.required,
          Validators.pattern(
            '^[A-Za-z0-9._%-]+@[A-Za-z0-9._%-]+\\.[a-z]{2,6}$'
          ),
        ],
      ],
    });
  }

  ngOnInit(): void {}

  public async submitForm() {
    if (this.emailForm.invalid) {
      this.emailForm.markAllAsTouched();
      return;
    }

    let formValue = this.emailForm.value;
    await this.sendRecoveryEmail(formValue.email);
  }

  async sendRecoveryEmail(email: string) {
    this.isLoading = true;
    const response = await this.authService.sendRecoveryEmail(email);
    console.log(response);
    
    if (response.res) {
      this.isLoading = false;
      this.toastService.showSuccess('Instrucciones enviadas', 'Revisa tu correo electrónico');
      this.ref.close();
    } else {
      this.toastService.showError('Error', response.message);
    }

    this.isLoading = false;
  }

}
