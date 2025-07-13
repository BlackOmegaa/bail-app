
import { Component, Input, HostBinding } from '@angular/core';
import { Notification } from '../../../core/services/notification/notification.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-notification-item',
  templateUrl: './notification-item.component.html',
  styleUrls: ['./notification-item.component.scss'],
  imports: [CommonModule]
})
export class NotificationItemComponent {
  @Input() notification!: Notification;

  @HostBinding('class.hiding') get isHiding() {
    return this.notification?.isHiding;
  }

}
