import {inject, Injectable} from "@angular/core";
import {environment} from "../../environments/environment";
import {HttpClient, HttpHeaders} from "@angular/common/http";
import {Observable} from "rxjs";

interface Response {
  access_token: string
}

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  http = inject(HttpClient);

  private authUrl = '/identity/realms/:realm/protocol/openid-connect/token';


  getToken(): void {
    const url = this.authUrl.replace(':realm', 'fintatech');

    const body = new URLSearchParams();
    body.set('grant_type', 'password');
    body.set('client_id', 'app-cli');
    body.set('username', environment.USERNAME);
    body.set('password', environment.PASSWORD);

    const headers = new HttpHeaders({
      'Content-Type': 'application/x-www-form-urlencoded',
    });

    this.http.post(url, body.toString(), {headers, withCredentials: true}).subscribe((result) => {
      const accessToken = (result as Response).access_token;
      console.log(accessToken);
      localStorage.setItem('token', accessToken);
    })
  }
}
