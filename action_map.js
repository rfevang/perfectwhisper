let SVG_NS = 'http://www.w3.org/2000/svg';

class ActionMap {
  constructor(slider, match) {
    this.slider_ = slider;
    this.match_ = match;
    slider.addListener(this.onUpdate.bind(this));
    this.element_ = document.createElement('div');
    this.element_.id = 'actionmap';
    this.svg_ = document.createElementNS(SVG_NS, 'svg');
 // this.svg_.setAttribute('viewBox', '100 100 800 800');

    this.playerCircles_ = [];
    match.players().forEach(function(player) {
      let circle = this.createCircleForPlayer_(player);
      this.playerCircles_.push(circle);
      this.svg_.appendChild(circle);
    }, this);

    let map = document.createElement('img');
    map.src = 'https://github.com/pubg/api-assets/raw/master/assets/maps/Erangel_Minimap_lowres.jpg';
    this.element_.appendChild(map);
    this.element_.appendChild(this.svg_);
  }

  render(parent) {
    parent.appendChild(this.element_);
  }

  onUpdate() {
    let time = this.slider_.getValue();
    this.match_.players().forEach(function(player, index) {
      let pos = player.locationAtTime(time);
      let circle = this.playerCircles_[index];
      circle.setAttribute('transform', 'translate(' + (pos.x * 800 / 816000) + " " + (pos.y * 800 / 816000) + ")");
    }, this);
  }

  createCircleForPlayer_(player) {
    let group = document.createElementNS(SVG_NS, 'g');
    group.classList.add('playercircle');
    let circle = document.createElementNS(SVG_NS, 'circle');
    let text = document.createElementNS(SVG_NS, 'text');
    text.textContent = String(player.teamId);

    group.appendChild(circle);
    group.appendChild(text);
    return group;
  }
}
