import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

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

  constructor(private router: Router) { }

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

}
