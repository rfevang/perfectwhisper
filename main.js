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
  slider.render(document.body);

  let infobox = new InfoBox(slider, response);
  infobox.render(document.body);
}


window.onload = function(){
	
	fetchData("https://telemetry-cdn.playbattlegrounds.com/bluehole-pubg/pc-eu/2018/04/02/22/14/3e5226cb-36c3-11e8-a949-0a586466b919-telemetry.json");
	
}


