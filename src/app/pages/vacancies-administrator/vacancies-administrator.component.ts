import { Component, OnInit } from "@angular/core";
import { VacanciesAdministratorService } from "./vacancies-administrator.service";
import { VacantesI } from "../../models/vacante";
import { AuthResponseI } from "../../models/auth-response";
import Swal from "sweetalert2";
import { FormControl } from "@angular/forms";
import { debounceTime } from "rxjs/operators";
import { PageEvent } from "@angular/material/paginator";

@Component({
	selector: "app-vacancies-administrator",
	templateUrl: "./vacancies-administrator.component.html",
	styleUrls: ["./vacancies-administrator.component.css"],
})
export class VacanciesAdministratorComponent implements OnInit {
	vacantes: VacantesI[] = [];
	estado: String = null;
	diasEnEspera: number = 15;
	buscarPalabra: string = "";
	diasDespues: boolean = false;
	page_size: number = 5;
	page_number: number = 1;
	pageSizeOptions: number[] = [5, 10, 20, 50, 100];

	search = new FormControl("");

	constructor(
		private vacantesAdministradorService: VacanciesAdministratorService
	) {}

	ngOnInit(): void {
		this.getVacantesByEstado();
		this.search.valueChanges.pipe(debounceTime(300)).subscribe((value) => {
			this.buscarPalabra = value;
			this.buscarVacantes(value);
		});
	}

	getVacantesByEstado(estado: String = null): void {
		const formData = { estado: estado };
		this.vacantesAdministradorService
			.getVacantesByEstado(formData)
			.subscribe((resp: AuthResponseI) => {
				if (resp.status) {
					this.vacantes = resp.data;
				}
			});
	}

	getVacantesEnEsperaXDias(dias: number): void {
		this.vacantesAdministradorService
			.getVacantesEnEsperaXDias(dias)
			.subscribe((resp: AuthResponseI) => {
				if (resp.status) {
					this.vacantes = resp.data;
				}
			});
	}

	aceptarVacante(vacante: VacantesI): void {
		this.vacantesAdministradorService
			.aceptarVacante(vacante.id_vacante)
			.subscribe((resp: AuthResponseI) => {
				if (resp.status) {
					this.addAccionVacante("ACEPTADA", vacante.estado, vacante.id_vacante);
					this.vacantes = [];
					this.getVacantesByEstado(this.estado);
					this.doneMassage(
						"Vacante ACEPTADA, se le ha mandado un correo a la empresa para notificarle de ello"
					);
				} else {
					this.errorMassage("No fue posible ACEPTAR la vacante");
				}
			});
	}

	rechazarVacante(vacante: VacantesI): void {
		const idAdmin = parseInt(localStorage.getItem("id_usuario"));
		this.vacantesAdministradorService
			.rechazarVacante(vacante.id_vacante, idAdmin)
			.subscribe((resp: AuthResponseI) => {
				if (resp.status) {
					this.addAccionVacante(
						"RECHAZADA",
						vacante.estado,
						vacante.id_vacante
					);
					this.vacantes = [];
					this.getVacantesByEstado(this.estado);
					this.doneMassage(
						"Vacante RECHAZADA, se le ha mandado un correo a la empresa para notificarle de ello"
					);
				} else {
					this.errorMassage("No fue posible RECHAZAR la vacante");
				}
			});
	}

	enEsperaVacante(vacante: VacantesI): void {
		this.vacantesAdministradorService
			.enEsperaVacante(vacante.id_vacante, this.diasEnEspera)
			.subscribe((resp: AuthResponseI) => {
				if (resp.status) {
					this.addAccionVacante(
						"EN ESPERA",
						vacante.estado,
						vacante.id_vacante
					);
					this.vacantes = [];
					this.getVacantesByEstado(this.estado);
					this.doneMassage(
						"Vacante puesta EN ESPERA, se le ha mandado un correo a la empresa para notificarle de ello"
					);
				} else {
					this.errorMassage("No fue posible poner EN ESPERA la vacante");
				}
			});
	}

	buscarVacantes(palabra: string): void {
		this.vacantesAdministradorService
			.buscarVacantes(palabra)
			.subscribe((resp: AuthResponseI) => {
				this.vacantes = [];
				if (resp.status) {
					if (palabra !== "") {
						this.vacantes = resp.data;
					} else {
						if (this.estado === "EN ESPERA" && this.diasDespues) {
							this.getVacantesEnEsperaXDias(this.diasEnEspera);
						} else {
							this.getVacantesByEstado(this.estado);
						}
					}
				}
			});
	}

	changeEstado(estado: String) {
		this.estado = estado;
		this.getVacantesByEstado(this.estado);
		Swal.fire({
			icon: "success",
			title: "Vacantes actualizadas",
			text: "Se han actualizado los datos",
			showConfirmButton: false,
			timer: 2000,
		});
	}

	changeDiasDespues(check: boolean) {
		if (check) {
			this.diasDespues = true;
			this.getVacantesEnEsperaXDias(this.diasEnEspera);
		} else {
			this.diasDespues = false;
			this.getVacantesByEstado(this.estado);
		}
	}

	addAccionVacante(estado: string, estadoAnterior: string, idVacante: number) {
		const idAdministrador = parseInt(localStorage.getItem("id_usuario"));
		const formData = {
			idAdministrador,
			estadoAnterior,
			estado,
			idVacante,
		};
		this.vacantesAdministradorService.addAccionVacante(formData).subscribe();
	}

	handlePage(e: PageEvent) {
		this.page_size = e.pageSize;
		this.page_number = e.pageIndex + 1;
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
