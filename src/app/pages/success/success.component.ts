import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  templateUrl: './success.component.html',
  styleUrls: ['./success.component.scss']
})
export class SuccessComponent implements OnInit {

  constructor(private router: Router) { }

  ngOnInit(): void {
  }

  BackToPoll() {
    window.location.href = localStorage.getItem("lastVotedPoll");
  }

  BackToStart() {
    this.router.navigate([""]);
  }
}
