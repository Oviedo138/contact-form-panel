import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { ButtonModule } from 'primeng/button';
import { DialogModule } from 'primeng/dialog';
import { DynamicDialogConfig, DynamicDialogModule, DynamicDialogRef } from 'primeng/dynamicdialog';

@Component({
    selector: 'app-crm-info-modal',
    standalone: true,
    imports: [
        CommonModule,
        DialogModule,
        DynamicDialogModule,
        ButtonModule,
    ],
    templateUrl: './crm-info-modal.component.html',
    styles: [`
    input[pInputText],
    textarea[pInputTextarea] {
      border: 1px solid #ccc;
      background-color: #fff;
      padding: 10px 12px;
      border-radius: 6px;
      height: fit-content;
      font-size: 14px;
      color: #333;
      width: 100%;
      box-sizing: border-box;
    }

    input[pInputText]:disabled,
    textarea[pInputTextarea]:disabled {
      resize: none;
      color: #666;
      opacity: 1;
      background-color: #f9f9f9;
    }
  `]
})

export class CrmInfoModalComponent {

    public data: any;
    public loader: boolean = false;

    constructor(
        private config: DynamicDialogConfig,
        public ref: DynamicDialogRef,
    ) {
        this.data = this.config.data.client;
    }
}
