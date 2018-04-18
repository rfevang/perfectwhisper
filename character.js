class Character {
  constructor(data) {
    this.name_ = data.name || data.Name;
    this.teamId_ = data.teamId || data.TeamId;
    this.health_ = data.health || data.Health;
    this.location_ = new Location(data.location || data.Location);
    this.ranking_ = data.ranking || data.Ranking;
    this.accountId_ = data.accountId || data.AccountId;
  }

  get name() {
    return this.name_;
  }

  get location() {
    return this.location_;
  }

  get teamId() {
    return this.teamId_;
  }
}
