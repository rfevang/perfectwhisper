class InfoBox {
  constructor(slider, items) {
    this.slider = slider;
    this.slider.addListener(this.update.bind(this));
    this.items = items;
    this.box = document.createElement('pre');
    this.box.id = 'info-box';
    this.update();
  }

  render(parent) {
    parent.appendChild(this.box);
  }

  update() {
    let item = this.findFirstAfterSliderTime();
    this.box.innerText = JSON.stringify(item, null, 2);
  }

  findFirstAfterSliderTime() {
    let datetime = this.slider.getValue();
    for (let i = 0; i < this.items.length; i++) {
      let itemdate = new Date(this.items[i]["_D"]);
      if (new Date(this.items[i]["_D"]) >= datetime) return this.items[i];
    }
  }
}
