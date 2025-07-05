import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CrmMainPageComponent } from './pages/crm-main-page/crm-main-page.component';

@NgModule({
    imports: [
        RouterModule.forChild([
            { path: 'list', component: CrmMainPageComponent },
            { path: '**', redirectTo: '/notfound' },
        ]),
    ],
    exports: [RouterModule],
})
export class CrmRoutingModule { }
