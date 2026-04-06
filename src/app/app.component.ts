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
    '/login', '/adminDashboard', '/employees', '/skill', '/incident', '/volunteerReg', '/configuration'
  
    ];

    const showSideNavRoutes = [
      '/adminDashboard', '/employees', '/skill', '/incident', '/volunteerReg', '/configuration'
    
    ];

    this.showNav = !(url.startsWith('/adminDashboard') ||
                     url.startsWith('/candidateprofile') ||
                     hideTopNavRoutes.includes(url));

    this.showSideNav = url.startsWith('/adminDashboard') ||
                       url.startsWith('/candidateprofile') ||
                       showSideNavRoutes.includes(url);
  }
}