import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  templateUrl: './poll-not-found.component.html',
  styleUrls: ['./poll-not-found.component.scss']
})
export class PollNotFoundComponent implements OnInit {

  constructor(private router: Router) { }

  ngOnInit(): void {
  }

  Back() {
    this.router.navigate([""]);
  }

}
