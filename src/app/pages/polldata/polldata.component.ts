import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { RoomIds } from '../../store/app.state';
import { ConnectService } from '../../services/connect.service';
import { RoomObject } from '../create/create.component';
import { UAlertService } from '../../services/ualert.service';

@Component({
  templateUrl: './polldata.component.html',
  styleUrls: ['./polldata.component.scss'],
})
export class PolldataComponent implements OnInit {
  constructor(
    private Activatedroute: ActivatedRoute,
    private router: Router,
    private connectService: ConnectService,
    private uAlert: UAlertService
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
      (err) => {
        this.uAlert.setAlert(
          'Something went wrong! Please try again!',
          'Error'
        );
      }
    );
  }

  copyStringToClipboard(str: string) {
    //copys string to clipboard by creating a textarea and copying it with document.executeCommand
    const selBox = document.createElement('textarea');
    selBox.style.position = 'fixed';
    selBox.style.left = '0';
    selBox.style.top = '0';
    selBox.style.opacity = '0';
    selBox.value = str;
    document.body.appendChild(selBox);
    selBox.focus();
    selBox.select();
    document.execCommand('copy');
    document.body.removeChild(selBox);
    this.uAlert.setAlert('Successfully copied to clipboard', 'Success');
  }
}
