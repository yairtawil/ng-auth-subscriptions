import { Component, OnDestroy, OnInit } from '@angular/core';
import { fromEvent } from 'rxjs/index';
import { AutoSubscription, AutoSubscriptions } from 'auto-subscriptions/auto-subscriptions';
import { filter, tap } from 'rxjs/internal/operators';

@Component({
  selector: 'app-events',
  templateUrl: './events.component.html',
  styleUrls: ['./events.component.css']
})
@AutoSubscriptions({
  init: EventsComponent.prototype.ngOnInit,
  destroy: EventsComponent.prototype.ngOnDestroy
})
export class EventsComponent implements OnInit, OnDestroy {
  counts = { click: 0, space: 0, mousemove: 0, mousewheel: 0 };

  @AutoSubscription
  onClick$ = fromEvent(window, 'click')
    .pipe(
      tap(($event: MouseEvent) => this.counts.click = this.counts.click + 1)
    );

  @AutoSubscription
  space$ = fromEvent(window, 'keypress')
    .pipe(
      filter(($event: KeyboardEvent) => $event.code === 'Space'),
      tap(($event: MouseEvent) => this.counts.space = this.counts.space + 1)
    );


  @AutoSubscription
  mousemove$ = fromEvent(window, 'mousemove')
    .pipe(
      tap(($event: MouseEvent) => this.counts.mousemove = this.counts.mousemove + 1)
    );


  @AutoSubscription
  mousewheel$ = fromEvent(window, 'mousewheel')
    .pipe(
      tap(($event: MouseEvent) => this.counts.mousewheel = this.counts.mousewheel + 1)
    );

  constructor() { }

  ngOnInit() {
  }

  ngOnDestroy() {
  }


}
