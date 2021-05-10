import { Component, OnInit } from '@angular/core';
import { ProfileService } from '@kizeo/auth';
import { OAuthService } from 'angular-oauth2-oidc';

@Component({
  selector: 'app-welcome',
  templateUrl: './welcome.component.html',
  styleUrls: ['./welcome.component.scss']
})
export class WelcomeComponent implements OnInit {

  constructor(
    private oauthService: OAuthService
  ) { }

  ngOnInit() {
    console.log(this.oauthService.getIdentityClaims())
    console.log(this.oauthService.scope)
  }

}
