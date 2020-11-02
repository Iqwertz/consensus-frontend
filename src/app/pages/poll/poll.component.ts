import { isGeneratedFile } from '@angular/compiler/src/aot/util';
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
  votesVisible: boolean;
}

export interface NewVote {
  roomId: string;
  name: string;
  voteIds: number[];
}

export interface UpdateVote {
  roomId: string;
  oldName: string;
  name: string;
  voteIds: number[];
}

export interface VotedPollsStorage {
  data: VotedPoll[];
}

export interface VotedPoll {
  roomId: string;
  name: string;
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
    votesVisible: false,
  };
  titel: string = '';
  description: string = '';
  name: string = '';
  pollSelect = [];

  alreadyVoted: boolean = false;

  nameFormControl = new FormControl('', [Validators.required]);

  constructor(
    private Activatedroute: ActivatedRoute,
    private router: Router,
    private connectService: ConnectService,
    private uAlert: UAlertService
  ) { }

  ngOnInit(): void {
    this.pollId = this.Activatedroute.snapshot.queryParamMap.get('rId') || '0';
    if (this.pollId == '0') {
      this.router.navigate(['']);
    } else {
      this.connectService.getPoll(this.pollId).subscribe(
        (res) => {
          this.pollData = res;
          this.titel = this.pollData.titel;
          this.description = this.pollData.description;

          let votedStorage: VotedPollsStorage = JSON.parse(localStorage.getItem("votedPolls"));
          if (votedStorage == null) {
            votedStorage = {
              data: [],
            }
          }

          for (let entry of votedStorage.data) {
            if (entry.roomId == this.pollData.roomId) {
              this.alreadyVoted = true;
            }
          }
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
      if (this.name == undefined) {
        this.name = '';
      }
    }
  }

  sendPoll() {
    console.log(this.pollData.parNames);
    if (this.name.length > 0) {
      let votedStorage: VotedPollsStorage = JSON.parse(localStorage.getItem("votedPolls"));
      if (votedStorage == null) {
        votedStorage = {
          data: [],
        }
      }

      let newVote: boolean = true;
      let oldName: string = "";

      for (let entry of votedStorage.data) {
        if (entry.roomId == this.pollData.roomId) {
          newVote = false;
          oldName = entry.name;
        }
      }

      let pNames: string[] = [];
      if (!newVote) {
        pNames = this.pollData.parNames.filter(e => e !== oldName); // will return ['A', 'C']
      } else {
        pNames = this.pollData.parNames;
      }

      if (!pNames.map((name) => name.toLowerCase()).includes(this.name.toLowerCase())) {
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

        if (newVote) {
          this.connectService.setVote(vote).subscribe(
            (res) => {
              if (res.serverMessage == '200') {
                let newVotedEntry: VotedPoll = {
                  name: this.name,
                  roomId: this.pollData.roomId,
                }

                votedStorage.data.push(newVotedEntry);
                localStorage.setItem("votedPolls", JSON.stringify(votedStorage));

                localStorage.setItem("lastVotedPoll", window.location.toString());
                this.router.navigate(['success']);
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
          let updateVote: UpdateVote = {
            name: vote.name,
            oldName: oldName,
            roomId: vote.roomId,
            voteIds: vote.voteIds,
          }

          this.connectService.updateVote(updateVote).subscribe(
            (res) => {
              if (res.serverMessage == '200') {
                let newVotedEntry: VotedPoll = {
                  name: this.name,
                  roomId: this.pollData.roomId,
                }

                votedStorage.data.push(newVotedEntry);
                localStorage.setItem("votedPolls", JSON.stringify(votedStorage));

                localStorage.setItem("lastVotedPoll", window.location.toString());
                this.router.navigate(['success']);
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
        }
      } else {
        this.uAlert.setAlert('This Name already exists!', 'Warning');
      }
    } else {
      this.uAlert.setAlert('Please enter a Name', 'Error');
    }
  }

  calcVotes(e: roomlistentry): number {
    let votes: number = 0;
    votes = e.votes.length;
    if (this.pollSelect.includes(e)) {
      votes++;
    }

    return votes;
  }
}
