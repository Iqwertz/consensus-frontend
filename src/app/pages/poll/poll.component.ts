import { Component, OnInit } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ConnectService } from '../../services/connect.service';
import { UAlertService } from '../../services/ualert.service';
import { roomlistentry } from '../create/create.component';

export interface PollResponse {
  titel: string;
  description: string;
  roomId: string;
  parNames: string[];
  data: roomlistentry[];
}

export interface NewVote {
  roomId: string;
  name: string;
  voteIds: number[];
}

@Component({
  templateUrl: './poll.component.html',
  styleUrls: ['./poll.component.scss'],
})
export class PollComponent implements OnInit {
  pollId: string;
  pollData: PollResponse = {
    data: [],
    description: '',
    parNames: [],
    roomId: '',
    titel: '',
  };
  titel: string = '';
  description: string = '';
  name: string = '';
  pollSelect = [];

  nameFormControl = new FormControl('', [Validators.required]);

  constructor(
    private Activatedroute: ActivatedRoute,
    private router: Router,
    private connectService: ConnectService,
    private uAlert: UAlertService
  ) {}

  ngOnInit(): void {
    this.pollId = this.Activatedroute.snapshot.queryParamMap.get('rId') || '0';

    this.connectService.getPoll(this.pollId).subscribe(
      (res) => {
        this.pollData = res;
        this.titel = this.pollData.titel;
        this.description = this.pollData.description;
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

    this.name = localStorage.getItem('name');
  }

  sendPoll() {
    console.log(this.pollData.parNames);
    if (this.name.length > 0) {
      if (
        !this.pollData.parNames
          .map((name) => name.toLowerCase())
          .includes(this.name.toLowerCase())
      ) {
        let votes: number[] = [];
        for (let entry of this.pollSelect) {
          votes.push(entry.id);
        }

        let vote: NewVote = {
          name: this.name,
          roomId: this.pollData.roomId,
          voteIds: votes,
        };

        localStorage.setItem('name', this.name);

        this.connectService.setVote(vote).subscribe(
          (res) => {
            if (res.serverMessage == '200') {
              this.router.navigate(['']);
            } else {
              this.uAlert.setAlert(
                'Something went wrong! Please try again!',
                'Error'
              );
            }
          },
          (err) => {
            this.uAlert.setAlert(
              'Something went wrong! Please try again!',
              'Error'
            );
          }
        );
      } else {
        this.uAlert.setAlert('This Name already exists!', 'Warning');
      }
    } else {
      this.uAlert.setAlert('Please enter a Name', 'Error');
    }
  }
}
