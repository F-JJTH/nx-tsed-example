import { HTTP_INTERCEPTORS, HttpClient } from '@angular/common/http';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { Injectable } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { OAuthService } from 'angular-oauth2-oidc';

import { JwtInterceptor } from './jwt.interceptor';
import { Router } from '@angular/router';
import { AUTH_CONFIG } from '../auth.token';

@Injectable()
class DataService {
    ROOT_URL = `http://jsonplaceholder.typicode.com`;

    constructor(private http: HttpClient) {
    }

    getPosts() {
        return this.http.get(`${this.ROOT_URL}/posts`);
    }
}

@Injectable()
class MockRouter {
    public routerState = {
        snapshot: {
            url: '/'
        }
    };
}

@Injectable()
class MockOAuthService {
    getAccessToken() {
        return 'myTokenOfTheDead';
    }

    getAccessTokenExpiration() {
        return Date.now() + 500;
    }
}

describe(`JwtInterceptor`, () => {
    let service: DataService;
    let httpMock: HttpTestingController;

    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [HttpClientTestingModule],
            providers: [
                DataService,
                { provide: Router, useClass: MockRouter },
                { provide: AUTH_CONFIG, useValue: {
                    issuer: 'https://mockissuer.com'
                } },
                { provide: OAuthService, useClass: MockOAuthService },
                {
                    provide: HTTP_INTERCEPTORS,
                    useClass: JwtInterceptor,
                    multi: true,
                },
            ],
        });

        service = TestBed.get(DataService);
        httpMock = TestBed.get(HttpTestingController);
    });

    it('should add an Authorization header', () => {
        service.getPosts().subscribe(response => {
            expect(response).toBeTruthy();
        });

        const httpRequest = httpMock.expectOne({method: 'GET', url: `${service.ROOT_URL}/posts`});

        expect(httpRequest.request.headers.has('Authorization')).toEqual(true);
    });
});