import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { firstValueFrom } from 'rxjs';
import { DefaultResponse } from '../../../../shared/models/http.model';
import { CrmModel } from '../model/crm.model';

@Injectable({
    providedIn: 'root'
})
export class CrmService {

    public baseUrl: string = `${environment.URL_API}/contact/`;

    constructor(
        private http: HttpClient,
    ) { }

    async getAllCrm(): Promise<CrmModel[]> {
        try {
            const response = await firstValueFrom(this.http.get<DefaultResponse>(this.baseUrl + 'get-all'));
            return response.data;
        } catch (error) {
            console.log(error);
            return [];
        }
    }

    async createCoupon(couponData: CrmModel) {
        try {
            let response = await firstValueFrom(this.http.post<DefaultResponse>(this.baseUrl + 'create', { couponData }));
            return response;
        } catch (error) {
            console.log(error);
            throw error;
        }
    }

    async updateCoupon(couponData: any, couponId: string) {
        try {
            let response = await firstValueFrom(this.http.put<DefaultResponse>(this.baseUrl + 'update', { couponData, couponId }));
            return response
        } catch (error) {
            console.log(error);
            throw error;
        }
    }

    async deleteReview(reviewId: string) {
        try {
            let response = await firstValueFrom(this.http.post<DefaultResponse>(this.baseUrl + 'delete', { reviewId }));
            return response
        } catch (error) {
            console.log(error);
            throw error;
        }
    }

}
