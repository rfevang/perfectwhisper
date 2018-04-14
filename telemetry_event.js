class TelemetryEvent {
  constructor(data) {
    this.data = data;
    this.timestamp = Date.parse(data['_D']);
  }

  static create(data) {
    switch(data['_T']) {
      default:
        return new TelemetryEvent(data);
    }
  }

  get type() {
    return this.data['_T'];
  }

  toString() {
    return JSON.stringify(this.data, null, 2);
  }
}
