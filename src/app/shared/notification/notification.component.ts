
import { Component } from '@angular/core';
import { NotificationService, Notification } from '../../core/services/notification/notification.service';
import { Observable } from 'rxjs';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NotificationItemComponent } from './notification-item/notification-item.component';

@Component({
  selector: 'app-notification',
  templateUrl: './notification.component.html',
  styleUrls: ['./notification.component.scss'],
  imports: [CommonModule, FormsModule, NotificationItemComponent]
})
export class NotificationComponent {
  notifications$: Observable<Notification[]>;

  constructor(private notificationService: NotificationService) {
    this.notifications$ = this.notificationService.notifications$;
  }
}
