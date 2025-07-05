import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { ConfirmationService, MenuItem } from 'primeng/api';
import { BreadcrumbModule } from 'primeng/breadcrumb';
import { CardModule } from 'primeng/card';
import { AdminsService } from '../../services/admins.service';
import { Admin } from '../../models/admin.model';
import { ToastService } from 'src/app/main/services/toast.service';
import { Table, TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { DialogService, DynamicDialogModule } from 'primeng/dynamicdialog';
import { AdminFormComponent } from '../admin-form/admin-form.component';
import { InputTextModule } from 'primeng/inputtext';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { LoginService } from 'src/app/layout/service/login.service';
import { BlockUIModule } from 'primeng/blockui';
import { AngularFireAuth } from '@angular/fire/compat/auth';

@Component({
    standalone: true,
    imports: [
        CardModule,
        CommonModule,
        FormsModule,
        ReactiveFormsModule,
        RouterModule,
        BreadcrumbModule,
        TableModule,
        ButtonModule,
        DynamicDialogModule,
        InputTextModule,
        ConfirmDialogModule,
        BlockUIModule,
    ],
    providers: [DialogService, ConfirmationService],
    selector: 'app-admins-main-page',
    templateUrl: './admins-main-page.component.html',
})
export class AdminsMainPageComponent {

    public items: MenuItem[] | undefined;
    public loader: boolean = true;
    public admins: Array<Admin> = [];
    // public currentUser?: any;

    // USER
    public currentUser: any;
    public currentAdmin: any;
    public lastSignInTime: any;

    constructor(
        private auth: AngularFireAuth,
        private adminsService: AdminsService,
        private toastService: ToastService,
        private authService: LoginService,
        public dialogService: DialogService,
        private confirmationService: ConfirmationService,
    ) {
        this.auth.authState.subscribe(async (auth) => {
            this.currentAdmin = auth;
            if (auth != null) {
                this.lastSignInTime = this.transformDate(auth.metadata.lastSignInTime);
            }
        });
    }

    async ngOnInit() {
        this.currentUser = await this.authService.getAdminFromMongo();
        this.items = [{ icon: 'pi pi-home', route: '/' }, { label: 'Administradores', route: '/admins/list' }];
        this.getAdmins();
    }

    async getAdmins(): Promise<void> {
        try {
            let response = await this.adminsService.getAllAdmins();
            this.admins = response;
        } catch (error) {
            console.log(error);
            this.toastService.showError('Error', 'Ocurrio un problema al realizar la consulta')
        } finally {
            this.loader = false;
        }
    }

    async confirmDelete(admin: Admin) {
        console.log('xd');
        this.confirmationService.confirm({
            key: "admin-confirm-dialog",
            header: "Confirmación",
            message: '¿Está seguro que desea eliminar este administrador?',
            icon: 'pi pi-info-circle',
            rejectButtonStyleClass: "p-button-danger",
            acceptButtonStyleClass: "",
            acceptIcon: "none",
            rejectIcon: "none",
            acceptLabel: "Sí",
            rejectLabel: "No",
            accept: async () => {
                try {
                    this.loader = true;
                    // await this.logDeleteAdmin(admin._id!, this.currentUser);
                    await this.adminsService.deleteAdmin(admin.uid!);
                    await this.getAdmins();
                    this.toastService.showSuccess('Administrador eliminado correctamente');
                } catch (error) {
                    console.log(error);
                    this.toastService.showError('Ocurrió un error', "Favor de intentarlo nuevamente");
                } finally {
                    this.loader = false;
                }
            },
        });

    }

    openAdminForm(admin?: Admin) {
        const dialogRef = this.dialogService.open(AdminFormComponent, {
            header: admin == undefined ? 'Nuevo administrador' : "Editar administrador",
            contentStyle: {
                overflow: 'auto',
                width: '300px',
                // maxWidth: '90vh',
            },
            baseZIndex: 10000,
            data: {
                admin
            }
        });
        dialogRef.onClose.subscribe(async (reload: boolean) => {
            if (reload) {
                await this.getAdmins();
            }
        });
    }

    onGlobalFilter(table: Table, event: Event) {
        table.filterGlobal((event.target as HTMLInputElement).value, 'contains');
    }

    transformDate(event: any) {
        const date = new Date(event);
        date.setHours(date.getHours() + 5);
        const monthNames = [
            'Enero',
            'Febrero',
            'Marzo',
            'Abril',
            'Mayo',
            'Junio',
            'Julio',
            'Agosto',
            'Septiembre',
            'Octubre',
            'Noviembre',
            'Diciembre',
        ];
        const day = this.addLeadingZero(date.getDate());
        const month = monthNames[date.getMonth()];
        const year = date.getFullYear();
        const hours = this.addLeadingZero(date.getHours());
        const minutes = this.addLeadingZero(date.getMinutes());
        let newDate = `${day}/${month}/${year} a las ${hours}:${minutes}`;
        return newDate;
    }

    addLeadingZero(value: number): string {
        return value < 10 ? `0${value}` : value.toString();
    }

}
