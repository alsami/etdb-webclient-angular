import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { IdentityToken, IdentityUser, RegisterUser, UserSignIn, AuthenticationProvider } from '@etdb/core/models';
import { environment } from 'environments/environment';
import { Observable } from 'rxjs';
import { BASE_HEADERS } from '@etdb/core/core.constants';

@Injectable()
export class AuthService {
    private basicAuthHeaders: HttpHeaders = new HttpHeaders()
        .set('Authorization', 'Basic d2ViLmNsaWVudDpnaXg4ZXhrbmY5c3h2bmh2dmtyZ3R6bTVlYjdvNHU3bWtwbW5xODZtbzkwd2plNDlxdQ==')
        .set('Accept', 'application/json')
        .set('cache-control', 'no-cache');

    public constructor(private http: HttpClient) { }

    public signInWithProvider(provider: AuthenticationProvider, token: string): Observable<IdentityToken> {
        const formData = new FormData();

        formData.append('grant_type', 'external');
        formData.append('provider', provider);
        formData.append('token', token);
        formData.append('scope', 'UserService FileService IndexService StorageService openid offline_access');

        return this.http.post<IdentityToken>(environment.userserviceAuthUrl, formData, {
            headers: this.basicAuthHeaders
        });
    }

    public signInWithCredentials(signIn: UserSignIn): Observable<IdentityToken> {
        const formData = new FormData();

        formData.append('grant_type', 'password');
        formData.append('username', signIn.userName);
        formData.append('password', signIn.password);
        formData.append('scope', 'UserService FileService IndexService StorageService openid offline_access');

        return this.http.post<IdentityToken>(environment.userserviceAuthUrl, formData, {
            headers: this.basicAuthHeaders
        });
    }

    public signInWithRefreshToken(token: IdentityToken): Observable<IdentityToken> {
        const formData = new FormData();

        formData.append('grant_type', 'refresh_token');
        formData.append('refresh_token', token.refresh_token);

        return this.http.post<IdentityToken>(environment.userserviceAuthUrl, formData, {
            headers: this.basicAuthHeaders
        });
    }

    public loadIdentityUser(): Observable<IdentityUser> {
        const headers = BASE_HEADERS;

        return this.http.get<IdentityUser>(environment.userserviceAuthProfileUrl, {
            headers: headers
        });
    }

    public register(registerUser: RegisterUser): Observable<any> {
        const headers = BASE_HEADERS;
        return this.http.post(environment.userserviceUrl + 'auth/registration',
            JSON.stringify(registerUser), {
                headers: headers
            });
    }
}
