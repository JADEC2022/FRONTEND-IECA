import { RouterModule, Routes } from "@angular/router";
import { NgModule } from "@angular/core";

import { DashboardComponent } from "./dashboard/dashboard.component";
import { UserProfileComponent } from "./user-profile/user-profile.component";
import { CreateVacancyComponent } from "./create-vacancy/create-vacancy.component";
import { CompanyProfileComponent } from "./company-profile/company-profile.component";
import { PerfilCompletoGuard } from "../guards/perfil-completo.guard";
import { TokenValidoGuard } from "../guards/token-valido.guard";
import { VacanciesComponent } from "./vacancies/vacancies.component";

import { PagesComponent } from "./pages.component";
import { UpdateVacancieComponent } from "./update-vacancie/update-vacancie.component";
import { PostulateVacancyComponent } from "./postulate-vacancy/postulate-vacancy.component";
import { MyVacanciesComponent } from "./my-vacancies/my-vacancies.component";
import { FavoritesComponent } from "./favorites/favorites.component";
import { SeeProfileComponent } from "./see-profile/see-profile.component";
import { MyPostulationsComponent } from "./my-postulations/my-postulations.component";
import { SeeCompanyComponent } from "./see-company/see-company.component";
import { ReviewsComponent } from "./reviews/reviews.component";
import { GuardsService } from '../services/guards.service';
import { EmailValidadoGuard } from '../guards/email-validado.guard';

const tipo_usuario = localStorage.getItem("tipo_usuario") || "";
export let ruta = "auth";
if (tipo_usuario == "Postulante") {
    ruta = "vacancies";
}
if (tipo_usuario == "Empresa") {
    ruta = "my-vacancies";
}

export const routes: Routes = [
  {
    path: "",
    pathMatch: "full",
    redirectTo: ruta,
  },

  {
    path: "",
    component: PagesComponent,
    canActivate: [TokenValidoGuard, EmailValidadoGuard],
    children: [
      { path: "dashboard", component: DashboardComponent },
      { path: "user-profile", component: UserProfileComponent },
      { path: "company-profile", component: CompanyProfileComponent },
      { path: "create-vacancie", component: CreateVacancyComponent, canActivate: [PerfilCompletoGuard] },
      { path: "update-vacancie/:id", component: UpdateVacancieComponent, canActivate: [PerfilCompletoGuard] },
      { path: "vacancies", component: VacanciesComponent },
      { path: "my-vacancies", component: MyVacanciesComponent },
      { path: "postulate-vacancy/:id", component: PostulateVacancyComponent},
      { path: "favorites", component: FavoritesComponent },
      { path: "see-profile/:id", component: SeeProfileComponent },
      { path: "my-postulations", component: MyPostulationsComponent },
      { path: "see-company/:id", component: SeeCompanyComponent },
      { path: "reviews", component: ReviewsComponent },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
  declarations: [],
})
export class PagesRoutingModule {}
