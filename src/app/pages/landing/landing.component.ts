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
    private connectService: ConnectService,
    private router: Router,
  ) { }

  ngOnInit(): void {
  }

  createClicked() {
    this.connectService.createRoom().subscribe(
      (res) => {
        //this.store.dispatch(new SetCreateRoomId(res.roomId));
        console.log(res);
      },
      (err) => {
        alert(`Couldn't reach server`);
      }
    );
  }

}
