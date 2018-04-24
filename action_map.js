const SVG_NS = 'http://www.w3.org/2000/svg';
const MAX_X = 816000;
const MAX_Y = 816000;

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
    match.players().forEach(function(player) {
      let circle = this.createCircleForPlayer_(player);
      this.playerCircles_.push(circle);
      this.svg_.appendChild(circle);
    }, this);

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
    this.match_.players().forEach(function(player, index) {
      let pos = player.locationAtTime(time);
      let circle = this.playerCircles_[index];
      let scale = this.viewbox.width / MAX_X;
      circle.setAttribute('transform', 'translate(' + pos.x + ' ' + pos.y + ') scale(' + scale + ')');
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
