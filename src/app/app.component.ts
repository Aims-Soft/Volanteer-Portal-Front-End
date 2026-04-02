import { Component } from '@angular/core';
import { ActivatedRoute, Router, NavigationEnd } from '@angular/router';
import { filter } from 'rxjs/operators';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'css-portal';
  showNav = true;
  showSideNav = false;

  constructor(public router: Router) {
    this.router.events.pipe(
      filter(event => event instanceof NavigationEnd)
    ).subscribe(() => this.updateNavVisibility());

    this.updateNavVisibility();
  }

  private updateNavVisibility(): void {
    const url = this.router.url.split('?')[0].split('#')[0];

    const hideTopNavRoutes = [
    '/login', '/admin-dashboard', '/employees', '/skill', '/incident', '/volunteerRegistration', '/candidateprofile'
  
    ];

    const showSideNavRoutes = [
      '/admin-dashboard', 
    
    ];

    this.showNav = !(url.startsWith('/admin-dashboard') ||
                     url.startsWith('/candidateprofile') ||
                     hideTopNavRoutes.includes(url));

    this.showSideNav = url.startsWith('/applicationdetails') ||
                       url.startsWith('/candidateprofile') ||
                       showSideNavRoutes.includes(url);
  }
}