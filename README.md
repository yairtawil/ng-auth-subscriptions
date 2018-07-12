[![NPM](https://nodei.co/npm/auto-subscriptions.png?downloads=true&downloadRank=true&stars=true)](https://www.npmjs.com/package/auto-subscriptions/)

**[Demo](https://yairtawil.github.io/auto-subscriptions/)**

# Auto Subscriptions

Typescript library for automagically handling `subscribe()` / `unsubscribe()` of Observable properties of classes.

## Installation

```shell
npm install auto-subscriptions
```

## Usage

Add `@AutoSubscriptions` to the class and `@AutoSubscription` to the class observable properties, for which you want automatic subscription handling:

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
 when `init` is called `subscribe()` will be invoked for all `@AutoSubscription` observable properies,

when `destroy` is called `unsubscribe()` will be invoked for all `@AutoSubscription` observable properies,

For example:

```typescript
  const myClass = new MyClass();
  myClass.init() /* subscribe() is invoked for all @AutoSubscription observable properies, */
  
  // code ...
  
  myClass.destroy() /* unsubscribe() is invoked for all @AutoSubscription observable properies */
  
```
