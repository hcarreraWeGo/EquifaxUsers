import { Component, Input, SimpleChanges } from '@angular/core';

@Component({
  selector: 'app-signature-status-chart-box',
  templateUrl: './signature-status-chart-box.component.html',
  styleUrl: './signature-status-chart-box.component.scss'
})
export class SignatureStatusChartBoxComponent {

  @Input() data: any={}
  constructor() {}

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['data'] && this.data?.data) {
      console.log('Data received in child component:', this.data.data);
    }
  }
}
