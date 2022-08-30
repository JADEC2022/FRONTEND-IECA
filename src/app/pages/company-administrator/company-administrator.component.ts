import { Component, OnInit } from "@angular/core";
import Swal from "sweetalert2";
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
	estado: String = null;
	diasEnEspera: number = 15;

	constructor(
		private companyAdministratorService: CompanyAdministratorService
	) {}

	ngOnInit(): void {
		this.getEmpresasByEstado(this.estado);
	}

	getEmpresasByEstado(estado: String = null): void {
		const formData = { estado: estado };
		this.companyAdministratorService
			.getCompanysByEstado(formData)
			.subscribe((resp: AuthResponseI) => {
				if (resp.status) {
					this.empresas = resp.data;
				}
			});
	}

	getEmpresasEnEsperaXDias(dias: number): void {
		this.companyAdministratorService
			.getCompanysEnEsperaXDias(dias)
			.subscribe((resp: AuthResponseI) => {
				if (resp.status) {
					this.empresas = resp.data;
				}
			});
	}

	aceptarEmpresa(empresa: EmpresaI): void {
		this.companyAdministratorService
			.aceptarEmpresa(empresa.id_empresa)
			.subscribe((resp: AuthResponseI) => {
				if (resp.status) {
					this.addAccionEmpresa("ACEPTADA", empresa.estado, empresa.id_empresa);
					this.empresas = [];
					this.getEmpresasByEstado(this.estado);
					this.doneMassage(
						"Empresa ACEPTADA, se le ha mandado un correo a la empresa para notificarle de ello"
					);
				} else {
					this.errorMassage("No fue posible ACEPTAR la empresa");
				}
			});
	}

	rechazarEmpresa(empresa: EmpresaI): void {
		const idAdmin = parseInt(localStorage.getItem("id_usuario"));
		this.companyAdministratorService
			.rechazarEmpresa(empresa.id_empresa, idAdmin)
			.subscribe((resp: AuthResponseI) => {
				if (resp.status) {
					this.addAccionEmpresa(
						"RECHAZADA",
						empresa.estado,
						empresa.id_empresa
					);
					this.empresas = [];
					this.getEmpresasByEstado(this.estado);
					this.doneMassage(
						"Empresa RECHAZADA, se le ha mandado un correo a la empresa para notificarle de ello"
					);
				} else {
					this.errorMassage("No fue posible RECHAZAR la empresa");
				}
			});
	}

	enEsperaEmpresa(empresa: EmpresaI): void {
		this.companyAdministratorService
			.enEsperaEmpresa(empresa.id_empresa)
			.subscribe((resp: AuthResponseI) => {
				if (resp.status) {
					this.addAccionEmpresa(
						"EN ESPERA",
						empresa.estado,
						empresa.id_empresa
					);
					this.empresas = [];
					this.getEmpresasByEstado(this.estado);
					this.doneMassage(
						"Empresa puesta EN ESPERA, se le ha mandado un correo a la empresa para notificarle de ello"
					);
				} else {
					this.errorMassage("No fue posible poner EN ESPERA la empresa");
				}
			});
	}

	changeEstado(estado: String) {
		this.estado = estado;
		this.getEmpresasByEstado(this.estado);
		Swal.fire({
			icon: "success",
			title: "Empresas actualizadas",
			text: "Se han actualizado los datos",
			showConfirmButton: false,
			timer: 2000,
		});
	}

	changeDiasDespues(check: boolean) {
		if (check) {
			this.getEmpresasEnEsperaXDias(this.diasEnEspera);
		} else {
			this.getEmpresasByEstado(this.estado);
		}
	}

	addAccionEmpresa(estado: string, estadoAnterior: string, idEmpresa: number) {
		const idAdmin = parseInt(localStorage.getItem("id_usuario"));
		const formData = {
			idAdministrador: idAdmin,
			estadoAnterior: estadoAnterior,
			estado: estado,
			idEmpresa: idEmpresa,
		};
		this.companyAdministratorService.addAccionEmpresa(formData).subscribe();
	}

	doneMassage(message: string): void {
		Swal.fire({
			icon: "success",
			title: "Estado actualizado",
			text: message,
			showConfirmButton: false,
			timer: 4000,
		});
	}

	errorMassage(message: string): void {
		Swal.fire({
			icon: "error",
			title: "Ocurrió un error",
			text: message,
			showConfirmButton: false,
			timer: 4000,
		});
	}
}
