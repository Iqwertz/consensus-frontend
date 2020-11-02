import { SetCreateRoomIds } from './../../store/app.action';
import { RoomIds } from './../../store/app.state';
import { UAlertService } from './../../services/ualert.service';
import { ConnectService } from './../../services/connect.service';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Store } from '@ngxs/store';

export interface CreatedPollsStorage {
  data: CreatedPolls[];
}

export interface CreatedPolls {
  creationDate: Date;
  cId: string;
  rId: string;
  titel: string;
}

@Component({
  selector: 'app-sidenav',
  templateUrl: './sidenav.component.html',
  styleUrls: ['./sidenav.component.scss']
})
export class SidenavComponent implements OnInit {

  PollsList: CreatedPollsStorage = {
    data: [],
  };

  constructor(private store: Store,
    private connectService: ConnectService,
    private router: Router,
    private uAlert: UAlertService) { }

  ngOnInit(): void {
    this.PollsList = JSON.parse(localStorage.getItem("createdPolls"));
    if (this.PollsList == null) {
      this.PollsList = {
        data: [],
      }
    }
  }

  routeTo(rId: string, cId: string) {
    this.router.navigate(['/polldata'], {
      queryParams: { rId: rId, cId: cId },
    });
  }

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
