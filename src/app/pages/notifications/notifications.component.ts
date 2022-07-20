import { Component, Host, OnInit, resolveForwardRef } from '@angular/core';
import { NotificationsService } from './notifications.service';
import { AuthResponseI } from '../../models/auth-response';
import { NotificationI } from '../../models/notificacion';
import { Router } from '@angular/router';
import { NavbarService } from 'app/shared/navbar/navbar.service';

@Component({
  selector: 'app-notifications',
  templateUrl: './notifications.component.html',
  styleUrls: ['./notifications.component.css']
})
export class NotificationsComponent implements OnInit {

  notificaciones: NotificationI[] = [];

  constructor(
    private notifService: NotificationsService,
    private router: Router,
    private navbarService: NavbarService
  ) { }

  ngOnInit(): void {
   this.notifService.getNotificaciones().subscribe((resp: AuthResponseI) => {
      if (resp.status) {
        this.notificaciones = resp.data;
      }
   })
  }

  verNotificacion(idNotificacion, url) {
    this.notifService.verNotificacion(idNotificacion).subscribe((resp: AuthResponseI) => {
      if (resp.status) {
        if (this.navbarService.getNum() > 0) {
          this.navbarService.setNumN(this.navbarService.getNum() - 1);
        }
        this.router.navigate([url]);
      }
    })
  }

}
