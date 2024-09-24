import { SignatureStatusChartBoxComponent } from './home/signature-status-chart-box/signature-status-chart-box.component';
import { WelcomeComponent } from './home/welcome/welcome.component';
import { NgApexchartsModule } from 'ng-apexcharts';
import { SharedModule } from './../../shared/shared.module';
import { DashboardRoutingModule } from './dashboard-routing.module';
import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { HomeComponent } from './home/home.component';

@NgModule({
    declarations: [
        HomeComponent,
        WelcomeComponent,
        SignatureStatusChartBoxComponent
        
        

    ],
    imports:[CommonModule, DashboardRoutingModule,SharedModule,NgApexchartsModule],
    exports:[]

})
export class DashboardModule {}