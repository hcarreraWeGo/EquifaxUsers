import { Component } from '@angular/core';
import { SliderService } from 'src/app/shared/components/sidebar/slidebar.service';


@Component({
  selector: 'app-reports',
  templateUrl: './reports.component.html',
  styleUrl: './reports.component.scss'
})
export class ReportsComponent {
  constructor(
    private dashboardService: SliderService,

  ) {
    this.loadDataTable();
  }
  private async loadDataTable(): Promise<void> {
    try {
      const response = await this.dashboardService.getUserRoute(); 
      const routeCodes = response.data; 
      console.log(routeCodes[0]);
    }
    catch{}

  }

}
