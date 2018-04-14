class Slider {
  constructor(start, end) {
    this.listeners_ = [];

    this.slider_ = document.createElement('Input');
    this.slider_.type = 'range';
    this.slider_.min = start.timestamp.getTime();
    this.slider_.max = end.timestamp.getTime();
    this.slider_.value = this.slider_.min;
    this.slider_.oninput = this.onupdate.bind(this);
  }

  render(parent) {
    parent.appendChild(this.slider_);
  }

  getValue() {
    return new Date(parseInt(this.slider_.value));
  }

  addListener(listener) {
    this.listeners_.push(listener);
  }

  onupdate() {
    let args = arguments;
    this.listeners_.forEach(function(fn) {
      fn.apply(null, args);
    });
  }
}
