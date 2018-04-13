class Slider {
  constructor(logStart, logEnd) {
    this.start = Date.parse(logStart["_D"]);
    this.end = Date.parse(logEnd["_D"]);
    this.listeners = [];

    this.slider = document.createElement('Input');
    this.slider.type = 'range';
    this.slider.min = this.start;
    this.slider.max = this.end;
    this.slider.value = this.start;
    this.slider.oninput = this.onupdate.bind(this);
  }

  render(parent) {
    parent.appendChild(this.slider);
  }

  getValue() {
    return parseInt(this.slider.value);
  }

  addListener(listener) {
    this.listeners.push(listener);
  }

  onupdate() {
    let args = arguments;
    this.listeners.forEach(function(fn) {
      fn.apply(null, args);
    });
  }
}
