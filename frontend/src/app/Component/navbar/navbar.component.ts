import { Component, OnInit } from '@angular/core';
declare var google: any;
import { CustomerService } from '../../service/customer.service';
import { Customer } from '../../model/customer.model';
import { Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.css',
})
export class NavbarComponent implements OnInit {
  constructor(
    private router: Router,
    private customerservice: CustomerService,
    private translate: TranslateService 
  ) {}
  isloggedIn: boolean = false;
  ngOnInit(): void {
    if (sessionStorage.getItem('Loggedinuser')) {
      this.isloggedIn = true;
    } else {
      this.isloggedIn = false;
    }

    google.accounts.id.initialize({
      client_id:
        '835380870728-hq4e957151d3gt567rs4fltvdu72cqr1.apps.googleusercontent.com',
      callback: (response: any) => {
        this.handlelogin(response);
      },
    });
  }
  ngAfterViewInit(): void {
    this.rendergooglebutton();
  }
  private rendergooglebutton(): void {
    const googlebtn = document.getElementById('google-btn');
    if (googlebtn) {
      google.accounts.id.renderButton(googlebtn, {
        theme: 'outline',
        size: 'medium',
        shape: 'pill',
        width: 150,
      });
    }
  }

  private decodetoken(token: String) {
    return JSON.parse(atob(token.split('.')[1]));
  }
  handlelogin(response: any) {
    const payload = this.decodetoken(response.credential);
    // console.log(payload)
    this.customerservice.addcustomermongo(payload).subscribe({
      next: (response) => {
        // console.log('POST success',response);
        sessionStorage.setItem('Loggedinuser', JSON.stringify(response));
        window.location.reload();
      },
      error: (error) => {
        console.error('Post request failed', error);
      },
    });
  }
  handlelogout() {
    google.accounts.id.disableAutoSelect();
    sessionStorage.removeItem('Loggedinuser');
    window.location.reload();
  }
  navigate(route: string) {
    this.router.navigate([route]);
  }

  changeLanguage(event: Event) {
    const selectElement = event.target as HTMLSelectElement;
    const lang = selectElement.value;
    console.log("selected language",lang)
    this.translate.use(lang);
  }
}
