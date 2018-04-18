class InfoBox {
  constructor(slider, match) {
    this.slider_ = slider;
    slider.addListener(this.update.bind(this));
    this.match_ = match;
    this.box_ = document.createElement('pre');
    this.box_.id = 'info-box';
    this.update();
  }

  render(parent) {
    parent.appendChild(this.box_);
  }

  update() {
    this.box_.innerText = this.findFirstAfterSliderTime();
  }

  findFirstAfterSliderTime() {
    let slidertime = this.slider_.getValue();
    let events = this.match_.allEvents();
    for (let i = 0; i < events.length; i++) {
      if (events[i].timestamp >= slidertime) return events[i];
    }
  }
}
