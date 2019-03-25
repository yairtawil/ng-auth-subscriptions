import * as autoSubscriptions from './auto-subscriptions';
import createSpyObj = jasmine.createSpyObj;
const { AutoSubscription, AutoSubscriptions } = autoSubscriptions;

describe('AutoSubscriptions', () => {
  describe('@AutoSubscriptions', () => {
    class TestExample {
      init() {
      }

      destroy() {
      }
    }

    it('should initial with default metadata', () => {
      const subscriber$ = { unsubscribe: () => {}};
      const observable$ = { subscribe: () => subscriber$ };

      spyOn(observable$, 'subscribe').and.callThrough();
      spyOn(subscriber$, 'unsubscribe');

      @AutoSubscriptions()
      class TestDefaultMeta {

        @AutoSubscription
        a$ = observable$;

        @AutoSubscription
        b$ = observable$;

        @AutoSubscription
        c$ = observable$;

        ngOnInit() {

        }

        ngOnDestroy() {

        }
      }

      const testDefaultMeta = new TestDefaultMeta();
      testDefaultMeta.ngOnInit();
      expect(observable$.subscribe).toHaveBeenCalledTimes(3);

      testDefaultMeta.ngOnDestroy();
      expect(subscriber$.unsubscribe).toHaveBeenCalledTimes(3);
    });

    describe('AutoSubscriptions inputs', () => {
      it('should throw an error on invalid input type ', () => {
        expect(() => AutoSubscriptions({
          init: null,
          destroy: 'destroy'
        })(TestExample)).toThrowError(`Can't find init function with: ${null}`);
      });

      describe('should success when inputs are valid', () => {
        it('strings', () => {
          expect(() => AutoSubscriptions({
            init: 'init',
            destroy: 'destroy'
          })(TestExample)).not.toThrowError();
        });
      });

    });

    describe('AutoSubscriptions init', () => {
      it(`should\'nt call "initSubscriptions" if "subscriptionsPropertyKeys_ \n
        is not an array("@AutoSubscription" never have been called)`, () => {
        spyOn(autoSubscriptions, 'initSubscriptions');

        AutoSubscriptions({
          init: 'init',
          destroy: 'destroy'
        })(TestExample);

        expect(autoSubscriptions.initSubscriptions).not.toHaveBeenCalled();
      });

      it(`should call "initSubscriptions" if "subscriptionsPropertyKeys_" \n
       is an array("@AutoSubscription" have been called at least once)`, () => {
        spyOn(autoSubscriptions, 'initSubscriptions');

        @AutoSubscriptions({
          init: 'init',
          destroy: 'destroy'
        })
        class Test {
          @AutoSubscription
          a = null;

          init() {
          }

          destroy() {
          }
        }

        const test = new Test();
        test.init();

        expect(autoSubscriptions.initSubscriptions).toHaveBeenCalledWith(test);
      });

      it('should call subscribe for each property', () => {
        @AutoSubscriptions({
          init: 'init',
          destroy: 'destroy'
        })
        class Test {
          @AutoSubscription
          a = createSpyObj({
            subscribe: () => {
            }
          });

          @AutoSubscription
          b = createSpyObj({
            subscribe: () => {
            }
          });

          init() {
          }

          destroy() {
          }
        }

        const test = new Test();
        test.init();
        expect(test.a.subscribe).toHaveBeenCalled();
        expect(test.b.subscribe).toHaveBeenCalled();
      });

      it('should call original "init"', () => {
        class Test {
          init() {
            return 'value';
          }

          destroy() {

          }
        }

        AutoSubscriptions({
          init: 'init',
          destroy: 'destroy'
        })(Test);

        const test = new Test();
        test.init();

        expect(test.init()).toEqual('value');
      });

    });

    describe('AutoSubscriptions destroy', () => {
      it('should call original "destroy"', () => {
        @AutoSubscriptions({
          init: 'init',
          destroy: 'destroy'
        })
        class Test {
          init() {

          }

          destroy(one, two, three) {
            return `${one}/${two}/${three}`;
          }
        }

        const test = new Test();

        expect(test.destroy('one', 'two', 'three')).toEqual('one/two/three');
      });

      it('should call "removeSubscriptions" if "AutoSubscriptionsList" is an array', () => {
        spyOn(autoSubscriptions, 'removeSubscriptions');

        @AutoSubscriptions({
          init: 'init',
          destroy: 'destroy'
        })
        class Test {
          @AutoSubscription
          a = null;

          init() {
          }

          destroy() {
          }
        }

        const test = new Test();
        test.init();
        test.destroy();
        expect(autoSubscriptions.removeSubscriptions).toHaveBeenCalledWith(test);
      });

      it('should call unsubscribe for each property', () => {
        const subscriptionsA = createSpyObj({
          unsubscribe: () => {
          }
        });
        const subscriptionsB = createSpyObj({
          unsubscribe: () => {
          }
        });

        @AutoSubscriptions({
          init: 'init',
          destroy: 'destroy'
        })
        class Test {
          @AutoSubscription
          a = ({ subscribe: () => subscriptionsA });

          @AutoSubscription
          b = ({ subscribe: () => subscriptionsB });

          init() {
          }

          destroy() {
          }
        }

        const test = new Test();
        test.init();
        test.destroy();
        expect(subscriptionsA.unsubscribe).toHaveBeenCalled();
        expect(subscriptionsB.unsubscribe).toHaveBeenCalled();
      });
    });

  });

  describe('@AutoSubscription', () => {

    it('Should push keys of properties to subscriptionsPropertyKeys_', () => {
      class Test {
        readonly AutoSubscriptionsPropertyKeys;

        @AutoSubscription
        PropertyKeyA = null;

        @AutoSubscription
        PropertyKeyB = null;
      }

      expect(Test.prototype.AutoSubscriptionsPropertyKeys).toBeDefined();
      expect(Test.prototype.AutoSubscriptionsPropertyKeys).toContain('PropertyKeyA');
      expect(Test.prototype.AutoSubscriptionsPropertyKeys).toContain('PropertyKeyB');
    });

    it('Should push keys of function properties to subscriptionsPropertyKeys_', () => {
      class Test {
        readonly AutoSubscriptionsPropertyKeys;

        @AutoSubscription
        propertyKeyFunction = () => null
      }

      expect(Test.prototype.AutoSubscriptionsPropertyKeys).toBeDefined();
      expect(Test.prototype.AutoSubscriptionsPropertyKeys).toContain('propertyKeyFunction');
    });

  });
});
