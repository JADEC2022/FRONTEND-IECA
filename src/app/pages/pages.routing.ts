import { RouterModule, Routes } from "@angular/router";
import { NgModule } from "@angular/core";

import { DashboardComponent } from "./dashboard/dashboard.component";
import { UserProfileComponent } from "./user-profile/user-profile.component";
import { CreateVacancyComponent } from "./create-vacancy/create-vacancy.component";
import { CompanyProfileComponent } from "./company-profile/company-profile.component";
import { PerfilCompletoGuard } from "../guards/perfil-completo.guard";
import { TokenValidoGuard } from "../guards/token-valido.guard";
import { EmpresaAceptadaGuard } from "../guards/empresa-aceptada.guard";
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
import { GuardsService } from "../services/guards.service";
import { EmailValidadoGuard } from "../guards/email-validado.guard";
import { PostulationsComponent } from "./postulations/postulations.component";
import { NotificationsComponent } from "./notifications/notifications.component";
import { TipoPostulante } from "app/guards/tipo-postulante.guard";
import { TipoEmpresa } from "app/guards/tipo-empresa.guard";

import { CompanyAdministratorComponent } from "./company-administrator/company-administrator.component";
import { DashboardAdministratorComponent } from "./dashboard-administrator/dashboard-administrator.component";
import { PerfilAdministratorComponent } from "./perfil-administrator/perfil-administrator.component";
import { VacanciesAdministratorComponent } from "./vacancies-administrator/vacancies-administrator.component";
import { NewAdministratorComponent } from "./new-administrator/new-administrator.component";

const tipo_usuario = localStorage.getItem("tipo_usuario") || "";
export let ruta = "auth";
if (tipo_usuario == "Postulante") {
	ruta = "vacancies";
}
if (tipo_usuario == "Empresa") {
	ruta = "my-vacancies";
}
if (tipo_usuario == "Administrador" || tipo_usuario == "Superadministrador") {
	ruta = "dashboard-administrator";
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
		/*  canActivate: [TokenValidoGuard, EmailValidadoGuard], */
		children: [
			// { path: "dashboard", component: DashboardComponent },
			{
				path: "user-profile",
				component: UserProfileComponent,
				canActivate: [TipoPostulante],
			},
			{
				path: "company-profile",
				component: CompanyProfileComponent,
				canActivate: [TipoEmpresa],
			},
			{
				path: "create-vacancie",
				component: CreateVacancyComponent,
				canActivate: [TipoEmpresa, PerfilCompletoGuard, EmpresaAceptadaGuard],
			},
			{
				path: "update-vacancie/:id",
				component: UpdateVacancieComponent,
				canActivate: [TipoEmpresa, PerfilCompletoGuard],
			},
			{
				path: "vacancies",
				component: VacanciesComponent,
				canActivate: [TipoPostulante],
			},
			{
				path: "my-vacancies",
				component: MyVacanciesComponent,
				canActivate: [TipoEmpresa],
			},
			{
				path: "postulate-vacancy/:id",
				component: PostulateVacancyComponent,
				canActivate: [TipoPostulante],
			},
			{
				path: "favorites",
				component: FavoritesComponent,
				canActivate: [TipoPostulante],
			},
			{
				path: "see-profile/:id",
				component: SeeProfileComponent,
				canActivate: [TipoEmpresa],
			},
			{
				path: "my-postulations",
				component: MyPostulationsComponent,
				canActivate: [TipoPostulante],
			},
			{
				path: "see-company/:id",
				component: SeeCompanyComponent,
				canActivate: [TipoPostulante],
			},
			// { path: "reviews", component: ReviewsComponent },
			{
				path: "postulations/:id/:tipo",
				component: PostulationsComponent,
				canActivate: [TipoEmpresa],
			},
			{ path: "notifications", component: NotificationsComponent },

			{
				path: "company-administrator/:id",
				component: CompanyAdministratorComponent,
			},
			{
				path: "dashboard-administrator",
				component: DashboardAdministratorComponent,
			},
			{ path: "perfil-administrator", component: PerfilAdministratorComponent },
			{
				path: "vacancies-administrator/:id",
				component: VacanciesAdministratorComponent,
			},
			{ path: "new-administrator", component: NewAdministratorComponent },
		],
	},
];

@NgModule({
	imports: [RouterModule.forChild(routes)],
	exports: [RouterModule],
	declarations: [],
})
export class PagesRoutingModule {}
