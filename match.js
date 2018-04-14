class Match {
  constructor(matchEvents) {
    let unknownTypes = new Map();
    matchEvents.forEach(function(e) {
      let event = TelemetryEvent.create(e);
      switch (event.type) {
        case 'LogMatchStart':
          this.start_ = event;
          break;
        case 'LogMatchEnd':
          this.end_ = event;
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
}
