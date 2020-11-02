import { NewVote, UpdateVote } from './../pages/poll/poll.component';
import { environment } from './../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { RoomObject } from '../pages/create/create.component';
import { PollResponse } from '../pages/poll/poll.component';

export interface NewRoomResponse {
  roomId: string;
  creatorId: string;
}

export interface ServerStatusResponse {
  serverMessage: string;
}

@Injectable({
  providedIn: 'root',
})
export class ConnectService {
  serverUrl: string = environment.serverAddress;
  constructor(private http: HttpClient) { }

  newRoom(): Observable<NewRoomResponse> {
    return this.http.post<NewRoomResponse>(this.serverUrl + '/new', {});
  }

  createRoom(data): Observable<NewRoomResponse> {
    return this.http.post<NewRoomResponse>(this.serverUrl + '/create', data);
  }

  getPollData(data: NewRoomResponse): Observable<RoomObject> {
    return this.http.post<RoomObject>(this.serverUrl + '/getPollData', data);
  }

  getPoll(data: string): Observable<PollResponse> {
    return this.http.post<PollResponse>(this.serverUrl + '/getPoll', {
      roomId: data,
    });
  }

  setVote(data: NewVote): Observable<ServerStatusResponse> {
    return this.http.post<ServerStatusResponse>(
      this.serverUrl + '/setVote',
      data
    );
  }

  updateVote(data: UpdateVote): Observable<ServerStatusResponse> {
    return this.http.post<ServerStatusResponse>(
      this.serverUrl + '/updateVote',
      data
    );
  }
}
