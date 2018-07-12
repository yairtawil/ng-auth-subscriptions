import { TimerModule } from './timer.module';

describe('TimerModule', () => {
  let timerModule: TimerModule;

  beforeEach(() => {
    timerModule = new TimerModule();
  });

  it('should create an instance', () => {
    expect(timerModule).toBeTruthy();
  });
});
