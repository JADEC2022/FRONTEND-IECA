import { Component, OnInit } from "@angular/core";
import { CompanyAdministratorService } from "./company-administrator.service";
import { AuthResponseI } from "../../models/auth-response";
import { EmpresaI } from "../../models/empresa";

@Component({
	selector: "app-company-administrator",
	templateUrl: "./company-administrator.component.html",
	styleUrls: ["./company-administrator.component.css"],
})
export class CompanyAdministratorComponent implements OnInit {
	empresas: EmpresaI[] = [];

	constructor(
		private companyAdministratorService: CompanyAdministratorService
	) {}

	ngOnInit(): void {
		this.companyAdministratorService
			.getCompanysByEstado(null)
			.subscribe((resp: AuthResponseI) => {
				if (resp.status) {
					this.empresas = resp.data;
				}
			});
	}
}
