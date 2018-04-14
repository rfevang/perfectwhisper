function fetchData(url) {
  let request = new XMLHttpRequest();
  request.open("GET", url);
  request.responseType = "json";
  request.onreadystatechange = function() {
    if (request.readyState == 4) {
      loadResponseData(request.response);
    }
  }
  request.send();
}

function loadResponseData(response) {
  // REMOVE:
  RES = response;

  let items = new Map();

  response.forEach(function(item) {
    let logEvent = new TelemetryEvent(item);
    if (!items.has(logEvent.type)) items.set(logEvent.type, []);
    items.get(logEvent.type).push(item);
  });

  items.forEach(function(values, type) {
    console.log(type + ": " + values.length);
  });
  let slider = new Slider(items.get('LogMatchStart')[0], items.get('LogMatchEnd')[0]);
  slider.render(document.body);

  let infobox = new InfoBox(slider, response);
  infobox.render(document.body);
}

fetchData("telemetry-testdata.json");
