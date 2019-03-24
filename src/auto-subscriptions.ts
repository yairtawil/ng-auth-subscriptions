export type InputKeys = 'init' | 'destroy';

interface Subscription {
    unsubscribe();
}

const isSubscription = (subscription: Subscription)  => typeof subscription.unsubscribe === 'function';

interface Observable {
    subscribe();
}

const isObservable = (observable: Observable)  => typeof observable.subscribe === 'function';

export interface AutoSubscriptionProps {
    readonly _subscriptionsPropertyKeys_: string[];
    _subscriptionsList_: Subscription[];
}

export const initSubscriptions = (instance: AutoSubscriptionProps): void => {
    instance._subscriptionsList_ =
        instance._subscriptionsPropertyKeys_
            .map((key) => instance[key])
            .filter(Boolean)
            .map((value) => typeof value === 'function' ? value() : value)
            .filter(isObservable)
            .map((observable: Observable) => observable.subscribe());

};

export const removeSubscriptions = (instance: AutoSubscriptionProps): void => {
    instance._subscriptionsList_
        .filter(isSubscription)
        .forEach((subscription: Subscription) => subscription.unsubscribe());
    instance._subscriptionsList_ = [];
};

const AutoAutoSubscriptionsInit = (originalInit) => {
    return function (...args) {
        if (Array.isArray(this._subscriptionsPropertyKeys_)) {
            initSubscriptions(this);
        }
        if (originalInit) {
            return originalInit.bind(this)(...args);
        }
    };
};

const AutoAutoSubscriptionsDestory = (originalDestroy) => {
    return function (...args) {
        if (Array.isArray(this._subscriptionsList_)) {
            removeSubscriptions(this)
        }
        if (originalDestroy) {
            return originalDestroy.bind(this)(...args);
        }
    };
};

export function AutoSubscriptions <VALUE extends string>(metadata: { [KEY in InputKeys]: VALUE }) {
    return function
        <PROTO extends { new(...args): { [K in VALUE]: (...args) => any} }>
        (constructor: PROTO): void | never {
        const originalInit = constructor.prototype[metadata.init];
        const originalDestroy = constructor.prototype[metadata.destroy];
        if (!originalInit) {
            throw new Error(`Can\'t find init function with: ${metadata.init}`);
        }
        if (!originalDestroy) {
            throw new Error(`Can't find destroy function with ${metadata.destroy}`);
        }
        constructor.prototype[metadata.init] = AutoAutoSubscriptionsInit(originalInit);
        constructor.prototype[metadata.destroy] = AutoAutoSubscriptionsDestory(originalDestroy)
    };
}

export function AutoSubscription(target: any, propertyKey: string | symbol) {
    target._subscriptionsPropertyKeys_ = [...(target._subscriptionsPropertyKeys_ || []), propertyKey];
}
// const a = { a: 'b', ccc() {} }
// const b: keyof typeof a = 'ccc';
//
// type ProtoOf<T> = Pick<T, keyof T>;
// type ValueOf<T> = T[keyof T];
//
// // ProtoOf<T> & {[P in INIT]: (...args: {}[]) => any}
//
// export function FFF<INIT extends string, META extends { init: INIT }>(metadata: META) {
//     return function
//     <
//         T extends Base & {[P in CK]: G},
//         T extends string & T extends ValueOf<typeof metadata>,
//         C extends {
//             [k in ValueOf<typeof metadata>]: void;
//         },
//         G extends { new(...args): C}
//     >
//     (controctor: G) {
//     }
// }
//
// FFF({ init: 'nginit' })(class Y {
//     ngOnInit() {
//
//     }
//     ngOnDestroy() {
//
//     }
// } );
//
// // class Yaya {
// //     init = 'nginit'
// //     nginit() {
// //
// //     }
// // }
//
//
// abstract class Base {
//     base() { return 1; };
// }
//
// // type ProtoOf<T> = Pick<T, keyof T>;
//
// function decorate<CK extends string>(property: CK) {
//
//     return <
//         T extends Base & {[P in CK]: G},
//         K extends keyof T,
//         F extends T[K] & G,
//         G extends  ((...args: {}[]) => R),
//         R>(
//         proto: ProtoOf<T>,
//         propertyKey: K,
//     ) => {
//         // Do stuff.
//     };
// }
//
// class Test extends Base {
//     @decorate('foo') bar(): boolean {
//         return false;
//     }
//
//     foo(): boolean {return false;}
// }
//
//
//
// class Class {
//     a(): any {
//
//     }
// }
//
// // const aaa = 'ldkaskjlsdaldadsfdfsdfsdffsdsdffdssdfgsfdsjk'
// //
// // type ASAF = 'a' | 'b' | 'c'
// //
// // type Yair = { [K in typeof aaa]: number }
// //
// // const gggg: Yair = {
// //     ldkaskjlsdaldadsfdfsdffdssdfgsfdsjk: 3
// // }
//
//
// // const a: ProtoOf<{[P in 'a']: any}> = Class;
//
//
// export function TTTT<
//     KEY extends string,
//     >
//     (meta: { init: KEY, destroy: KEY }) {
//         return function
//         <
//             PROTO extends { new(): {
//                 [K in KEY]: (...args) => any} }
//         >
//             (proto: PROTO) {
//
//         }
// }
//
//
// TTTT({
//     init: 'blblb',
//     destroy: 'sss'
// })(
//     class Yaya {
//         blblb() {
//
//         }
//         sss() {
//
//         }
//     }
// );
//
//
//
//
//
//
//
//
//





