class TelemetryEvent {
  constructor(data) {
    this.data_ = data;
    this.timestamp_ = new Date(data['_D']);
  }

  static create(data) {
    switch(data['_T']) {
      case "LogItemPickup":
        return new ItemPickupEvent(data);
      default:
        // TODO(rfevang): Replace with specializations based on type
        if (data.hasOwnProperty("character")) {
          return new CharacterEvent(data);
        }
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

  isCharacterEvent() {
    return false;
  }
}

class CharacterEvent extends TelemetryEvent {
  constructor(data) {
    super(data);

    this.character_ = new Character(data.character || data.Character);
  }

  get character() {
    return this.character_;
  }

  isCharacterEvent() {
    return true;
  }
}

class ItemPickupEvent extends CharacterEvent {
  constructor(data) {
    super(data);

    this.item_ = new Item(data.item || data.Item);
  }
}
