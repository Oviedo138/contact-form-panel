import { OnInit } from '@angular/core';
import { Component } from '@angular/core';
import { LayoutService } from './service/app.layout.service';

@Component({
    selector: 'app-menu',
    templateUrl: './app.menu.component.html',
})
export class AppMenuComponent implements OnInit {

    public model: any[] = [];

    constructor(public layoutService: LayoutService) { }

    ngOnInit() {
        this.model = [

            {
                label: 'Dashboard',
                items: [
                    {
                        label: 'Administradores',
                        icon: 'pi pi-fw pi-user',
                        routerLink: ['/admins/list'],
                    },
                ],
            },
            {
                label: 'CRM',
                items: [
                    {
                        label: 'Contactos',
                        icon: 'pi pi-address-book',
                        routerLink: ['/contact/list'],
                    },
                ],
            },
        ];
    }
}
