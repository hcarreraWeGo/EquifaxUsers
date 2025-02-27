import { AlertComponent } from '../../shared/components/alert/alert.component';
import { ReportsVerificarComponent } from './reports-verificar/reports-verificar.component';
import { DetailComponent } from './reports/Elements/detail/detail.component';
import { VerifyIdentityComponent } from './verify-identity/verify-identity.component';
import { RequestSignatureComponent } from './request-signature/request-signature.component';
import { ReportsComponent } from './reports/reports.component';
import { SignatureStatusChartBoxComponent } from './home/signature-status-chart-box/signature-status-chart-box.component';
import { WelcomeComponent } from './home/welcome/welcome.component';
import { NgApexchartsModule } from 'ng-apexcharts';
import { SharedModule } from './../../shared/shared.module';
import { DashboardRoutingModule } from './dashboard-routing.module';
import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { HomeComponent } from './home/home.component';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';

@NgModule({
    declarations: [
        HomeComponent,
        WelcomeComponent,
        SignatureStatusChartBoxComponent,
        ReportsComponent,
        ReportsVerificarComponent,
        RequestSignatureComponent,
        AlertComponent,
        VerifyIdentityComponent,
        DetailComponent
        

    ],
    imports:[CommonModule, DashboardRoutingModule,SharedModule,NgApexchartsModule,NgbModule,],
    exports:[]

})
export class DashboardModule {}