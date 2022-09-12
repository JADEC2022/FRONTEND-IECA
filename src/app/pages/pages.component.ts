import { Component, OnInit, ViewChild, AfterViewInit } from '@angular/core';
import { Location, LocationStrategy, PathLocationStrategy, PopStateEvent } from '@angular/common';
import 'rxjs/add/operator/filter';
import { NavbarComponent } from '../shared/navbar/navbar.component';
import { AuthResponseI } from '../models/auth-response';
import { Router, NavigationEnd, NavigationStart } from '@angular/router';
import { Subscription } from 'rxjs/Subscription';
import PerfectScrollbar from 'perfect-scrollbar';
import * as $ from 'jquery';
import { AuthUserService } from '../auth/auth-user.service';
import Swal from 'sweetalert2';
import { UserProfileService } from './user-profile/user-profile.service';
import { GuardsService } from '../services/guards.service';

@Component({
    selector: 'app-admin-layout',
    templateUrl: './pages.component.html',
    styleUrls: ['./pages.component.scss']
})
export class PagesComponent implements OnInit {
    private _router: Subscription;
    private lastPoppedUrl: string;
    private yScrollStack: number[] = [];

    constructor(public location: Location,
                public authService: AuthUserService,
                private userProfileService: UserProfileService,
                private guardService: GuardsService,
                private router: Router) {
    }

    ngOnInit() {
        const isWindows = navigator.platform.indexOf('Win') > -1 ? true : false;

        if (isWindows && !document.getElementsByTagName('body')[0].classList.contains('sidebar-mini')) {
            // if we are on windows OS we activate the perfectScrollbar function

            document.getElementsByTagName('body')[0].classList.add('perfect-scrollbar-on');
        } else {
            document.getElementsByTagName('body')[0].classList.remove('perfect-scrollbar-off');
        }
        const elemMainPanel = <HTMLElement>document.querySelector('.main-panel');
        const elemSidebar = <HTMLElement>document.querySelector('.sidebar .sidebar-wrapper');

        this.location.subscribe((ev: PopStateEvent) => {
            this.lastPoppedUrl = ev.url;
        });
        this.router.events.subscribe((event: any) => {
            if (event instanceof NavigationStart) {
                if (event.url !== this.lastPoppedUrl) {
                    this.yScrollStack.push(window.scrollY);
                }
            } else if (event instanceof NavigationEnd) {
                if (event.url === this.lastPoppedUrl) {
                    this.lastPoppedUrl = undefined;
                    window.scrollTo(0, this.yScrollStack.pop());
                } else {
                    window.scrollTo(0, 0);
                }
            }
        });
        this._router = this.router.events.filter(event => event instanceof NavigationEnd).subscribe((event: NavigationEnd) => {
            elemMainPanel.scrollTop = 0;
            elemSidebar.scrollTop = 0;
        });
        if (window.matchMedia(`(min-width: 960px)`).matches && !this.isMac()) {
            let ps = new PerfectScrollbar(elemMainPanel);
            ps = new PerfectScrollbar(elemSidebar);
        }

        const window_width = $(window).width();
        const $sidebar = $('.sidebar');
        const $sidebar_responsive = $('body > .navbar-collapse');
        const $sidebar_img_container = $sidebar.find('.sidebar-background');


        if (window_width > 767) {
            if ($('.fixed-plugin .dropdown').hasClass('show-dropdown')) {
                $('.fixed-plugin .dropdown').addClass('open');
            }

        }

        $('.fixed-plugin a').click(function (event) {
            // Alex if we click on switch, stop propagation of the event,
            // so the dropdown will not be hide, otherwise we set the  section active
            if ($(this).hasClass('switch-trigger')) {
                if (event.stopPropagation) {
                    event.stopPropagation();
                } else if (window.event) {
                    window.event.cancelBubble = true;
                }
            }
        });

        $('.fixed-plugin .badge').click(function () {
            const $full_page_background = $('.full-page-background');


            $(this).siblings().removeClass('active');
            $(this).addClass('active');

            const new_color = $(this).data('color');

            if ($sidebar.length !== 0) {
                $sidebar.attr('data-color', new_color);
            }

            if ($sidebar_responsive.length !== 0) {
                $sidebar_responsive.attr('data-color', new_color);
            }
        });

        $('.fixed-plugin .img-holder').click(function () {
            const $full_page_background = $('.full-page-background');

            $(this).parent('li').siblings().removeClass('active');
            $(this).parent('li').addClass('active');


            const new_image = $(this).find('img').attr('src');

            if ($sidebar_img_container.length !== 0) {
                $sidebar_img_container.fadeOut('fast', function () {
                    $sidebar_img_container.css('background-image', 'url("' + new_image + '")');
                    $sidebar_img_container.fadeIn('fast');
                });
            }

            if ($full_page_background.length !== 0) {

                $full_page_background.fadeOut('fast', function () {
                    $full_page_background.css('background-image', 'url("' + new_image + '")');
                    $full_page_background.fadeIn('fast');
                });
            }

            if ($sidebar_responsive.length !== 0) {
                $sidebar_responsive.css('background-image', 'url("' + new_image + '")');
            }
        });

        this.mensajesDeInicio();
    }

