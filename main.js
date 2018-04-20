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

fetchData("https://telemetry-cdn.playbattlegrounds.com/bluehole-pubg/pc-eu/2018/04/18/19/26/72be99c1-433e-11e8-a168-0a58646692e5-telemetry.json");
