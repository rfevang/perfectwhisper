class TelemetryEvent {
  constructor(data) {
    this.data_ = data;
    this.timestamp_ = new Date(data['_D']);
  }

  static create(data) {
    switch(data['_T']) {
      default:
        return new TelemetryEvent(data);
    }
  }

  get type() {
    return this.data_['_T'];
  }

  get timestamp() {
    return this.timestamp_;
  }

  toString() {
    return JSON.stringify(this.data_, null, 2);
  }
}
