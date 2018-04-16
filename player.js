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
}
