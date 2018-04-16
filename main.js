function fetchData(url) {
  let request = new XMLHttpRequest();
  request.open("GET", url);
  request.responseType = "json";
  request.onreadystatechange = function() {
    if (request.readyState == 4) {
      loadMatchData(request.response);
    }
  }
  request.send();
}

function loadMatchData(response) {
  let match = new Match(response);

  let slider = new Slider(match.start, match.end);
  let map = new ActionMap(slider, match);
  let infobox = new InfoBox(slider, match);

  map.render(document.body);
  infobox.render(document.body);
  slider.render(document.body);
}

fetchData("telemetry-testdata.json");
