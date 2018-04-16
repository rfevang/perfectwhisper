const SVG_NS = 'http://www.w3.org/2000/svg';
const MAX_X = 816000;
const MAX_Y = 816000;

class ActionMap {
  constructor(slider, match) {
    this.slider_ = slider;
    this.match_ = match;
    this.zoomFactor_ = 1;
    this.cx_ = MAX_X/2;
    this.cy_ = MAX_Y/2;

    this.element_ = document.createElement('div');
    this.element_.id = 'actionmap';
    this.svg_ = document.createElementNS(SVG_NS, 'svg');

    let map = document.createElementNS(SVG_NS, 'image');
    map.setAttribute('width', MAX_X);
    map.setAttribute('height', MAX_Y);
    map.setAttribute('href', 'https://github.com/pubg/api-assets/raw/master/assets/maps/Erangel_Minimap_lowres.jpg');
    this.svg_.appendChild(map);


    this.playerCircles_ = [];
    match.players().forEach(function(player) {
      let circle = this.createCircleForPlayer_(player);
      this.playerCircles_.push(circle);
      this.svg_.appendChild(circle);
    }, this);


    slider.addListener(this.onUpdate.bind(this));
    this.svg_.addEventListener('wheel', this.onMouseWheel.bind(this));

    this.setViewBox_();
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
      circle.setAttribute('transform', 'translate(' + pos.x + " " + pos.y + ")");
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

  setViewBox_() {
    let sizeX = MAX_X / this.zoomFactor_;
    let sizeY = MAX_Y / this.zoomFactor_;

    this.svg_.setAttribute('viewBox', (this.cx_ - sizeX/2.0) + ' ' + (this.cy_ - sizeY/2.0) + ' ' + sizeX + ' ' + sizeY);
  }

  onMouseWheel(e) {
    if (e.deltaY < 0) {
      this.zoomFactor_ *= 2;
    } else if (e.deltaY > 0) {
      this.zoomFactor_ /= 2;
    }
    this.setViewBox_();
    console.log(e.clientX + ' ' + e.clientY + ' ' + e.deltaY);
  }
}
