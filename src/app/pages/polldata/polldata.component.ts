import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { RoomIds } from '../../store/app.state';
import { ConnectService } from '../../services/connect.service';

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

  ngOnInit(): void {
    this.pollIds.roomId =
      this.Activatedroute.snapshot.queryParamMap.get('rId') || '0';
    this.pollIds.creatorId =
      this.Activatedroute.snapshot.queryParamMap.get('cId') || '0';

    this.connectService.getPollData(this.pollIds).subscribe(
      (res) => {
        console.log(res);
      },
      (err) => {}
    );
  }

  ngAfter;
}
