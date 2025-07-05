import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { AdminsMainPageComponent } from './pages/admins-main-page/admins-main-page.component';

@NgModule({
    imports: [
        RouterModule.forChild([
            { path: 'list', component: AdminsMainPageComponent },
            { path: '**', redirectTo: '/notfound' },
        ]),
    ],
    exports: [RouterModule],
})
export class AdminsRoutingModule { }
