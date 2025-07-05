import { CommonModule } from '@angular/common';
import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { AvatarModule } from 'primeng/avatar';
import { ButtonModule } from 'primeng/button';
import { DynamicDialogRef } from 'primeng/dynamicdialog';
import { FileUploadModule } from 'primeng/fileupload';
import { InputMaskModule } from 'primeng/inputmask';
import { InputTextModule } from 'primeng/inputtext';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { LoginService } from 'src/app/layout/service/login.service';
import { MediaService } from 'src/app/layout/service/media/media.service';
import { Admin } from 'src/app/main/modules/administrators/models/admin.model';
import { AdminsService } from 'src/app/main/modules/administrators/services/admins.service';
import { ToastService } from 'src/app/main/services/toast.service';


interface CustomImage {
    file: File;
    image: string;
}

@Component({
    standalone: true,
    imports: [
        CommonModule,
        FormsModule,
        ReactiveFormsModule,
        InputTextModule,
        InputMaskModule,
        ButtonModule,
        ProgressSpinnerModule,
        FileUploadModule,
        AvatarModule,
    ],
    selector: 'app-new-profile-modal',
    templateUrl: './new-profile-modal.component.html',
    styles: [
        `
        ::ng-deep .p-progress-spinner {
        width: 40px !important;
        height: 40px !important;
        }

        ::ng-deep #uploadBtn .p-button .p-button-icon-left {
            display: none;
        }

        ::ng-deep #uploadBtn .p-button {
            padding: 0;
            font-size: 12px;
            color: var(--primary);
            background-color: white;
            border: none;
        }
        ::ng-deep #uploadBtn .p-button :hover {
            padding: 0;
            font-size: 12px;
            color: var(--primary);
            background-color: white;
            border: none;
        }
        `
    ]
})
export class NewProfileModalComponent implements OnInit {

    public user?: Admin;
    public isLoading = false;
    public form: FormGroup;
    public loadingInfo = true;
    public tmpImage?: CustomImage;
    public oldImage?: string;

    constructor(
        private formBuilder: FormBuilder,
        private authService: LoginService,
        private adminsService: AdminsService,
        private toastService: ToastService,
        public ref: DynamicDialogRef,
        private mediaService: MediaService,

    ) {
        this.form = this.formBuilder.group({
            name: new FormControl('', Validators.required),
            email: [
                '',
                [
                    Validators.required,
                    Validators.pattern(
                        '^[A-Za-z0-9._%-]+@[A-Za-z0-9._%-]+\\.[a-z]{2,6}$'
                    ),
                ],
            ],
            phone: new FormControl(''),
        });
    }

    async ngOnInit(): Promise<void> {
        this.user = await this.getUser();
        this.oldImage = this.user.photoURL;
        this.form.patchValue(this.user);
        this.loadingInfo = false;
    }

    async getUser(): Promise<Admin> {
        const user = await this.authService.getAdminFromMongo();
        return user;
    }

    async validateForm() {
        if (this.form.invalid) {
            this.form.markAllAsTouched();
            return;
        }

        await this.updateAdmin();
    }

    async updateAdmin(): Promise<void> {
        try {
            this.isLoading = true;
            const formValues = this.form.value;
            this.user!.name = formValues.name;
            this.user!.phone = formValues.phone;
            if (this.tmpImage != undefined) {
                let url = await this.mediaService.uploadImg(this.tmpImage.file, this.user!.uid!, "perfil");
                this.user!.photoURL = url;
            }
            const response = await this.adminsService.updateAdmin(this.user, this.user!.uid!);
            if (response?.status == 200) {
                this.toastService.showSuccess('Información actualizada correctamente');
                this.isLoading = false;
                this.ref.close(true);
            }
        } catch (error) {
            this.isLoading = false;
            this.toastService.showError('Ocurrió un error', 'Favor de intentarlo nuevamente');
            console.log(error);
        }
    }

    async onUpload($event: any) {
        const file: File = $event.files[0];
        const reader = new FileReader();
        reader.onload = (e: any) => {
            // Set image src
            this.tmpImage = { file: file, image: e.target.result };
        };
        reader.readAsDataURL(file);
    }

}
