import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-signature-status-chart-box',
  templateUrl: './signature-status-chart-box.component.html',
  styleUrl: './signature-status-chart-box.component.scss'
})
export class SignatureStatusChartBoxComponent {

  @Input() data: any
  constructor() {}
}
