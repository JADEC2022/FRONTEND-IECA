import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import Swal from 'sweetalert2';
import { ComponentsService } from '../components.service';
import { AuthResponseI } from '../../models/auth-response';

@Component({
    selector: 'app-valid-email',
    templateUrl: './valid-email.component.html',
    styleUrls: ['./valid-email.component.css']
})
export class ValidEmailComponent implements OnInit {

    email_validado: boolean;
    token: string;
    id: number;
    ruta: string;

    constructor(
        private activatedRoute: ActivatedRoute,
        private componentService: ComponentsService,
        private router: Router
    ) {
        this.id = 0;
        this.token = '';
        this.email_validado = false;
        this.ruta = '';
    }

    ngOnInit(): void {
        this.params();
        this.validarEmail();
        this.getRuta();
    }

    //  ---------- MENSAJES ---------- //
    errorServer(): void { // Lo sentimos su petición no puede ser procesada, favor de ponerse en contacto con soporte técnico
        Swal.fire({
            icon: 'error',
            title: 'Petición no procesada',
            text: `Vuelve a intentar de nuevo.
            Si el error persiste, comuníquese con soporte técnico.`,
        });
    }

    errorMassage(): void {
        Swal.fire({
            icon: 'error',
            title: 'Ocurrió un error al enviar el correo',
            text: 'Vuelve a intentarlo de nuevo.',
        });
    }

    emailEnviado(): void {
        Swal.fire({
            icon: 'success',
            title: 'Correo enviado',
            text: 'Por favor revise su bandeja de entrada o spam',
            showConfirmButton: false,
            timer: 2700
        });
    }

    //  ---------- RECIBIR PARAMETROS DE LA URL ---------- //
    params(): void {
        this.activatedRoute.params.subscribe(
            params => {
                this.id = Number(params.id);
                this.token = params.token;
            });
    }

    //  ---------- PETICIONES ---------- //
    validarEmail(): void {
        this.componentService.validarEmail(this.id).subscribe(
            (resp: AuthResponseI) => {
                if (!resp.status) {
                    return;
                }
                this.email_validado = true;
                return;
            },
            (error) => {
                this.errorServer();
            }
        )
    }

    

    reenviarCorreo(): void {
        // Peticion mamalona para reenviar el correo de validacion
        this.componentService.getUsuario().subscribe((resp: any) => {
            if (!resp.status) {
                return this.errorMassage();
            }
            let email = resp.data.email;

            this.componentService.sendEmail({
                email: email,
                ruta: 'validarEmail'
            }).subscribe((resp: any) => {
                if (!resp.status) {
                    return this.errorMassage();
                }

                this.emailEnviado();
            })
        })
    }

    getRuta(): void {
        let ruta = ''
        this.componentService.getUsuario(this.id).subscribe((resp: any) => {
            if (!resp.status) {
                return this.errorMassage();
            }
            if (resp.data.tipo_usuario == 'Postulante') {
                ruta = 'vacancies'
            } else {
                ruta = 'my-vacancies';
            }
        })

        this.ruta = ruta;
    }

}
