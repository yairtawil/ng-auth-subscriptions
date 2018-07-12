import { EventsModule } from './events.module';

describe('EventsModule', () => {
  let eventsModule: EventsModule;

  beforeEach(() => {
    eventsModule = new EventsModule();
  });

  it('should create an instance', () => {
    expect(eventsModule).toBeTruthy();
  });
});
