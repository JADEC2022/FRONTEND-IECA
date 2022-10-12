import { Component, OnChanges, OnInit, SimpleChanges } from "@angular/core";

declare const $: any;

declare interface RouteInfo {
	path: string;
	title: string;
	icon: string;
	class: string;
}

export let ROUTES: RouteInfo[] = [];

@Component({
	selector: "app-sidebar",
	templateUrl: "./sidebar.component.html",
	styleUrls: ["./sidebar.component.css"],
})
export class SidebarComponent implements OnInit {
	menuItems: any[];

	constructor() {}
	ngOnInit(): void {
		this.cargarRoutes();
		this.menuItems = ROUTES.filter((menuItem) => menuItem);
	}

	isMobileMenu() {
		if ($(window).width() > 991) {
			return false;
		}
		return true;
	}

	cargarRoutes() {
		const tipo = localStorage.getItem("tipo_usuario");

		switch (tipo) {
			case "Postulante":
				ROUTES = [
					{ path: "/vacancies", title: "Inicio", icon: "dashboard", class: "" },
					{
						path: "/user-profile",
						title: "Mi Perfil",
						icon: "account_circle",
						class: "",
					},
					{
						path: "/favorites",
						title: "Vacantes Favoritas",
						icon: "favorite",
						class: "",
					},
					{
						path: "/my-postulations",
						title: "Mis Postulaciones",
						icon: "engineering",
						class: "",
					},
				];
				break;

			case "Empresa":
				ROUTES = [
					{
						path: "/my-vacancies",
						title: "Mis Vacantes",
						icon: "dashboard",
						class: "",
					},
					{
						path: "/company-profile",
						title: "Perfil de Empresa",
						icon: "person",
						class: "",
					},
					{
						path: "/create-vacancie",
						title: "Crear Vacante",
						icon: "work",
						class: "",
					},
				];
				break;

			case "Administrador":
				ROUTES = [
					{
						path: "/dashboard-administrator",
						title: "Inicio",
						icon: "dashboard",
						class: "",
					},
					{
						path: "/company-administrator/all",
						title: "Empresas",
						icon: "person",
						class: "",
					},
					{
						path: "/vacancies-administrator/all",
						title: "Vacantes",
						icon: "work",
						class: "",
					},
					{
						path: "/perfil-administrator",
						title: "Perfil del Administrador",
						icon: "account_circle",
						class: "",
					},
				];
				break;

			case "Superadministrador":
				ROUTES = [
					{
						path: "/dashboard-administrator",
						title: "Inicio",
						icon: "dashboard",
						class: "",
					},
					{
						path: "/company-administrator/all",
						title: "Empresas",
						icon: "person",
						class: "",
					},
					{
						path: "/vacancies-administrator/all",
						title: "Vacantes",
						icon: "work",
						class: "",
					},
					{
						path: "/new-administrator",
						title: "Nuevo administrador",
						icon: "person",
						class: "",
					},
					{
						path: "/perfil-administrator",
						title: "Perfil del Administrador",
						icon: "account_circle",
						class: "",
					},
				];
				break;

			default:
				console.log(`Tipo no encontrado`);
		}
	}
}
