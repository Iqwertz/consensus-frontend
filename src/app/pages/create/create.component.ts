import { CreatedPolls } from './../../Components/sidenav/sidenav.component';
import {
  Component,
  ViewEncapsulation,
  OnInit,
  ViewChild,
  ElementRef,
} from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { Select, Store } from '@ngxs/store';
import Datepickk from 'datepickk';
import { AppState, RoomIds } from '../../store/app.state';
import { ConnectService } from '../../services/connect.service';
import { Router } from '@angular/router';
import { UAlertService } from '../../services/ualert.service';
import { SetCreateRoomIds } from '../../store/app.action';
import { CreatedPollsStorage } from 'src/app/Components/sidenav/sidenav.component';

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
  editUrl: string;
  roomId: string;
  creatorId: string;
  creationDate: Date;
  description: string;
  parNames: string[];
  data: roomlistentry[];
  votesVisible: boolean;
  email?: string;
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
  email: string;

  votesVisible: boolean = false;

  optionsList: roomlistentry[] = [{ entrydata: '' }];

  titelFormControl = new FormControl('', [Validators.required]);
  emailFormControl = new FormControl('', [
    Validators.email,
  ]);

  selectedMode: SelectedMode = 'Date';

  @Select(AppState.createRoomIds)
  createRoomIds$;

  createRoomIds: RoomIds;

  constructor(
    private connectService: ConnectService,
    private router: Router,
    private uAlert: UAlertService,
    private store: Store
  ) { }

  ngOnInit(): void {
    this.createRoomIds$.subscribe((createRoomIds: RoomIds) => {
      this.createRoomIds = createRoomIds;
    });
    if (this.createRoomIds.creatorId == '' || this.createRoomIds.roomId == '') {
      //this.router.navigate(['']);
    }
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
    let validEmail: string;
    if (this.emailFormControl.hasError('email')) {
      validEmail = "";
    } else {
      validEmail = this.email;
    }
    if (this.titel !== undefined && this.selectedMode != 'None') {
      let newRoom: RoomObject = {
        titel: this.titel,
        url: window.location.origin + '/poll?rId=' + this.createRoomIds.roomId,
        editUrl: window.location.origin + '/polldata?rId=' + this.createRoomIds.roomId + '&cId=' + this.createRoomIds.creatorId,
        description: this.description || '',
        creationDate: new Date(),
        roomId: this.createRoomIds.roomId,
        creatorId: this.createRoomIds.creatorId,
        parNames: [],
        data: [],
        votesVisible: this.votesVisible,
        email: validEmail,
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
          this.store.dispatch(
            new SetCreateRoomIds({ roomId: '', creatorId: '' })
          );

          let cPolls: CreatedPollsStorage;
          cPolls = JSON.parse(localStorage.getItem("createdPolls"));
          console.log(cPolls);
          if (cPolls == null) {
            cPolls = {
              data: [],
            }
          }
          let cPollEntry: CreatedPolls = {
            cId: res.creatorId,
            rId: res.roomId,
            creationDate: new Date(),
            titel: this.titel,
          }
          cPolls.data.unshift(cPollEntry);
          localStorage.setItem("createdPolls", JSON.stringify(cPolls));
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
    } else {
      this.uAlert.setAlert("Please enter a Titel", "Warning")
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
