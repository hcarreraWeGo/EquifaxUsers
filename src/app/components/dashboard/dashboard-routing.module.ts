import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { HomeComponent } from "./home/home.component";
import { ReportsComponent } from "./reports/reports.component";
import { RequestSignatureComponent } from "./request-signature/request-signature.component";
import { VerifyIdentityComponent } from "./verify-identity/verify-identity.component";
import { ReportsVerificarComponent } from "./reports-verificar/reports-verificar.component";
import { authGuard } from "../../guards/auth.guard";



const routes: Routes = [
  {
    path: "",
    children: [
      {
        path: "home",
        component: HomeComponent,
        canActivate: [authGuard],  // Protege la ruta con el guard
      },
      {
        path: "solicitar-firma",
        component: RequestSignatureComponent,
        canActivate: [authGuard],  // Protege la ruta con el guard
      },
      {
        path: "verificar-identidad",
        component: VerifyIdentityComponent,
        canActivate: [authGuard],  // Protege la ruta con el guard
      },
      {
        path: "reporte-solicitar",
        component: ReportsComponent,
        canActivate: [authGuard],  // Protege la ruta con el guard
      },
      {
        path:"reporte-verificar",
        component:ReportsVerificarComponent,
        canActivate: [authGuard],  // Protege la ruta con el guard
      }
    ],
  },
];
@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class DashboardRoutingModule {}
