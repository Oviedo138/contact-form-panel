import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { AdminsService } from '../../services/admins.service';
import { ToastService } from 'src/app/main/services/toast.service';
import { DialogModule } from 'primeng/dialog';
import { DynamicDialogConfig, DynamicDialogModule, DynamicDialogRef } from 'primeng/dynamicdialog';
import { Admin } from '../../models/admin.model';
import { PasswordModule } from 'primeng/password';
import { DropdownModule } from 'primeng/dropdown';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { InputMaskModule } from 'primeng/inputmask';

@Component({
    standalone: true,
    imports: [
        CommonModule,
        FormsModule,
        ReactiveFormsModule,
        RouterModule,
        DialogModule,
        DynamicDialogModule,
        PasswordModule,
        DropdownModule,
        ButtonModule,
        InputTextModule,
        InputMaskModule,
    ],
    selector: 'app-admin-form',
    templateUrl: './admin-form.component.html',
})
export class AdminFormComponent {

    public admin: Admin;
    public adminForm: FormGroup;
    public loader: boolean = false;
    public isEdit: boolean = false;

    constructor(
        private formBuilder: FormBuilder,
        private adminsService: AdminsService,
        private toastService: ToastService,
        // private authService: AuthService,
        private config: DynamicDialogConfig,
        public ref: DynamicDialogRef,
    ) {
        this.admin = this.config.data.admin as Admin;
        this.adminForm = this.formBuilder.group({
            name: new FormControl('', Validators.required),
            email: ['', [Validators.required, Validators.pattern('^[A-Za-z0-9._%-]+@[A-Za-z0-9._%-]+\\.[a-z]{2,6}$'),],],
            phone: new FormControl(''),
            password: new FormControl('', [Validators.minLength(6), Validators.required,]),
            userType: new FormControl('', [Validators.required]),
        });
    }

    ngOnInit(): void {
        if (this.admin) {
            this.isEdit = true;
            this.adminForm.patchValue(this.admin);
            // this.adminForm.removeControl('password');
            this.adminForm.get('password')?.clearValidators();
            this.adminForm.get('password')?.updateValueAndValidity();
        }
    }

    async validateForm(): Promise<void> {

        console.log(this.adminForm.value);

        if (this.adminForm.invalid) {
            this.adminForm.markAllAsTouched();
            return;
        }
        this.isEdit ? await this.updateAdmin() : await this.createAdmin();
    }

    async createAdmin(): Promise<void> {
        try {
            this.loader = true;
            const response = await this.adminsService.createAdmin(this.adminForm.value);
            if (response?.status == 200) {
                // if (response.data && response.data != '') {
                //     // await this.createLog(response.data);
                // }
                this.toastService.showSuccess('Administrador creado correctamente');
                this.ref.close(true);
            }
        } catch (error: any) {
            console.log(error);

            this.toastService.showError('Ocurrió un error', 'Favor de intentarlo nuevamente');
        } finally {
            this.loader = false;
        }
    }


    async updateAdmin(): Promise<void> {
        try {
            this.loader = true;
            const formValues = this.adminForm.value;

            console.log(this.admin!.uid)

            formValues.uid = this.admin!.uid;
            const response = await this.adminsService.updateAdmin(formValues, this.admin.uid);
            if (response?.status == 200) {
                // await this.createLog(this.admin!._id!);
                this.toastService.showSuccess('Administrador actualizado correctamente');
                this.ref.close(true);
            }
        } catch (error: any) {
            this.toastService.showError('Ocurrió un error', 'Favor de intentarlo nuevamente');
        } finally {
            this.loader = false;
        }
    }

}
