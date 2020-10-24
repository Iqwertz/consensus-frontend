import { environment } from './../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';


export interface NewRoomResponse {
  roomId: string;
}

@Injectable({
  providedIn: 'root'
})
export class ConnectService {
  serverUrl: string = environment.serverAddress;
  constructor(private http: HttpClient) { }

  createRoom(): Observable<NewRoomResponse> {
    return this.http.post<NewRoomResponse>(
      this.serverUrl + '/new',
      {}
    );
  }
}
