import { SetCreateRoomId } from './../../store/app.action';
import { ConnectService } from './../../services/connect.service';

import { Component, OnInit, Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Store } from '@ngxs/store';

@Component({
  templateUrl: './landing.component.html',
  styleUrls: ['./landing.component.scss']
})

@Injectable({
  providedIn: 'root'
})
export class LandingComponent implements OnInit {

  constructor(
    private store: Store,
    private connectService: ConnectService,
    private router: Router,
  ) { }

  ngOnInit(): void {
  }

  createClicked() {
    this.connectService.createRoom().subscribe(
      (res) => {
        this.store.dispatch(new SetCreateRoomId(res.roomId));
        this.router.navigate(['create']);
      },
      (err) => {
        alert(`Couldn't reach server`);
      }
    );
  }

}
