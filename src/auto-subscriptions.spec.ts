import { AutoSubscription, AutoSubscriptions, Errors } from './auto-subscriptions';
import * as autoSubscriptions from './auto-subscriptions';
import createSpyObj = jasmine.createSpyObj;

describe('AutoSubscriptions', () => {
    describe('@AutoSubscriptions', () => {

        describe('AutoSubscriptions inputs', () => {
            const Test = class Test {
                init() {

                }
                destroy() {

                }
            };

            it('should throw an error on invalid input type ', () => {
                expect(() => AutoSubscriptions({
                    init: null,
                    destroy: 'onDestroy'
                })(Test)).toThrowError(Errors.invalidType.replace('{{key}}', 'init'));
            });

            it('should throw an error on invalid input function', () => {
                const notPrototypeFunction = () => {

                };
                expect(() => AutoSubscriptions({
                    init: 'onInit',
                    destroy: notPrototypeFunction
                })(Test)).toThrowError(Errors.invalidFunction.replace('{{key}}', 'destroy'));
            });

            describe('should success when inputs are valid', () => {
                it('functions', () => {
                    expect(() => AutoSubscriptions({
                        init: Test.prototype.init,
                        destroy: Test.prototype.destroy
                    })(Test)).not.toThrowError();
                });

                it('strings', () => {
                    expect(() => AutoSubscriptions({
                        init: 'init',
                        destroy: 'destroy'
                    })(Test)).not.toThrowError();
                });

                it('string and function', () => {
                    expect(() => AutoSubscriptions({
                        init: Test.prototype.init,
                        destroy: 'destroy'
                    })(Test)).not.toThrowError();
                });

            })

        });

        describe('AutoSubscriptions init', () => {
            let Test = class Test {
                init() {
                }
                destroy() {
                }
            };

            it('should\'nt call "initSubscriptions" if "_subscriptionsPropertyKeys_" is not an array("@AutoSubscription" never have been called)', () => {
                spyOn(autoSubscriptions, 'initSubscriptions');

                AutoSubscriptions({
                    init: Test.prototype.init,
                    destroy: Test.prototype.destroy
                })(Test);

                expect(autoSubscriptions.initSubscriptions).not.toHaveBeenCalled();
            });

            it('should call "initSubscriptions" if "_subscriptionsPropertyKeys_" is an array("@AutoSubscription" have been called at least once)', () => {
                spyOn(autoSubscriptions, 'initSubscriptions');

                @AutoSubscriptions({
                    init: Test.prototype.init,
                    destroy: Test.prototype.destroy
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
                    init: Test.prototype.init,
                    destroy: Test.prototype.destroy
                })
                class Test {
                    @AutoSubscription
                    a = createSpyObj({ subscribe: () => {} });

                    @AutoSubscription
                    b = createSpyObj({ subscribe: () => {} });

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
            let Test = class Test {
                init() {
                }
                destroy() {
                }
            };

            it('should call original "destroy"', () => {
                @AutoSubscriptions({
                    init: 'init',
                    destroy: 'destroy'
                })
                class Test {
                    destroy(one, two, three) {
                        return `${one}/${two}/${three}`;
                    }
                }

                const test = new Test();

                expect(test.destroy('one', 'two', 'three')).toEqual('one/two/three');
            });

            it('should call "removeSubscriptions" if "_subscriptionsList_" is an array', () => {
                spyOn(autoSubscriptions, 'removeSubscriptions');

                @AutoSubscriptions({
                    init: Test.prototype.init,
                    destroy: Test.prototype.destroy
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
                const subscriptionsA = createSpyObj({ unsubscribe: () => {} });
                const subscriptionsB = createSpyObj({ unsubscribe: () => {} });

                @AutoSubscriptions({
                    init: Test.prototype.init,
                    destroy: Test.prototype.destroy
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

        it('Should push keys of properties to _subscriptionsPropertyKeys_', () => {
            class Test {
                readonly _subscriptionsPropertyKeys_;

                @AutoSubscription
                PropertyKeyA = null;

                @AutoSubscription
                PropertyKeyB = null;
            }
            expect(Test.prototype._subscriptionsPropertyKeys_).toBeDefined();
            expect(Test.prototype._subscriptionsPropertyKeys_).toContain('PropertyKeyA');
            expect(Test.prototype._subscriptionsPropertyKeys_).toContain('PropertyKeyB');
        });

        it('Should push keys of function properties to _subscriptionsPropertyKeys_', () => {
            class Test {
                readonly _subscriptionsPropertyKeys_;

                @AutoSubscription
                PropertyKeyFunction = () => null;
            }
            expect(Test.prototype._subscriptionsPropertyKeys_).toBeDefined();
            expect(Test.prototype._subscriptionsPropertyKeys_).toContain('PropertyKeyFunction');
        });

    });
});