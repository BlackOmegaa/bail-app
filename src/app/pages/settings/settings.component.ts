import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { BankConnectionComponent } from "../bank-connection/bank-connection.component";

@Component({
  selector: 'app-settings',
  imports: [BankConnectionComponent],
  templateUrl: './settings.component.html',
  styleUrl: './settings.component.scss'
})
export class SettingsComponent {

  constructor(private router: Router) { }


}
