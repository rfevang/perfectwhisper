class Player {
  constructor(createEvent) {
    this.positionEvents_ = [];
    this.deathEvent_ = 0;
    this.killEvents_ = [];
    this.character_ = createEvent.character;
  }

  toString() {
    return this.character_.name;
  }

  get name() {
    return this.character_.name;
  }

  get teamId() {
    return this.character_.teamId;
  }

  addPositionEvent(event) {
    this.positionEvents_.push(event);
  }

  addDeathEvent(event) {
    this.deathEvent_ = event;
  }

  addKillEvent(event) {
    this.killEvents_.push(event);
  }

  isAlive(time){
    if (this.deathEvent_ == 0) return true;
    return (this.deathEvent_.timestamp > time);
  }

  locationAtTime(time) {
    let best = this.positionEvents_[0].character.location;
    for (let i = 0; i < this.positionEvents_.length; i++) {
      if (this.positionEvents_[i].timestamp > time) break;
      best = this.positionEvents_[i].character.location;
    }
    return best;
  }

  trailAtTime(time, trailLength) {

    let trail_ = "";
    for (let i = 0; i < this.positionEvents_.length; i++) {
      let posEvent_ = this.positionEvents_[i];
      let pos = posEvent_.character.location;
      
      if (posEvent_.timestamp >= time-trailLength){
        if (trail_ == "") trail_ = "M " + pos.x + " " + pos.y;
        if (posEvent_.timestamp > time) break;
          trail_ += " L " + pos.x + " " + pos.y;
      }
    }
    return trail_;
  }
}
