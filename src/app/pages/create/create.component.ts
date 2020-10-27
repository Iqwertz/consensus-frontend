import {
  Component,
  ViewEncapsulation,
  OnInit,
  ViewChild,
  ElementRef,
} from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { Select } from '@ngxs/store';
import Datepickk from 'datepickk';
import { AppState, RoomIds } from '../../store/app.state';
import { ConnectService } from '../../services/connect.service';
import { Router } from '@angular/router';
import { UAlertService } from '../../services/ualert.service';

export type SelectedMode = 'None' | 'Date' | 'Text';

export interface roomlistentry {
  entrydata: string;
  date?: Date;
  votes?: string[];
  id?: number;
}

export interface RoomObject {
  titel: string;
  url: string;
  roomId: string;
  creatorId: string;
  creationDate: Date;
  description: string;
  parNames: string[];
  data: roomlistentry[];
}

@Component({
  templateUrl: './create.component.html',
  styleUrls: ['./create.component.scss', './datepickk.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class CreateComponent implements OnInit {
  @ViewChild('datePickerContainer') datePickerElement: ElementRef;
  now = new Date();
  datepicker;
  titel: string;
  description: string;

  optionsList: roomlistentry[] = [{ entrydata: '' }];

  titelFormControl = new FormControl('', [Validators.required]);

  selectedMode: SelectedMode = 'Date';

  @Select(AppState.createRoomIds)
  createRoomIds$;

  createRoomIds: RoomIds;

  constructor(
    private connectService: ConnectService,
    private router: Router,
    private uAlert: UAlertService
  ) {}

  ngOnInit(): void {
    this.createRoomIds$.subscribe((createRoomIds: RoomIds) => {
      this.createRoomIds = createRoomIds;
    });
  }

  ngAfterViewInit() {
    this.datepicker = new Datepickk({
      container: this.datePickerElement.nativeElement,
      inline: true,
      tooltips: {
        date: new Date(),
        text: 'Tooltip',
      },
    });
  }

  addOption() {
    this.optionsList.push({ entrydata: '' });
  }

  removeOption(i: number) {
    console.log(this.optionsList);
    this.optionsList.splice(i, 1);
    console.log(i);
  }

  createPoll() {
    if (this.titel !== undefined && this.selectedMode != 'None') {
      let newRoom: RoomObject = {
        titel: this.titel,
        url: window.location.origin + '/poll?rId=' + this.createRoomIds.roomId,
        description: this.description || '',
        creationDate: new Date(),
        roomId: this.createRoomIds.roomId,
        creatorId: this.createRoomIds.creatorId,
        parNames: [],
        data: [],
      };

      console.log(newRoom.url);

      if (this.selectedMode == 'Text') {
        let i = 0;
        for (let entry of this.optionsList) {
          newRoom.data.push({
            votes: [],
            entrydata: entry.entrydata,
            id: i,
          });
          i++;
        }
      } else {
        newRoom.data = this.formatDates(this.datepicker.selectedDates);
      }

      this.connectService.createRoom(newRoom).subscribe(
        (res) => {
          this.router.navigate(['/polldata'], {
            queryParams: { rId: res.roomId, cId: res.creatorId },
          });
        },
        (err) => {
          this.uAlert.setAlert(
            'Something went wrong! Please try again!',
            'Error'
          );
        }
      );
    }
  }

  formatDates(dates: Date[]): roomlistentry[] {
    const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    const months = [
      'Jan',
      'Feb',
      'Mar',
      'Apr',
      'May',
      'Jun',
      'Jul',
      'Aug',
      'Sep',
      'Oct',
      'Nov',
      'Dec',
    ];

    let formattedDates: roomlistentry[] = [];
    let i = 0;
    for (let date of dates) {
      let stringDate =
        days[date.getDay()] +
        ',´' +
        date.getDate() +
        ' ' +
        months[date.getMonth()];
      formattedDates.push({
        entrydata: stringDate,
        date: date,
        votes: [],
        id: i,
      });
      i++;
    }
    return formattedDates;
  }
}

//data structure of a new room
/*{
  titel: string
  roomId: string;
  creatorId: string;
  creationDate: Date;
  data: roomlistentry[];
}

roomlistentry{
  entrydata: string

}
*/
