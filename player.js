class Player {
  constructor(createEvent) {
    this.positionEvents_ = [];
    this.character_ = createEvent.character;
  }

  toString() {
    return this.character_.name;
  }

  get name() {
    return this.character_.name;
  }

  addPositionEvent(event) {
    this.positionEvents_.push(event);
  }

  locationAtTime(time) {
    let best = this.positionEvents_[0].character.location;
    for (let i = 0; i < this.positionEvents_.length; i++) {
      if (this.positionEvents_[i].timestamp > time) break;
      best = this.positionEvents_[i].character.location;
    }
    return best;
  }
}
