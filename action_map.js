const SVG_NS = 'http://www.w3.org/2000/svg';
const MAX_X = 819200;
const MAX_Y = 819200;
const TRAILLENGTH = 100000;

class ActionMap {
  constructor(slider, match) {
    this.slider_ = slider;
    this.match_ = match;
    this.boundMouseDrag_ = this.onMouseDrag_.bind(this);
    this.dragging_ = false;

    this.element_ = document.createElement('div');
    this.element_.id = 'actionmap';
    this.svg_ = document.createElementNS(SVG_NS, 'svg');

    this.map = document.createElementNS(SVG_NS, 'image');
    this.map.setAttribute('width', MAX_X);
    this.map.setAttribute('height', MAX_Y);
    this.chooseMap();
    this.svg_.appendChild(this.map);

    this.playerCircles_ = [];
    this.playerTrails_ = [];
    match.players().forEach(function(player) {
      let trail = this.createTrailForPlayer_(player);
      this.playerTrails_.push(trail);
      this.svg_.appendChild(trail);

      let circle = this.createCircleForPlayer_(player);
      this.playerCircles_.push(circle);
      this.svg_.appendChild(circle);
    }, this);

    this.redZone = document.createElementNS(SVG_NS,"circle");
    this.redZone.classList.add('redZone');
    this.svg_.appendChild(this.redZone);

    this.whiteZone = document.createElementNS(SVG_NS,"circle");
    this.whiteZone.classList.add('whiteZone');
    this.svg_.appendChild(this.whiteZone);

    this.blueZone = document.createElementNS(SVG_NS,"circle");
    this.blueZone.classList.add('blueZone');
    this.svg_.appendChild(this.blueZone);

    let viewbox = this.svg_.createSVGRect();
    viewbox.width = MAX_X;
    viewbox.height = MAX_Y;
    this.viewbox = viewbox;

    slider.addListener(this.onUpdate_.bind(this));
    this.svg_.addEventListener('wheel', this.onMouseWheel_.bind(this));
    this.svg_.addEventListener('mousedown', this.onMouseDown_.bind(this));
    document.addEventListener('mouseup', this.onMouseUp_.bind(this));

    this.element_.appendChild(this.svg_);
  }

  render(parent) {
    parent.appendChild(this.element_);
  }

  onUpdate_() {
    let time = this.slider_.getValue();
    let gameState = this.match_.gameStateAtTime(time);
    this.match_.players().forEach(function(player, index) {
      let scale = this.viewbox.width / MAX_X;
      let pos = player.locationAtTime(time);
      let circle = this.playerCircles_[index];
      circle.setAttribute('transform', 'translate(' + pos.x + ' ' + pos.y + ') scale(' + scale + ')');

      let trailPos = player.trailAtTime(time, TRAILLENGTH);
      let trail = this.playerTrails_[index];
      trail.setAttributeNS(null,"d",trailPos);
      trail.setAttributeNS(null,"stroke-width", 2000 * scale);
      this.redZone.setAttributeNS(null,"stroke-width", 2000 * scale);
      this.whiteZone.setAttributeNS(null,"stroke-width", 2000 * scale);
      this.blueZone.setAttributeNS(null,"stroke-width", 2000 * scale);
      
      if (player.isAlive(time)){
        circle.classList.remove('dead');
      } else {
        circle.classList.add('dead');
      }

      this.updateZone(this.redZone, gameState.redZone.x, gameState.redZone.y, gameState.redZone.r, "red");
      this.updateZone(this.whiteZone, gameState.whiteZone.x, gameState.whiteZone.y, gameState.whiteZone.r, "white");
      this.updateZone(this.blueZone, gameState.blueZone.x, gameState.blueZone.y, gameState.blueZone.r, "blue");
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

  createTrailForPlayer_(player){
    let path = document.createElementNS(SVG_NS, 'path');
    path.classList.add('playerTrail');
    return path;
  }

  onMouseDown_(e) {
    this.dragging_ = true;
    this.lastX_ = e.pageX;
    this.lastY_ = e.pageY;
    document.addEventListener('mousemove', this.boundMouseDrag_);
  }

  onMouseUp_(e) {
    if (this.dragging_) {
      document.removeEventListener('mousemove', this.boundMouseDrag_);
      this.dragging_ = false;
    }
  }

  onMouseDrag_(e) {
    e.stopPropagation();
    e.preventDefault();

    let newViewbox = this.viewbox;
    newViewbox.x = newViewbox.x - (e.pageX - this.lastX_) * newViewbox.width / this.svg_.clientWidth;
    newViewbox.y = newViewbox.y - (e.pageY - this.lastY_) * newViewbox.height / this.svg_.clientHeight;
    this.viewbox = newViewbox;

    this.lastX_ = e.pageX;
    this.lastY_ = e.pageY;
  }

  onMouseWheel_(e) {
    if (e.deltaY == 0) {
      return;
    }

    let newViewbox = this.viewbox;
    if (e.deltaY < 0) {
      newViewbox.width /= 2;
      newViewbox.height /= 2;
    } else {
      newViewbox.width *= 2;
      newViewbox.height *= 2;
    }

    let clickOnScreenX = e.offsetX / this.svg_.clientWidth;
    let clickOnScreenY = e.offsetY / this.svg_.clientHeight;
    let clickX = this.viewbox.x + this.viewbox.width * clickOnScreenX;
    let clickY = this.viewbox.y + this.viewbox.height * clickOnScreenY;
    newViewbox.x = clickX - newViewbox.width * clickOnScreenX;
    newViewbox.y = clickY - newViewbox.height * clickOnScreenY;

    this.viewbox = newViewbox;
  }

  get viewbox() {
    return this.copyViewbox_(this.viewBox_);
  }

  set viewbox(box) {
    this.viewBox_ = this.copyViewbox_(box);
    this.svg_.setAttribute('viewBox', box.x + ' ' + box.y + ' ' + box.width + ' ' + box.height);
    this.onUpdate_();
  }

  copyViewbox_(viewbox) {
    let ret = this.svg_.createSVGRect();
    ret.x = viewbox.x;
    ret.y = viewbox.y;
    ret.width = viewbox.width;
    ret.height = viewbox.height;
    return ret;
  }

  updateZone(zone, x, y, r, color){
    zone.setAttributeNS(null, "cx", this.checkNull(x));
    zone.setAttributeNS(null, "cy", this.checkNull(y));
    zone.setAttributeNS(null, "r", this.checkNull(r));
    zone.setAttributeNS(null, "stroke", color);
  }

  checkNull(el){
    if (el == null) return 0
    return el;
  }

  chooseMap(){
    let mapName = this.match_.mapName();
    switch (mapName) {
      case "Erangel_Main":
        this.map.setAttribute('href', 'https://github.com/pubg/api-assets/raw/master/assets/maps/Erangel_Minimap_lowres.jpg');
        break;
      case "Desert_Main":
        this.map.setAttribute('href', 'https://github.com/pubg/api-assets/raw/master/assets/maps/Miramar_Minimap_lowres.jpg');
        break;
    }
  }
}