import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { HomeComponent } from "./home/home.component";
import { ReportsComponent } from "./reports/reports.component";
import { RequestSignatureComponent } from "./request-signature/request-signature.component";
import { VerifyIdentityComponent } from "./verify-identity/verify-identity.component";



const routes: Routes = [
  {
    path: "",
    children: [
      {
        path: "home",
        component: HomeComponent,
      },
      {
        path: "solicitar-firma",
        component: RequestSignatureComponent,
      },
      {
        path: "verificar-identidad",
        component: VerifyIdentityComponent,
      },
      {
        path: "reporte-solicitar",
        component: ReportsComponent,
      },
      
    ],
  },
];
@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class DashboardRoutingModule {}
