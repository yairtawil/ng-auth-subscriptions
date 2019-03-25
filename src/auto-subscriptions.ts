export type InputKeys = 'init' | 'destroy';

interface ISubscription {
  unsubscribe();
}

const isSubscription = (subscription: ISubscription) => typeof subscription.unsubscribe === 'function';

interface IObservable {
  subscribe();
}

const isObservable = (observable: IObservable) => typeof observable.subscribe === 'function';

export interface IAutoSubscriptionProps {
  readonly AutoSubscriptionsPropertyKeys: string[];
  AutoSubscriptionsList: ISubscription[];
}

export const initSubscriptions = (instance: IAutoSubscriptionProps): void => {
  instance.AutoSubscriptionsList =
    instance.AutoSubscriptionsPropertyKeys
      .map((key) => instance[key])
      .filter(Boolean)
      .map((value) => typeof value === 'function' ? value() : value)
      .filter(isObservable)
      .map((observable: IObservable) => observable.subscribe());

};

export const removeSubscriptions = (instance: IAutoSubscriptionProps): void => {
  instance.AutoSubscriptionsList
    .filter(isSubscription)
    .forEach((subscription: ISubscription) => subscription.unsubscribe());
  instance.AutoSubscriptionsList = [];
};

const AutoAutoSubscriptionsInit = (originalInit) => {
  return function(...args) {
    if (Array.isArray(this.AutoSubscriptionsPropertyKeys)) {
      initSubscriptions(this);
    }
    if (originalInit) {
      return originalInit.bind(this)(...args);
    }
  };
};

const AutoAutoSubscriptionsDestroy = (originalDestroy) => {
  return function(...args) {
    if (Array.isArray(this.AutoSubscriptionsList)) {
      removeSubscriptions(this);
    }
    if (originalDestroy) {
      return originalDestroy.bind(this)(...args);
    }
  };
};

export type AutoSubscriptionsMetadata<VALUE> = { [KEY in InputKeys]: VALUE };

export type IAutoSubscriptionsProto<VALUE extends string> = new(...args) => { [K in VALUE]: (...args) => any };

export function AutoSubscriptions<VALUE extends 'ngOnInit' | 'ngOnDestroy'>(): (
  constructor: IAutoSubscriptionsProto<VALUE>
) => void | never;

export function AutoSubscriptions<VALUE extends string>(metadata: AutoSubscriptionsMetadata<VALUE>): (
  constructor: IAutoSubscriptionsProto<VALUE>
) => void | never;

export function AutoSubscriptions(metadata = { init: 'ngOnInit', destroy: 'ngOnDestroy' }) {
  return (constructor) => {
    const originalInit = constructor.prototype[metadata.init];
    const originalDestroy = constructor.prototype[metadata.destroy];
    if (!originalInit) {
      throw new Error(`Can\'t find init function with: ${metadata.init}`);
    }
    if (!originalDestroy) {
      throw new Error(`Can't find destroy function with ${metadata.destroy}`);
    }
    constructor.prototype[metadata.init] = AutoAutoSubscriptionsInit(originalInit);
    constructor.prototype[metadata.destroy] = AutoAutoSubscriptionsDestroy(originalDestroy);
  };
}

export function AutoSubscription(target: any, propertyKey: string | symbol) {
  target.AutoSubscriptionsPropertyKeys = [...(target.AutoSubscriptionsPropertyKeys || []), propertyKey];
}
