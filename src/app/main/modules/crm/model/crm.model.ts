export interface CrmModel {
    _id?: string;
    name: string;
    code: string;
    uses: number;
    percentDiscount: number;
    maxUses?: number;
    expirationDate?: Date;
    isActive: boolean;
    creationDate: Date;
}
