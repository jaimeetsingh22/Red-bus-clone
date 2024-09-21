import { Component } from '@angular/core';
import { TranslateService } from '@ngx-translate/core'; // Import TranslateService

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'] 
})
export class AppComponent {
  title = 'frontend';

  constructor(private translate: TranslateService) {
    translate.addLangs(['en', 'hi', 'fr', 'ru']);
    
    translate.setDefaultLang('en');

    const browserLang = translate.getBrowserLang();
    if (browserLang) { 
      translate.use(browserLang.match(/en|hi|fr|ru/) ? browserLang : 'en');
    } else {
      translate.use('en'); 
    }
  }

  changeLanguage(lang: string) {
    this.translate.use(lang);
  }
}