import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { ConfirmationService, MenuItem } from 'primeng/api';
import { BreadcrumbModule } from 'primeng/breadcrumb';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { DialogService, DynamicDialogModule } from 'primeng/dynamicdialog';
import { InputTextModule } from 'primeng/inputtext';
import { Table, TableModule } from 'primeng/table';
import { ToastService } from 'src/app/main/services/toast.service';
import { InputSwitchModule } from 'primeng/inputswitch';
import { CrmService } from '../../service/crm.service';
import { RatingModule } from 'primeng/rating';
import { CrmInfoModalComponent } from '../crm-info-modal/crm-info-modal.component';

@Component({
    selector: 'app-crm-main-page',
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
        InputSwitchModule,
        RatingModule
    ],
    providers: [ConfirmationService, DialogService],
    templateUrl: './crm-main-page.component.html',
})
export class CrmMainPageComponent {

    public items: MenuItem[] | undefined;
    public loader: boolean = true;
    public crm: Array<any> = [];

    constructor(
        private toastService: ToastService,
        private crmService: CrmService,
        public dialogService: DialogService,
        private confirmationService: ConfirmationService,
    ) { }

    async ngOnInit() {
        this.items = [{ icon: 'pi pi-home', route: '/' }, { label: 'Contactos', route: '/crm/list' }];
        this.getCrm();
    }

    async getCrm() {
        try {
            let response = await this.crmService.getAllCrm();
            // console.log(response);
            this.crm = response;
        } catch (error) {
            console.log(error);
            this.toastService.showError('Error', 'Ocurrio un problema al realizar la consulta')
        } finally {
            this.loader = false;
        }
    }


    onGlobalFilter(table: Table, event: Event) {
        table.filterGlobal((event.target as HTMLInputElement).value, 'contains');
    }

    async confirmDelete(contact: any) {
        this.confirmationService.confirm({
            key: "crm-confirm-dialog",
            header: "Confirmación",
            message: '¿Está seguro que desea eliminar este contacto?',
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
                    let response = await this.crmService.deleteReview(contact._id);
                    await this.getCrm();
                    this.toastService.showSuccess('Contacto eliminado correctamente');
                } catch (error) {
                    console.log(error);
                    this.toastService.showError('Ocurrió un error', "Favor de intentarlo nuevamente");
                } finally {
                    this.loader = false;
                }
            },
        });
    }

    getDesc(text: any) {
        const limiteCaracteres = 100;
        if (text.length > limiteCaracteres) {
            return text.slice(0, limiteCaracteres) + "...";
        }
        return text.replace(/<\/?p>/g, '');
    }

    formatToSpanishDate(date: string | Date): string {
        const days = [
            'domingo', 'lunes', 'martes', 'miércoles',
            'jueves', 'viernes', 'sábado'
        ];
        const months = [
            'enero', 'febrero', 'marzo', 'abril',
            'mayo', 'junio', 'julio', 'agosto',
            'septiembre', 'octubre', 'noviembre', 'diciembre'
        ];
        const dateObj = new Date(date);
        const dayName = days[dateObj.getDay()];
        const day = dateObj.getDate();
        const monthName = months[dateObj.getMonth()];
        const year = dateObj.getFullYear();
        return `${dayName}, ${day} de ${monthName} de ${year}`;
    }

    openCrmModal(client: any) {
        const dialogRef = this.dialogService.open(CrmInfoModalComponent, {
            header: 'Información de contacto',
            width: '500px',
            // height: '560px',
            baseZIndex: 10000,
            data: { client }
        });
        dialogRef.onClose.subscribe(async (reload: boolean) => {
            if (reload) {
                await this.getCrm();
            }
        });
    }

}
