import { Component, Input, OnInit } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { AuthResponseI } from "app/models/auth-response";
import Swal from "sweetalert2";
import { SucursalesI } from "../../../../models/sucursal";
import { VacantesI } from "../../../../models/vacante";
import { VacanteService } from "./vacante.service";
import { Router } from "@angular/router";
import { UsuarioI } from "../../../../models/usuario";

export interface Element {
	value: string;
	viewValue: string;
}

const NIVEL: Element[] = [
	{ value: "Practicante", viewValue: "Practicante" },
	{ value: "Ejecutivo", viewValue: "Ejecutivo" },
	{ value: "Supervisor", viewValue: "Supervisor" },
];

const MODALIDAD: Element[] = [
	{ value: "Tiempo completo", viewValue: "Tiempo completo" },
	{ value: "Medio tiempo", viewValue: "Medio tiempo" },
	{ value: "Temporal", viewValue: "Temporal" },
	{ value: "Home Office", viewValue: "Home Office" },
];

@Component({
	selector: "app-vacante-form",
	templateUrl: "./vacante.component.html",
	styleUrls: ["./vacante.component.css"],
})
export class VacanteComponent implements OnInit {
	@Input() vacante: VacantesI;
	sucursales: SucursalesI[];
	public niveles = NIVEL;
	public modalidades = MODALIDAD;
	public negociable = false;
	public elegirSucursal = false;

	public formSubmitted = false;
	public vacanteForm = this.formBuilder.group({
		puesto: ["", [Validators.required, Validators.minLength(5)]],
		nivel: ["", Validators.required],
		sueldo: ["", [Validators.required, Validators.min(1)]],
		modalidad: ["", Validators.required],
		descripcion: ["", Validators.required],
		id_sucursal_fk: [],
		publicada: [],
		fecha_publicacion: [],
		negociable: [],
		elegirSucursal: [],
	});

	constructor(
		private formBuilder: FormBuilder,
		private vacanteService: VacanteService,
		private router: Router
	) {}

	ngOnInit(): void {
		this.loadData();
		this.vacanteService.getSucursales().subscribe((resp: AuthResponseI) => {
			if (resp.status) {
				this.sucursales = resp.data;
			}
		});
	}

	loadData() {
		this.vacanteForm.reset(this.vacante);
		if (this.vacante.sueldo == "Negociable") {
			this.negociable = true;
			this.vacanteForm.get("negociable").setValue(true);
		}

		if (this.vacante.id_sucursal_fk) {
			this.elegirSucursal = true;
		}
	}

	updateVacante(tipo) {
		this.cargarData(tipo);
		this.formSubmitted = true;
		if (this.vacanteForm.valid) {
			this.vacanteService
				.updateVacante(this.vacante.id_vacante, this.vacanteForm.value)
				.subscribe((resp: AuthResponseI) => {
					if (resp.status) {
						this.addNotificacion(this.vacante);
						this.doneMassage("Experiencia Laboral actualiza");
					}
				});
		} else {
			this.errorMassage();
		}
	}

	deleteVacante() {
		this.vacanteService
			.deleteVacante(this.vacante.id_vacante)
			.subscribe((resp: AuthResponseI) => {
				if (resp.status) {
					this.doneMassage("Experiencia Laboral eliminada");
					this.router.navigateByUrl("/my-vacancies");
				}
			});
	}

	cargarData(tipo) {
		if (this.negociable) {
			this.vacanteForm.get("sueldo").setValue("Negociable");
		}
		if (!this.elegirSucursal) {
			this.vacanteForm.get("id_sucursal_fk").setValue(null);
		}
		if (tipo == 1) {
			this.vacanteForm.get("publicada").setValue(false);
		} else {
			this.vacanteForm.get("publicada").setValue(true);
			let date = new Date(Date.now());
			this.vacanteForm.get("fecha_publicacion").setValue(date);
		}
	}

	isNegociable() {
		if (this.vacanteForm.get("negociable").value) {
			this.negociable = false;
		} else {
			this.negociable = true;
		}
	}

	isSucursal() {
		if (this.vacanteForm.get("elegirSucursal").value) {
			this.elegirSucursal = false;
		} else {
			this.elegirSucursal = true;
		}
	}

	addNotificacion(vacante: VacantesI) {
		let vacanteGuardada: VacantesI;
		let company: UsuarioI;
		this.vacanteService.readCompany().subscribe((resp: AuthResponseI) => {
			if (!resp.status) {
				return console.error("Error");
			}
			company = resp.data;
			if (vacante.estado === "EN ESPERA") {
				let url = `/vacancies-administrator/${vacante.id_vacante}`;
				let titulo =
					"La vacante para el puesto de " +
					vacante.puesto +
					" se ha actualizado";
				let mensaje =
					company.nombre +
					" ha actualizado los datos de la vacante " +
					vacante.descripcion +
					".\n Actualmente está en la lista de vacantes en espera, aceptala para que la vean los postulantes.";

				this.vacanteService
					.addNotificacion(url, titulo, mensaje, vacante.id_vacante, 2) // 2 debe ser el id del SuperAdministrador
					.subscribe((resp: AuthResponseI) => {
						if (!resp.status) {
							console.log(resp);
						}
					});
			}
		});
	}

	//  ---------- VALIDADORES ---------- //
	/* Validar los control name */
	campoNoValido(campo: string): boolean {
		if (this.vacanteForm.get(campo).invalid && this.formSubmitted) {
			return true;
		} else {
			return false;
		}
	}

	//  ---------- MENSAJES ---------- //
	errorServer(error: any): void {
		// Lo sentimos su petición no puede ser procesada, favor de ponerse en contacto con soporte técnico
		Swal.fire({
			icon: "error",
			title: "Petición no procesada",
			text: `Vuelve a intentar de nuevo.
      Si el error persiste, comuníquese con el soporte técnico.`,
		});
		console.log(error);
	}

	errorMassage(): void {
		Swal.fire({
			icon: "error",
			title: "Verifica el formulario",
			text: "Verifica que el formulario este completo.",
			showConfirmButton: false,
			timer: 2700,
		});
	}

	doneMassage(message: string): void {
		Swal.fire({
			icon: "success",
			title: "Cambios Actualizados",
			text: message,
			showConfirmButton: false,
			timer: 2700,
		});
	}

	errorPeticion(error: string): void {
		Swal.fire({
			icon: "error",
			title: "Error",
			text: error,
			showConfirmButton: false,
			timer: 2700,
		});
	}
}
