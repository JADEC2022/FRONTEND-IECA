import { Component, OnInit, Output, ViewChild } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";

import Swal from "sweetalert2";

import { EmpresaService } from "./empresa.service";

import { Address } from "ngx-google-places-autocomplete/objects/address";
import { GooglePlaceDirective } from "ngx-google-places-autocomplete";

import { AuthResponseI } from "../../models/auth-response";
import { UsuarioI } from "../../models/usuario";
import { SucursalesI } from "../../models/sucursal";
import { SucursalesService } from "../components/forms/sucursales/sucursales.service";
import { GuardsService } from "../../services/guards.service";
import { I } from "@angular/cdk/keycodes";

@Component({
	selector: "app-company-profile",
	templateUrl: "./company-profile.component.html",
	styleUrls: ["./company-profile.component.css"],
})
export class CompanyProfileComponent implements OnInit {
	//  ---------- VARIABLES ---------- //
	company: UsuarioI;
	imgUpdate: File;
	branches: SucursalesI[];
	companyForm: FormGroup;

	panel = false; // false
	haveBranches = false; // Dejarlo en false
	panelOpenState = false;
	changeFoto = false;
	foto_perfil = "";
	extensionValid = false;
	tamnioValid = false;

	@ViewChild("placesRef") placesRef: GooglePlaceDirective; // autocompletar dirección

	constructor(
		private formB: FormBuilder,
		private empresaSvc: EmpresaService,
		private branchesSvc: SucursalesService,
		private guardService: GuardsService
	) {
		/* Variables */

		/* Métodos */
		this.loadData();
		this.companyCreateForm();
	}

	ngOnInit(): void {}

	//  ---------- VALIDADORES ---------- //
	/* Validar los control name */
	controlNoValid(controlName: string): boolean | Validators {
		return (
			this.companyForm.controls[controlName].errors &&
			this.companyForm.controls[controlName].touched
		);
	}

	/* Validar formulario */
	formularioNoValido(): boolean {
		if (this.companyForm.invalid) {
			this.companyForm.markAllAsTouched();
			return true;
		}
		return false;
	}

	//  ---------- FORMULARIO ---------- //
	companyCreateForm(): void {
		this.companyForm = this.formB.group({
			nombre: [, [Validators.required, Validators.minLength(2)]],
			administrador: [, [Validators.required, Validators.minLength(3)]],
			ubicacion: [, [Validators.required, Validators.minLength(5)]],
			giro: [, [Validators.required, Validators.minLength(3)]],
			pagina_web: [],
			telefono: [, [Validators.required, Validators.maxLength(10)]],
		});
	}

	public imageForm = this.formB.group({
		foto_perfil: [""],
	});

	//  ---------- MÉTODOS ---------- //
	/* Cargar datos al template */
	loadData(): void {
		this.empresaSvc.readCompany().subscribe(
			(resp: AuthResponseI) => {
				// console.log(resp);
				if (!resp.status) {
					return this.errorMassage("Error al obtener los datos");
				}

				// Cargar datos al objeto company
				this.company = resp.data;
				this.foto_perfil = this.company.foto_perfil;

				// this.empresaSvc._company = resp.data;

				// Cargar datos al formulario
				this.companyForm.reset(resp.data);

				// Si no existe una foto, asignar una por default
				/*if (!resp.data.foto_empresa) {
          this.company.foto_perfil = './assets/img/faces/marc.jpg';
        }*/

				// if (resp.data.numero_sucursales > 0) { this.loadBranches(); }
				this.loadBranches(); // Borrar
			},
			(error) => {
				/* ! Mensaje de error si el servidor no recibe las peticiones */
				console.log(error);
				this.errorServer();
			}
		);
	}

	/* Extraer las sucursales de la empresa */
	loadBranches() {
		this.panelOpenState = false;
		this.branchesSvc.readBranches().subscribe(
			(result: AuthResponseI) => (this.branches = result.data),
			(error) => {
				/* ! Mensaje de error si el servidor no recibe las peticiones */
				console.log(error);
				this.errorServer();
			}
		);
	}

	/* Actualizar Datos de la Empresa */
	updateCompany(): void {
		// Validar formulario
		if (this.formularioNoValido()) {
			// Mensaje de error de validación
			return this.errorMassage("Para actualizar, completa el formulario");
		}

		//console.log(this.companyForm.value);
		if (this.companyForm.get("pagina_web").value == "") {
			this.companyForm.get("pagina_web").setValue(null);
		}
		// const primeraRevision: boolean = this.validarLlenado();
		// Petición al services de actualizar la información de la empresa
		this.empresaSvc.updateCompany(this.companyForm.value).subscribe(
			(response) => {
				// Verificar que se haya actualizado la BD con el status
				if (!response.status) {
					// Mensaje de error de respuesta
					return this.errorMassage("No es posible actualizar los datos");
				}

				// Recargar el formulario y actualizar variables
				this.loadData();

				this.revisarNotificacion(); //-------------------------------------------

				// Mensaje de cambios guardados
				return this.doneMassage("Información actualizada");
			},
			(error) => {
				/* Mensaje de error si el servidor no recibe las peticiones */
				console.log(error);
				this.errorServer();
			}
		);
		// const segundaRevision: boolean = this.validarLlenado();

		// if (primeraRevision && !segundaRevision) {
		// 	this.addNotificacion();
		// }
	}

