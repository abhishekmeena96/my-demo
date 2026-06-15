import { Component, ViewEncapsulation } from '@angular/core';
import { LoginComponent } from '@alfresco/adf-core';

@Component({
  selector: 'app-login',
  standalone: true,
  imports :[LoginComponent],
  templateUrl: '../login/login.component.html',
  styles:[`
    .adf-login{
    background: #fff;
    }
    `],
    encapsulation:ViewEncapsulation.None

})
export class AppLoginComponent {
}
    

