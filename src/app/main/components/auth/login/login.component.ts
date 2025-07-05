import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { CheckboxModule } from 'primeng/checkbox';
import { DialogService } from 'primeng/dynamicdialog';
import { InputTextModule } from 'primeng/inputtext';
import { PasswordModule } from 'primeng/password';
import { LayoutService } from 'src/app/layout/service/app.layout.service';
import { LoginService } from 'src/app/layout/service/login.service';
import { RecoverPasswordComponent } from 'src/app/widgets/recover-password/recover-password.component';


@Component({
    standalone: true,
    imports: [
        CommonModule,
        FormsModule,
        ReactiveFormsModule,
        PasswordModule,
        CheckboxModule,
        RouterModule,
        InputTextModule,
        ButtonModule,
        
    ],
    providers: [DialogService],
    selector: 'app-login',
    templateUrl: './login.component.html',
    styles: [
        `
            :host ::ng-deep .pi-eye,
            :host ::ng-deep .pi-eye-slash {
                transform: scale(1.6);
                margin-right: 1rem;
                color: var(--primary-color) !important;
            }
        `,
    ],
})
export class LoginComponent {

    valCheck: string[] = ['remember'];
    password!: string;

    public loginForm: FormGroup;
    public loader = false;
    public msgs: any[] = [];
    public showMessages = true;

    constructor(
        public fb: FormBuilder,
        public layoutService: LayoutService,
        public loginService: LoginService,
        public dialogService: DialogService,
    ) {
        this.loginForm = this.fb.group({
            email: ['', [Validators.required, Validators.pattern("^[A-Za-z0-9._%-]+@[A-Za-z0-9._%-]+\\.[a-z]{2,6}$")]],
            password: ['', [Validators.required, Validators.minLength(6)]],
        });
    }

    public async submitForm() {
        try {
            this.loader = true;
            this.msgs = [];
            if (this.loginForm.invalid) {
                this.loginForm.markAllAsTouched();
                this.showErrorViaMessages();
                return;
            }

            if (this.loginForm.valid) {
                this.loader = true;
                await this.loginService.login(
                    this.loginForm.value.email,
                    this.loginForm.value.password
                );
            }
            return
        } catch (e: any) {
            console.log('error', e)
            this.showErrorViaMessages();
            this.loader = false;
        } finally {
            this.loader = false;
        }
    }

    showErrorViaMessages() {
        this.msgs = [];
        this.msgs.push({ severity: 'error', summary: 'Error', detail: 'Por favor verifique sus datos' });
    }

    recoverPassword() {
         this.showMessages = false;
         const dialogRef = this.dialogService.open(RecoverPasswordComponent, {
           header: "Recuperar contraseña",
          contentStyle: { overflow: 'auto' },
           baseZIndex: 10000,
         });

         dialogRef.onClose.subscribe(async () => {
          this.msgs = [];
           this.showMessages = true;
         });
    }

}