    // tslint:disable-next-line:use-life-cycle-interface
    ngAfterViewInit(): void {
        this.runOnRouteChange();
    }

    isMaps(path) {
        let titlee = this.location.prepareExternalUrl(this.location.path());
        titlee = titlee.slice(1);
        if (path === titlee) {
            return false;
        } else {
            return true;
        }
    }

    runOnRouteChange(): void {
        if (window.matchMedia(`(min-width: 960px)`).matches && !this.isMac()) {
            const elemMainPanel = <HTMLElement>document.querySelector('.main-panel');
            const ps = new PerfectScrollbar(elemMainPanel);
            ps.update();
        }
    }

    isMac(): boolean {
        let bool = false;
        if (navigator.platform.toUpperCase().indexOf('MAC') >= 0 || navigator.platform.toUpperCase().indexOf('IPAD') >= 0) {
            bool = true;
        }
        return bool;
    }

    mensajesDeInicio(): void {
        if (localStorage.getItem('tipo_usuario') === 'Empresa') {
            this.guardService.validarPerfil().subscribe((resp: any) => {
                if (!resp.status) {
                    let errors = `
                        <style type="text/css">
                          .justificado{
                            text-align: justify;
                          }
                        </style>
                        <p class="justificado">
                            Para que la cuenta de su empresa sea ACEPTADA y pueda usarse con normalidad debe de haber llenado toda su información. 
                            Actualmente hay algunos apartados que requieren ser completados. Si no se completan estos campos no se podrá revisar su cuenta para ser aceptada.
                        </p>
                        <p>Apartados faltantes: </p>
                    `;
                    resp.data.forEach((error) => {
                      errors += `<div>${error}</div>`;
                    });
                    this.validatedEmpresaMessage(errors);
                } else {
                    this.userProfileService.getUsuario().subscribe((resp: AuthResponseI) => {
                        let divTexto: string = `Actualmente su empresa está EN REVISIÓN. Espere a que los administradores validen su información y se le avise por correo.`;
                        let html: string = `
                            <style type="text/css">
                              div{
                                text-align: justify;
                              }
                            </style>
                            <div>${divTexto}</div>`;
                        if (resp.status && !resp.data.estado) {
                            this.infoMassage(html);
                        }
                    });
                }
            });
        }
    }

    validatedEmpresaMessage(errors): void {
        Swal.fire({
          icon: "info",
          title: "Complete la información faltante de su perfil",
          html: errors,
          showCancelButton: true,
          confirmButtonText: "!Completar ahora!",
          cancelButtonText: "Entendido"
        }).then((result) => {
          if (result.isConfirmed) {
            this.router.navigateByUrl('/company-profile');
          }
        });
      }

    infoMassage(html: string): void {
        Swal.fire({
          icon: 'info',
          title: '¡Atención!',
          html,
          showConfirmButton: true
        });
    }

}
