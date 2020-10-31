import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { RoomIds } from '../../store/app.state';
import { ConnectService } from '../../services/connect.service';
import { RoomObject } from '../create/create.component';
import { UAlertService } from '../../services/ualert.service';
import { MatTableDataSource } from '@angular/material/table';
import { MatSort } from '@angular/material/sort';
import {
  animate,
  state,
  style,
  transition,
  trigger,
} from '@angular/animations';

export interface ResultsDataTable {
  id: number;
  option: string;
  votes: number;
  persons: string[];
}

@Component({
  templateUrl: './polldata.component.html',
  styleUrls: ['./polldata.component.scss'],
  animations: [
    trigger('detailExpand', [
      state('collapsed', style({ height: '0px', minHeight: '0' })),
      state('expanded', style({ height: '*' })),
      transition(
        'expanded <=> collapsed',
        animate('225ms cubic-bezier(0.4, 0.0, 0.2, 1)')
      ),
    ]),
  ],
})
export class PolldataComponent implements OnInit, AfterViewInit {
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

  tableData: ResultsDataTable[] = [
    {
      id: 0,
      option: 'a',
      votes: 1,
      persons: [],
    },
  ];
  displayedColumns: string[] = ['id', 'option', 'votes'];
  dataSource = new MatTableDataSource(this.tableData);

  titel: string = '';
  description: string = '';
  pollData: RoomObject;

  expandedElement: ResultsDataTable | null;

  @ViewChild(MatSort, { static: false }) sort: MatSort;

  ngOnInit(): void {
    this.pollIds.roomId =
      this.Activatedroute.snapshot.queryParamMap.get('rId') || '0';
    this.pollIds.creatorId =
      this.Activatedroute.snapshot.queryParamMap.get('cId') || '0';

    if (this.pollIds.roomId == '0' || this.pollIds.creatorId == '0') {
      this.router.navigate(['']);
    } else {
      this.connectService.getPollData(this.pollIds).subscribe(
        (res) => {
          this.pollData = res;
          this.titel = this.pollData.titel;
          this.description = this.pollData.description;

          this.tableData = [];
          for (let entry of this.pollData.data) {
            let tdata: ResultsDataTable = {
              option: entry.entrydata,
              votes: entry.votes.length,
              persons: entry.votes,
              id: entry.id,
            };

            this.tableData.push(tdata);
          }
          console.log(this.tableData);
          this.dataSource = new MatTableDataSource(this.tableData);
          this.dataSource.sort = this.sort;
        },
        (err) => {
          if (err.error.message == 'PollIdNotFound') {
            this.router.navigate(['notfound']);
          } else {
            this.uAlert.setAlert(
              'Sorry there is currently a Server Error!',
              'Error'
            );
          }
        }
      );
    }
  }

  ngAfterViewInit() {
    this.dataSource.sort = this.sort;
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
