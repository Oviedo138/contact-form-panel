import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { first, firstValueFrom } from 'rxjs';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { environment } from 'src/environments/environment';
import firebase from 'firebase/compat/app';
import { Admin } from '../../main/modules/administrators/models/admin.model';
import { DefaultResponse } from '../../shared/models/http.model';
import { AdminsService } from 'src/app/main/modules/administrators/services/admins.service';

export interface Authenticated {
    res?: boolean;
    user?: any;
    // user?: firebase.User;
    userType?: string;
}


@Injectable({
    providedIn: 'root'
})

export class LoginService {

    private ADMIN_URI: string = `${environment.URL_API}/admins/`;

    constructor(
        private http: HttpClient,
        private firebase: AngularFirestore,
        private auth: AngularFireAuth,
        private router: Router,
        private adminService: AdminsService,
    ) { }


    // async isAuthenticated(): Promise<Authenticated> {
    async isLoggedIn(): Promise<any> {
        const user = await firstValueFrom(this.auth.authState.pipe(first()));
        if (user) {
            const token = await user.getIdTokenResult()
            const userType = token.claims['role'];
            // console.log("userType", userType)
            // if (userType !== 'Administrador' && userType !== 'Editor' && userType !== 'Vendedor') {
            //     await this.auth.signOut();
            // }
            // this.router.navigate(['/dashboard']);
            return { res: true, user: user, userType: userType };
        } else {
            return { res: false };
        }

        // return { res: true, user: 'user', userType: 'Administrador' };
        // return { res: false };
    }

    async login(email: string, password: string) {
        try {
            const sigInSnapshot = await this.auth.signInWithEmailAndPassword(
                email,
                password
            );
            await this.isLoggedIn();
            if (!sigInSnapshot.user) {
                // console.log(sigInSnapshot);
                throw false;
            }
        } catch (error: any) {
            console.log(error);
            let errorMessage;
            switch (error.code) {
                case "auth/user-not-found":
                    errorMessage = "No existe una cuenta creada con el correo ingresado"
                    break;

                case "auth/invalid-email":
                    errorMessage = "Correo electrónico incorrecto"
                    break;

                case "auth/wrong-password":
                    errorMessage = "Contraseña incorrecta"
                    break;

                case "auth/invalid-password":
                    errorMessage = "Contraseña inválida"
                    break;

                case "auth/too-many-requests":
                    errorMessage = "Cuenta inhabilitada temporalmente"
                    break;

                default:
                    errorMessage = "Ocurrió un error, intente nuevamente"
                    break;
            }

            if (error.code == undefined) {
                errorMessage = "No existe una cuenta con el correo ingresado."
            }
            throw { error: true, message: errorMessage };
        }
    }

    async logout(): Promise<any> {
        try {
            this.router.navigate(['/login']);
            return await this.auth.signOut();
        } catch (error) {
            throw error;
        }
    }

    async getAdminFromMongo(): Promise<Admin> {
        try {
            let admin = await this.isLoggedIn()
            let adminUid = admin?.user?.uid;
            let response = await firstValueFrom(this.http.get<DefaultResponse>(`${this.ADMIN_URI}get/${adminUid}`));
            return response!.data
        } catch (error) {
            console.log(error);
            throw error;
        }
    }

    async sendRecoveryEmail(email: string): Promise<any> {
        try {
            const response = await this.adminService.checkIfEmailExist(email);

            if (response) {
                await this.auth.sendPasswordResetEmail(email);
                return { res: true };
            } else {
                return { res: false, message: "No existe una cuenta vinculada a ese correo" };
            }
        } catch (error) {
            console.error('Error sending recovery email:', error);
            return { res: false, message: "Ocurrió un error inesperado" };
        }
    }

}
