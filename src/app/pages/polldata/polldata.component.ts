import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { RoomIds } from '../../store/app.state';
import { ConnectService } from '../../services/connect.service';
import { RoomObject } from '../create/create.component';

@Component({
  templateUrl: './polldata.component.html',
  styleUrls: ['./polldata.component.scss'],
})
export class PolldataComponent implements OnInit {
  constructor(
    private Activatedroute: ActivatedRoute,
    private router: Router,
    private connectService: ConnectService
  ) {}
  pollIds: RoomIds = {
    roomId: '',
    creatorId: '',
  };

  titel: string = '';
  description: string = '';
  pollData: RoomObject;

  ngOnInit(): void {
    this.pollIds.roomId =
      this.Activatedroute.snapshot.queryParamMap.get('rId') || '0';
    this.pollIds.creatorId =
      this.Activatedroute.snapshot.queryParamMap.get('cId') || '0';

    this.connectService.getPollData(this.pollIds).subscribe(
      (res) => {
        this.pollData = res;
        this.titel = this.pollData.titel;
        this.description = this.pollData.description;
      },
      (err) => {}
    );
  }
}
