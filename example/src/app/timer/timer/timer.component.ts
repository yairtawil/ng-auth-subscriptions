import { Component, OnInit } from '@angular/core';
import { TimerService } from '../services/timer.service';

@Component({
  selector: 'app-timer',
  templateUrl: './timer.component.html',
  styleUrls: ['./timer.component.css']
})
export class TimerComponent implements OnInit {

  displayedColumns: string[] = ['date', 'time'];

  constructor(public timer: TimerService) {
  }

  ngOnInit() {
  }

}