	// Autocompletar la dirección en la ubicación
	public handleAddressChange(address: Address) {
		// Asignar el valor de google al formulario de registerEmpresaForm
		this.companyForm.reset({
			nombre: this.companyForm.value.nombre,
			administrador: this.companyForm.value.administrador,
			ubicacion: address.formatted_address,
			giro: this.companyForm.value.giro,
			pagina_web: this.companyForm.value.pagina_web,
			telefono: this.companyForm.value.telefono,
		});
	}

	capturarImage(event) {
		const imageCapturada = event.target.files[0];
		if (this.validarFile(imageCapturada)) {
			this.extraerBase64(imageCapturada).then((image: any) => {
				this.foto_perfil = image.base;
				this.changeFoto = true;
			});
		}
	}

	extraerBase64 = async ($event: any) =>
		new Promise((resolve, reject) => {
			try {
				const reader = new FileReader();
				reader.readAsDataURL($event);
				reader.onload = () => {
					resolve({
						base: reader.result,
					});
				};
				reader.onerror = (error) => {
					resolve({
						base: null,
					});
				};
			} catch (error) {
				return null;
			}
		});

	guardarFoto() {
		try {
			this.imageForm.get("foto_perfil").setValue(this.foto_perfil);
			this.empresaSvc.updateFoto(this.imageForm.value).subscribe(
				(resp: AuthResponseI) => {
					if (resp.status) {
						this.doneMassage(resp.data);
						this.changeFoto = false;
						this.revisarNotificacion(); //--------------------------------------
					} else {
						this.errorMassage(resp.data);
					}
				},
				(error) => {
					this.errorServer();
				}
			);
		} catch (error) {
			console.log(error);
			return null;
		}
	}

	validarFile(event) {
		this.changeFoto = false;
		const extensionesPermitidas = [".png", ".jpg", ".jpeg"];
		const tamanio = 0.75;
		const rutaArchivo = event.name;
		const ultimoPunto = event.name.lastIndexOf(".");
		const extension = rutaArchivo.slice(ultimoPunto, rutaArchivo.length);
		console.log(event.size);
		if (extensionesPermitidas.indexOf(extension) === -1) {
			this.extensionValid = true;
			return false;
		}

		if (event.size / 100000 > tamanio) {
			this.tamnioValid = true;
			return false;
		}

		this.extensionValid = false;
		this.tamnioValid = false;
		return true;
	}

	revisarNotificacion() {
		let datos;
		this.guardService.validarPerfil().subscribe((resp: AuthResponseI) => {
			if (resp.status) {
				// Perfil validado
				this.empresaSvc
					.getNotificacionesAdmin()
					.subscribe((resp: AuthResponseI) => {
						if (resp.status) {
							// Todas las notificaciones de admin
							datos = resp.data;
							let validado = true;
							datos.forEach((element) => {
								// Revisa todas las notificaciones en busca de que ya exista
								if (element.Usuario) {
									if (element.Usuario.id_usuario === this.company.id_usuario) {
										// si encuentra una existente
										validado = false;
									}
								}
							});
							if (validado) {
								this.addNotificacion("EN REVISION");
							} else if (this.company.estado === "EN ESPERA") {
								this.addNotificacion("EN ESPERA");
							}
						}
					});
			}
		});
	}

	addNotificacion(estado: string) {
		let url;
		let titulo;
		let mensaje;

		switch (estado) {
			case "EN REVISION":
				url = `/company-administrator/${this.company.id_usuario}`;
				titulo = this.company.nombre + " a completado su registro.";
				mensaje =
					this.company.nombre +
					" se ha añadido a la lista de empresas en revisión, aceptala para que pueda crear vacantes.";
				break;

			case "EN ESPERA":
				url = `/company-administrator/${this.company.id_usuario}`;
				titulo = this.company.nombre + " a actualizado sus datos.";
				mensaje =
					this.company.nombre +
					" se encuentra en la lista de empresas en espera y ya a actualizado sus datos.";
				break;
		}

		this.empresaSvc
			.addNotificacion(url, titulo, mensaje, 2, this.company.id_usuario) // 2 debe ser el id del SuperAdministrador
			.subscribe((resp: AuthResponseI) => {
				if (!resp.status) {
					console.log(resp);
				}
			});
	}

	//  ---------- MENSAJES ---------- //
	errorServer(): void {
		// Lo sentimos su petición no puede ser procesada, favor de ponerse en contacto con soporte técnico
		Swal.fire({
			icon: "error",
			title: "Petición no procesada",
			text: `Vuelve a intentar de nuevo.
      Si el error persiste, comuníquese con el soporte técnico.`,
		});
	}

	errorMassage(text: string): void {
		Swal.fire({
			icon: "error",
			title: "Error",
			text: text,
			showConfirmButton: false,
			timer: 2700,
		});
	}

	doneMassage(text: string): void {
		Swal.fire({
			icon: "success",
			title: text,
			showConfirmButton: false,
			timer: 2700,
		});
	}
}
