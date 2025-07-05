import { NgModule } from '@angular/core';
import { HashLocationStrategy, LocationStrategy, PathLocationStrategy, } from '@angular/common';
import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';
import { AppLayoutModule } from './layout/app.layout.module';
import { NotfoundComponent } from './main/components/notfound/notfound.component';
import { ToastModule } from 'primeng/toast';
import { MessageService, PrimeNGConfig } from 'primeng/api';
import { AngularFireModule } from '@angular/fire/compat';
import { environment } from 'src/environments/environment';
import { CardModule } from 'primeng/card';
import { CKEditorModule } from '@ckeditor/ckeditor5-angular';
import { ReactiveFormsModule } from '@angular/forms';
import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { LoggingInterceptor } from './main/services/loggin-interceptor.service';

@NgModule({
    declarations: [AppComponent, NotfoundComponent],
    imports: [AppRoutingModule, AppLayoutModule, ToastModule, AngularFireModule.initializeApp(environment.firebase), CardModule, CKEditorModule, ReactiveFormsModule],
    providers: [
        MessageService,
        { provide: LocationStrategy, useClass: PathLocationStrategy },
        {
            provide: HTTP_INTERCEPTORS,
            useClass: LoggingInterceptor,
            multi: true,
        },
    ],
    bootstrap: [AppComponent],
})
export class AppModule {
    constructor(
        private primengConfig: PrimeNGConfig
    ) {
        this.primengConfig.setTranslation({
            accept: 'Aceptar',
            reject: 'Cancelar',
            startsWith: 'Empieza con',
            contains: 'Contiene',
            notContains: 'No contiene',
            endsWith: 'Termina con',
            equals: 'Igual a',
            notEquals: 'Diferente de',
            noFilter: 'Sin filtro',
            lt: 'Menor que',
            lte: 'Menor o igual que',
            gt: 'Mayor que',
            gte: 'Mayor o igual que',
            dateIs: 'Fecha es',
            dateIsNot: 'Fecha no es',
            dateBefore: 'Fecha es antes de',
            dateAfter: 'Fecha es después de',
            clear: 'Limpiar',
            apply: 'Aplicar',
            matchAll: 'Coincidir con todo',
            matchAny: 'Coincidir con cualquiera',
            addRule: 'Agregar regla',
            removeRule: 'Eliminar regla',
            dayNames: ['domingo', 'lunes', 'martes', 'miércoles', 'jueves', 'viernes', 'sábado'],
            dayNamesShort: ['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb'],
            dayNamesMin: ['D', 'L', 'M', 'M', 'J', 'V', 'S'],
            monthNames: ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'],
            monthNamesShort: ['Ene', 'Jeb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic'],
            today: 'Hoy',
            weekHeader: 'Sem',
            weak: 'Débil',
            medium: 'Medio',
            strong: 'Fuerte',
            passwordPrompt: 'Ingrese una contraseña',
            emptyMessage: 'No se encontraron resultados',
            emptyFilterMessage: 'No se encontraron resultados'
        });
    }
}
