class Match {
  constructor(matchEvents) {
    this.events_ = [];
    this.itemPickups_ = [];
    this.players_ = [];
    this.gameStateEvents_ = [];
    this.playerByName_ = new Map();

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
          let player = new Player(event);
          this.players_.push(player);
          this.playerByName_.set(player.name, player);
          break;
        case 'LogPlayerPosition':
          this.playerByName_.get(event.character.name).addPositionEvent(event);
          break;
        case 'LogPlayerKill':
          this.playerByName_.get(event.data_.victim.name).addDeathEvent(event);
          if (!(event.data_.killer.name == "")) this.playerByName_.get(event.data_.killer.name).addKillEvent(event);
          break;
        case 'LogGameStatePeriodic':
          this.gameStateEvents_.push(event);
          break;
        default:
          if (!unknownTypes.has(event.type)) unknownTypes.set(event.type, []);
          unknownTypes.get(event.type).push(event);
      }
    }, this);
    console.log(this.gameStateEvents_);
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

  gameStateAtTime(time){
    let latestGameState_ = this.gameStateEvents_[0];
    for (let i = 0; i < this.gameStateEvents_.length; i++) {
      if (this.gameStateEvents_[i].timestamp >= time) break;
         latestGameState_ = this.gameStateEvents_[i];
    }
    return latestGameState_.gameState;
  }

  mapName(){
  	return this.start_.data_.mapName;
  }
}
