import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';

import { CoreModule, provideTranslations } from '@alfresco/adf-core';

@Component({
  standalone: true,
  imports: [ RouterModule, CoreModule],
  providers: [
    provideTranslations('app', 'assets/i18n')
  ],
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
})
export class AppComponent {
  title = 'my-dms';
}
