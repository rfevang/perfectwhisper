class Match {
  constructor(matchEvents) {
    this.events_ = [];
    this.itemPickups_ = [];
    this.players_ = [];

    let unknownTypes = new Map();
    matchEvents.forEach(function(e) {
      let event = TelemetryEvent.create(e);

      this.events_.push(event);
      switch (event.type) {
        case 'LogMatchStart':
          this.start_ = event;
          break;
        case 'LogMatchEnd':
          this.end_ = event;
          break;
        case 'LogItemPickup':
          this.itemPickups_.push(event);
          break;
        case 'LogPlayerCreate':
          this.players_.push(new Player(event));
          break;
        default:
          if (!unknownTypes.has(event.type)) unknownTypes.set(event.type, []);
          unknownTypes.get(event.type).push(event);
      }
    }, this);
    unknownTypes.forEach(function(values, type) {
      console.log(type + " is unknown (" + values.length + " values).");
    });
  }

  get start() {
    return this.start_;
  }

  get end() {
    return this.end_;
  }

  allEvents() {
    return this.events_;
  }

  players() {
    return this.players_;
  }
}
