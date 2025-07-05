import { Component, ElementRef, ViewChild } from '@angular/core';
import { LayoutService } from "./service/app.layout.service";
import { LoginService } from './service/login.service';
import { ConfirmationService, MenuItem } from 'primeng/api';
import { DialogService } from 'primeng/dynamicdialog';
import { NewProfileModalComponent } from '../main/components/auth/login/new-profile-modal/new-profile-modal.component';
import { AngularFireAuth } from '@angular/fire/compat/auth';

@Component({
    selector: 'app-topbar',
    templateUrl: './app.topbar.component.html',
    styles: [
        `
        .layout-topbar-logo{
            display: flex;
            @media (min-width: 991px){
                display: none;
            }
        }
        `
    ]
})
export class AppTopBarComponent {

    items!: MenuItem[];

    public currentUser!: any | null;

    @ViewChild('menubutton') menuButton!: ElementRef;

    @ViewChild('topbarmenubutton') topbarMenuButton!: ElementRef;

    @ViewChild('topbarmenu') menu!: ElementRef;

    constructor(
        public layoutService: LayoutService,
        private loginService: LoginService,
        private confirmationService: ConfirmationService,
        public dialogService: DialogService,
        private auth: AngularFireAuth,
    ) {
        this.auth.authState.subscribe(async (auth) => {
            this.currentUser = auth;
            if (auth != null) {
                const token = await auth.getIdTokenResult()
            }
        });
    }

    onConfigButtonClick() {
        this.layoutService.showConfigSidebar();
    }

    ngOnInit() {
        this.items = [
            {
                label: 'Editar perfil',
                icon: 'pi pi-user-edit',
                command: () => {
                    this.openProfileModal();
                }
            },
            {
                label: 'Cerrar sesión',
                icon: 'pi pi-sign-out',
                command: () => {
                    this.logout();
                }
            },
        ];
    }

    async logout() {
        this.confirmationService.confirm({
            key: "header-dialog",
            header: "Confirmación",
            message: '¿Estás seguro de que deseas cerrar la sesión?',
            icon: 'pi pi-info-circle',
            rejectButtonStyleClass: "p-button-danger",
            acceptButtonStyleClass: "",
            acceptIcon: "none",
            rejectIcon: "none",
            acceptLabel: "Sí",
            rejectLabel: "No",
            accept: async () => await this.loginService.logout()
        });
    }

    openProfileModal() {
        const dialogRef = this.dialogService.open(NewProfileModalComponent, {
            header: "Editar información",
            contentStyle: { overflow: 'auto' },
            baseZIndex: 10000,
        });
        dialogRef.onClose.subscribe(async (reload: boolean) => {
            if (reload) {
                this.currentUser?.reload();
            }
        });
    }

}
