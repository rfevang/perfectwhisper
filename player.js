class Player {
  constructor(createEvent) {
    this.character_ = createEvent.character;
  }

  toString() {
    return this.character_.name;
  }
}
