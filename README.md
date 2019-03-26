# Auto Subscriptions

[![NPM](https://nodei.co/npm/auto-subscriptions.png?downloads=true&downloadRank=true&stars=true)](https://www.npmjs.com/package/auto-subscriptions/)

**[Demo](https://yairtawil.github.io/auto-subscriptions/)**

Typescript library for automagically handling `subscribe()` / `unsubscribe()` of Observable properties of classes.

### Installation
##### Install with `npm`
```shell
npm install auto-subscriptions
```
##### Install with `yarn`
```shell
yarn add auto-subscriptions
```

### Usage

Add `@AutoSubscriptions` to the class and `@AutoSubscription` to the class observable properties, for which you want automatic subscription handling:

##### Base class:
```typescript
import { AutoSubscriptions } from 'auto-subscriptions';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';

@AutoSubscriptions({
  init: 'init',
  destroy: 'destroy'
})
export class MyClass {
  boolValue: boolean;
  numValue: number;
  
  @AutoSubscription
  boolValue$: Observable<boolean> = of(true).pipe(
    tap((boolValue: boolean) => this.boolValue = boolValue)
  );

  @AutoSubscription
  numValue$: Observable<number> = of(100).pipe(
    tap((numValue: boolean) => this.numValue = numValue)
  );
  
  init() {
  }
  destroy() {
  }
}
```
 when `init` is called `subscribe()` will be invoked for all `@AutoSubscription` observable properies,

when `destroy` is called `unsubscribe()` will be invoked for all `@AutoSubscription` observable properies,

##### For example:

```typescript
  const myClass = new MyClass();
  myClass.init() /* subscribe() is invoked for all @AutoSubscription observable properies, */
  
  // code ...
  
  myClass.destroy() /* unsubscribe() is invoked for all @AutoSubscription observable properies */
  
```

##### Angular component (defaults are `ngOnInit` and `ngOnDestroy`):

```typescript
import { Component, OnDestroy, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { AutoSubscriptions, AutoSubscription } from 'auto-subscriptions';
import { Observable, of } from 'rxjs';
import { tap } from 'rxjs/operators';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.less']
})
@AutoSubscriptions()
export class AppComponent implements OnInit, OnDestroy {
  httpResult: object;
  
  @AutoSubscription
  httpResult$: Observable<Object> = this.http.get('HTTP_URL').pipe(
    tap((httpResult: object) => this.httpResult = httpResult)
  );
  
  constructor(protected http: HttpClient) {
  }
  
  ngOnInit() {
  }

  ngOnDestroy() {
  }
}

```

