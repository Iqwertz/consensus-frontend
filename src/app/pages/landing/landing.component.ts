import { SetCreateRoomIds } from './../../store/app.action';
import { ConnectService } from './../../services/connect.service';

import { Component, OnInit, Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Store } from '@ngxs/store';
import { RoomIds } from '../../store/app.state';
import { UAlertService } from '../../services/ualert.service';

@Component({
  templateUrl: './landing.component.html',
  styleUrls: ['./landing.component.scss'],
})
@Injectable({
  providedIn: 'root',
})
export class LandingComponent implements OnInit {
  constructor(
    private store: Store,
    private connectService: ConnectService,
    private router: Router,
    private uAlert: UAlertService
  ) {}

  ngOnInit(): void {}

  createClicked() {
    this.connectService.newRoom().subscribe(
      (res: RoomIds) => {
        this.store.dispatch(new SetCreateRoomIds(res));
        this.router.navigate(['create']);
      },
      (err) => {
        this.uAlert.setAlert('Couldn`t reach server', 'Error');
      }
    );
  }
}
