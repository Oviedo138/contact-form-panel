import { RouterModule } from '@angular/router';
import { NgModule } from '@angular/core';
import { NotfoundComponent } from './main/components/notfound/notfound.component';
import { AppLayoutComponent } from './layout/app.layout.component';
import { AuthGuard } from './guards/auth.guard';
import { SignInGuard } from './guards/sign-in.guard';

@NgModule({
    imports: [
        RouterModule.forRoot(
            [
                {
                    path: '', component: AppLayoutComponent, canActivate: [AuthGuard],
                    // path: '', component: AppLayoutComponent,
                    children: [
                        {
                            path: '', redirectTo: 'admins/list', pathMatch: 'full',
                        },
                        {
                            path: 'admins',
                            loadChildren: () => import('./main/modules/administrators/admins-routing.module').then((m) => m.AdminsRoutingModule),
                        },
                        {
                            path: 'contact',
                            loadChildren: () => import('./main/modules/crm/crm-routing.module').then((m) => m.CrmRoutingModule),
                        },
                        // {
                        //     path: 'clients',
                        //     loadChildren: () => import('./main/modules/clients/clients-routing.module').then((m) => m.ClientsRoutingModule),
                        // },
                    ],
                },
                {
                    path: 'auth',
                    loadChildren: () => import('./main/components/auth/auth-routing.module').then((m) => m.AuthRoutingModule),
                    canActivate: [SignInGuard]
                },
                { path: 'notfound', component: NotfoundComponent },
                { path: '**', redirectTo: '/notfound' },
            ],
            {
                scrollPositionRestoration: 'enabled',
                anchorScrolling: 'enabled',
                onSameUrlNavigation: 'reload',
            }
        ),
    ],
    exports: [RouterModule],
})
export class AppRoutingModule { }
