import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { AccessComponent } from './access/access.component';
import { ErrorComponent } from './error/error.component';

@NgModule({
    imports: [
        RouterModule.forChild([
            // {
            //     path: 'error',
            //     loadChildren: () =>
            //         import('./error/error.module').then((m) => m.ErrorModule),
            // },
            { path: 'error', component: ErrorComponent },
            { path: 'access', component: AccessComponent },
            { path: 'login', component: LoginComponent },
            { path: '**', redirectTo: '/notfound' },
        ]),
    ],
    exports: [RouterModule],
})
export class AuthRoutingModule { }
