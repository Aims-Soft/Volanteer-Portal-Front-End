// import { Component } from '@angular/core';

// @Component({
//   selector: 'app-login',
//   templateUrl: './login.component.html',
//   styleUrls: ['./login.component.scss']
// })
// export class LoginComponent {

// }


import { HttpClient } from '@angular/common/http';
import { Component, OnInit, AfterViewInit, ViewChild, ElementRef, NgZone } from '@angular/core';
// import { colors } from '../../style/color';
import { SharedDataService } from '../../shared/services/shared-data.service';
import { SharedFormFieldValidationService } from '../../shared/services/shared-form-field-validation.service';
import { SharedGlobalService } from '../../shared/services/shared-global.service';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { SharedAuthService } from '../../shared/services/shared-auth.service';
import { first } from 'rxjs';
import { SideNavSevice } from '../../shared/services/sidenavSevice';

declare const google: any;

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit, AfterViewInit {
  @ViewChild('googleButton', { static: false }) googleButton!: ElementRef;

  // colors = colors;
  email: string = '';
  password: string = '';
  isAdminLogin: boolean = false;
  isLoading = false;

  loginForm: any;
  validate: any[] = [];
  hidePassword: boolean = true;
  error = '';
  menu: any[] = [];

  // Google Sign-In properties
  errorMessage: string = '';
  showError: boolean = false;
  showSuccess: boolean = false;

  constructor(
    private dataService: SharedDataService,
    private valid: SharedFormFieldValidationService,
    private global: SharedGlobalService,
    private router: Router,
    private toastr: ToastrService,
    private authService: SharedAuthService,
    private SideNavSevice: SideNavSevice,
    private ngZone: NgZone,
    private http: HttpClient,
  ) {}

  ngOnInit(): void {
    this.loadGoogleSignInScript();
  }

  ngAfterViewInit(): void {
    console.log('🔧 Sign-In ngAfterViewInit called');
    this.waitForGoogleSDK();
  }

  loadGoogleSignInScript(): void {
    console.log('🔧 Loading Google Sign-In Script...');
    const script = document.createElement('script');
    script.src = 'https://accounts.google.com/gsi/client';
    script.async = true;
    script.defer = true;
    script.onload = () => {
      console.log('✅ Google Sign-In SDK loaded successfully');
    };
    script.onerror = (error) => {
      console.error('❌ Failed to load Google Sign-In SDK:', error);
      this.toastr.error('Failed to load Google Sign-In. Please refresh the page.', 'Error');
    };
    document.head.appendChild(script);
  }

  waitForGoogleSDK(): void {
    console.log('⏳ Waiting for Google SDK to load...');
    const checkGoogle = setInterval(() => {
      if (typeof google !== 'undefined' && google.accounts) {
        clearInterval(checkGoogle);
        console.log('✅ Google SDK is ready');
        this.ngZone.run(() => {
          this.initializeGoogleSignIn();
        });
      } else {
        console.log('⏳ Google SDK not ready yet...');
      }
    }, 100);

    setTimeout(() => {
      clearInterval(checkGoogle);
      if (typeof google === 'undefined') {
        console.error('❌ Google SDK failed to load within timeout');
        this.toastr.error('Google Sign-In failed to load. Please refresh.', 'Error');
      }
    }, 10000);
  }

  initializeGoogleSignIn(): void {
    console.log('🔧 Initializing Google Sign-In...');
    try {
      google.accounts.id.initialize({
        client_id: '51129007656-7853v1j76s30u7cnne2b10nlg9r2ku3l.apps.googleusercontent.com',
        callback: this.handleGoogleSignIn.bind(this),
        auto_select: false,
        cancel_on_tap_outside: true
      });

      if (this.googleButton && this.googleButton.nativeElement) {
        console.log('🎨 Rendering Google button...');
        google.accounts.id.renderButton(
          this.googleButton.nativeElement,
          {
            theme: 'outline',
            size: 'large',
            width: this.googleButton.nativeElement.offsetWidth,
            text: 'signin_with',
            shape: 'rectangular',
            logo_alignment: 'left'
          }
        );
        console.log('✅ Google button rendered successfully');
      } else {
        console.error('❌ Google button element not found');
      }
    } catch (error) {
      console.error('❌ Error initializing Google Sign-In:', error);
      this.toastr.error('Failed to initialize Google Sign-In', 'Error');
    }
  }

  decodeGoogleToken(token: string) {
    console.log('🔑 Decoding Google token...');
    try {
      const base64 = token.split('.')[1].replace(/-/g, '+').replace(/_/g, '/');
      const decoded = JSON.parse(atob(base64));
      console.log('✅ Token decoded successfully');
      return decoded;
    } catch (error) {
      console.error('❌ Error decoding Google token:', error);
      return null;
    }
  }

  togglePassword() {
    this.hidePassword = !this.hidePassword;
  }

  getMenu(roleID: any): void {
    console.log('📋 Getting menu for role:', roleID);
    this.isLoading = true;

    this.SideNavSevice.getMenu(roleID).subscribe({
      next: (response: any[]) => {
        console.log('✅ Menu Response:', response);
        this.isLoading = false;
        this.menu = response;
        this.global.saveMenuSession(response);
        this.authService.triggerMenu();
      },
      error: (error: any) => {
        this.isLoading = false;
        console.error('❌ Error fetching menu:', error);
        this.toastr.error('Failed to load menu', 'Error');
      }
    });
  }

  handleGoogleSignIn(response: any): void {
    console.log('🚀 === Google Sign-In Callback Triggered ===');
    console.log('📋 Raw Google Response Object:', response);

    if (!response.credential) {
      console.error('❌ No credential in Google response');
      this.toastr.error('No credential received from Google', 'Error');
      return;
    }

    const decoded = this.decodeGoogleToken(response.credential);
    
    if (!decoded) {
      console.error('❌ Failed to decode token');
      this.toastr.error('Failed to decode Google token', 'Error');
      return;
    }

    console.log('✅ Decoded Token Details:', decoded);
    console.log('📧 Email:', decoded.email);
    console.log('👤 Name:', decoded.name);

    const googleUser = {
      email: decoded.email,
      name: decoded.name,
      picture: decoded.picture,
      phone: ''
    };

    console.log('📋 Formatted Google User:', googleUser);

    this.ngZone.run(() => {
      this.isLoading = true;

      console.log('📞 Calling completeGoogleSignIn (Save → Login)...');
      this.authService.completeGoogleSignIn(googleUser).subscribe({
        next: (loginResponse: any) => {
          console.log('✅ Complete Google Sign-In Success');
          console.log('📋 Login Response:', loginResponse);
          this.handleLoginSuccess(loginResponse);
        },
        error: (error) => {
          console.error('❌ Complete Google Sign-In Failed', error);
          this.isLoading = false;
          
          let errorMsg = 'Google sign-in failed. Please try again.';
          
          if (error.error?.message) {
            errorMsg = error.error.message;
          } else if (error.message) {
            errorMsg = error.message;
          }
          
          this.toastr.error(errorMsg, 'Google Sign-In Failed');
        }
      });
    });
  }

  handleLoginSuccess(loginResponse: any): void {
    console.log('🎉 Login Success, processing response...');
    this.isLoading = false;

    // Store user data
    localStorage.setItem('currentUser', JSON.stringify(loginResponse));
    
    this.toastr.success('Login successful!', 'Welcome');

    const roleId = loginResponse.roleID || this.global.getRoleId();
    console.log('🎯 User Role ID:', roleId);

    // Load menu based on role
    this.getMenu(roleId);

    // Role-based redirect
    setTimeout(() => {
      if (roleId === 1) {
        this.router.navigate(['/adminDashboard']);
      } else if (roleId === 2) {
        this.router.navigate(['/trainings']);
      } else if (roleId === 3) {
        this.router.navigate(['/adminDashboard']);
      } else {
        this.router.navigate(['/']);
      }
    }, 500);
  }

  onLogin() {
    this.validate = [
      {
        value: this.email,
        msg: 'enter  Email',
        type: 'textBox',
        required: true,
      },
      {
        value: this.password,
        msg: 'Enter password',
        type: 'textBox',
        required: true,
      },
    ];

    if (this.valid.validateToastr(this.validate) === true) {
      this.isLoading = true;
      
      this.authService
        .login(this.email, this.password)
        .pipe(first())
        .subscribe({
          next: (response: any) => {
            this.toastr.success('Login successful!', 'Welcome');

            const roleId = this.global.getRoleId();
            console.log('🎯 User Role ID:', roleId);

            // Load menu based on role
            this.getMenu(roleId);

            // Role-based redirect
            if (roleId === 1) {
              this.router.navigate(['/adminDashboard']);
            } else if (roleId === 2) {
              this.router.navigate(['/trainings']);
            } else if (roleId === 3) {
              this.router.navigate(['/adminDashboard']);
            } else {
              this.router.navigate(['/']);
            }
          },
          error: (error) => {
            this.isLoading = false;
            this.toastr.error('Email or password is invalid', 'Login Failed');
          },
        });
    }
  }
}
