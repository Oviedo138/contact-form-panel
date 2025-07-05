import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { ButtonModule } from 'primeng/button';

@Component({
    standalone: true,
    imports: [CommonModule, ButtonModule, RouterModule],
    selector: 'app-error',
    templateUrl: './error.component.html',
})
export class ErrorComponent { }
