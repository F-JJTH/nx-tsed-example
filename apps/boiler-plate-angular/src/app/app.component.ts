import { Component } from '@angular/core';
import { OAuthService } from 'angular-oauth2-oidc';

@Component({
  selector: 'kizeo-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  isCollapsed = false;

  constructor(private oauthService: OAuthService) { }

  logout() {
    this.oauthService.logOut()
  }
}
