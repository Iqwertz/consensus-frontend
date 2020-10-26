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

export type SelectedMode = 'None' | 'Date' | 'Text';

export interface roomlistentry {
  entrydata: string;
  date?: Date;
}

export interface RoomObject {
  titel: string;
  roomId: string;
  creatorId: string;
  creationDate: Date;
  description: string;
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

  constructor(private connectService: ConnectService) {}

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
        description: this.description,
        creationDate: new Date(),
        roomId: this.createRoomIds.roomId,
        creatorId: this.createRoomIds.creatorId,
        data: [],
      };

      if (this.selectedMode == 'Text') {
        newRoom.data = this.optionsList;
      } else {
        newRoom.data = this.formatDates(this.datepicker.selectedDates);
      }

      this.connectService.createRoom(newRoom).subscribe(
        (res) => {},
        (err) => {}
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
      });
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
