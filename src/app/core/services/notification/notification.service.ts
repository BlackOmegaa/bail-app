import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

export interface Notification {
  id: string;
  message: string;
  type: 'success' | 'error' | 'warning';
  duration?: number;
  isHiding?: boolean;
}

@Injectable({ providedIn: 'root' })
export class NotificationService {
  private notificationSubject = new BehaviorSubject<Notification[]>([]);
  notifications$ = this.notificationSubject.asObservable();

  push(message: string, type: Notification['type'], duration = 3000) {
    const notif: Notification = {
      id: this.generateUUID(),
      message,
      type,
      duration
    };
    const current = this.notificationSubject.getValue();
    this.notificationSubject.next([...current, notif]);
    setTimeout(() => {
      notif.isHiding = true;
      this.notificationSubject.next([...this.notificationSubject.getValue()]);

      setTimeout(() => this.dismiss(notif.id), 300);
    }, duration);
  }

  dismiss(id: string) {
    const current = this.notificationSubject.getValue();
    this.notificationSubject.next(current.filter(n => n.id !== id));
  }

  private generateUUID(): string {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, c => {
      const r = Math.random() * 16 | 0;
      const v = c === 'x' ? r : (r & 0x3 | 0x8);
      return v.toString(16);
    });
  }
}