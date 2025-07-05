import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { firstValueFrom } from 'rxjs';
import { DefaultResponse } from '../../../../shared/models/http.model';
import { Admin } from '../models/admin.model';
import { AngularFirestore } from '@angular/fire/compat/firestore';

@Injectable({
    providedIn: 'root'
})
export class AdminsService {

    public baseUrl: string = `${environment.URL_API}/admins/`;

    constructor(
        private http: HttpClient,
        private angularFirestore: AngularFirestore,
    ) { }

    async getAllAdmins(): Promise<Admin[]> {
        try {
            const response = await firstValueFrom(this.http.get<DefaultResponse>(this.baseUrl + 'get-all'));
            return response!.data;
        } catch (error) {
            console.log(error);
            return [];
            // throw error;
        }
    }

    async createAdmin(adminData: Admin) {
        try {
            let response = await firstValueFrom(this.http.post<DefaultResponse>(this.baseUrl + 'create', { adminData }));
            return response;
        } catch (error) {
            console.log(error);
            throw error;
        }
    }

    async updateAdmin(adminData: any, adminUid: string) {
        try {
            let response = await firstValueFrom(this.http.put<DefaultResponse>(this.baseUrl + 'update', { adminData, adminUid }));

            // console.log({adminData, adminUid})

            // console.log(response)

            return response
        } catch (error) {
            console.log(error);
            throw error;
        }
    }

    async deleteAdmin(adminUid: string) {
        console.log(adminUid);
        try {
            let response = await firstValueFrom(this.http.post<DefaultResponse>(this.baseUrl + 'delete', { adminUid }));
            return response
        } catch (error) {
            console.log(error);
            throw error;
        }
    }

    async getAdminByUid(adminUid: string) {
        try {
            let response: any = (await this.angularFirestore.collection('administrators').doc(adminUid).ref.get()).data();
            return response;
        } catch (error) {
            console.log(error);
            throw error;
        }
    }

    async isEmailFree(email: string): Promise<boolean> {
        try {
            const response = await firstValueFrom(this.http.post<DefaultResponse>(this.baseUrl + 'validate-email', { email }));
            return response!.data;
        } catch (error) {
            throw error;
        }
    }

    async checkIfEmailExist(email: any): Promise<boolean> {
        try {
            await firstValueFrom(this.http.post(this.baseUrl + 'validate-email', { email }));
            return true;
        } catch (error) {
            console.log(error);
            return false;

        }
    }

}
