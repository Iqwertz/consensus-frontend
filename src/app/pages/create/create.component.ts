import { Component, ViewEncapsulation, OnInit } from '@angular/core';

export type SelectedMode = 'None' | 'Date' | 'Text';

@Component({
  templateUrl: './create.component.html',
  styleUrls: ['./create.component.scss'],
})
export class CreateComponent implements OnInit {
  selectedMode: SelectedMode = 'Date';
  constructor() {}

  ngOnInit(): void {}

  daysSelected: any[] = [];
  event: any;

  isSelected = (event: any) => {
    const date =
      event.getFullYear() +
      '-' +
      ('00' + (event.getMonth() + 1)).slice(-2) +
      '-' +
      ('00' + event.getDate()).slice(-2);
    return this.daysSelected.find((x) => x == date) ? 'selected' : null;
  };

  select(event: any, calendar: any) {
    const date =
      event.getFullYear() +
      '-' +
      ('00' + (event.getMonth() + 1)).slice(-2) +
      '-' +
      ('00' + event.getDate()).slice(-2);
    const index = this.daysSelected.findIndex((x) => x == date);
    if (index < 0) this.daysSelected.push(date);
    else this.daysSelected.splice(index, 1);

    calendar.updateTodaysDate();
  }
}

//data structure of a new room
/*{
  titel: string
  roomId: string;
  data: roomlistentry[];
}

roomlistentry{
  entrydata: string

}
*/
