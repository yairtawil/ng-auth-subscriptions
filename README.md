[![NPM](https://nodei.co/npm/auto-subscriptions.png?downloads=true&downloadRank=true&stars=true)](https://www.npmjs.com/package/auto-subscriptions/)

**[Demo](https://yairtawil.github.io/auto-subscriptions/)**

# Auto-Subscriptions

Typescript library for manage automagically subscribe / Unsubscribe

of observables properties on classes.

## Installation

```shell
npm install auto-subscriptions
```

## Usage

Add `@AutoSubscriptions` to your class and `@AutoSubscription` to your Observables: 

```typescript
import { AutoSubscriptions } from 'auto-subscriptions';

@AutoSubscriptions({
  init: 'init',
  destroy: 'destroy'
})
export class MyClass {
 @AutoSubscription
  myObs$ = of(true);

  @AutoSubscription
  myObsD$ = of(false);
  
  init() {
  }
  destroy() {
  }
}
```
`init` is where the automatic `subsribe()` code will happen,

`destroy` is where the automatic `unsubsribe()` code will happen,

For example:

```typescript
  const myClass = new MyClass();
  myClass.init() /* automatic `subsribe()` code will happen */
  myClass.destroy() /* automatic `unsubsribe()` code will happen */
  
```
