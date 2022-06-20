
const apiKey = 'AIzaSyBwG_48pRKbxaYfRPMXlD9VaEibj0NRJ6U';

function updateVisuals(message, mapsLink = '') {
	document.querySelector('#result > p').innerText = message;
	document.querySelector('#address-helper a').text = 'Refresh Location...';
	document.querySelector('#address-helper-button').style.padding = '0 0 5px 0';
	document.querySelector('#result').style.display = 'flex';
	
	if (mapsLink.length > 0) {
		document.querySelector('#result a').href = mapsLink
		document.querySelector('#result a').style.display = 'block';
	} else {
		document.querySelector('#result a').style.display = 'none';
	}
	
	document.querySelectorAll('.game-layout__status > div > div')[1].style['padding-bottom'] = `calc(1rem + ${document.querySelector('#address-helper').clientHeight}px)`;
}

function getLocation() {
	const raw = document.querySelectorAll("#__NEXT_DATA__")[0].text;
	const json = JSON.parse(raw);
	const rounds = json.props.pageProps?.game?.rounds;
	if (rounds) {
		const statusInnerHTML = document.querySelector('.game-layout__status').innerHTML;
		const currentRoundNumber = Number(statusInnerHTML.match(/([1-5])<!--\s-->\s\/\s<!--\s-->5/)[1]);
		if (rounds.length == currentRoundNumber) {
			const currentRound = rounds[rounds.length - 1];
			const lat = currentRound.lat;
			const lng = currentRound.lng;
			const targetUrl = `https://google.com/maps/place/${lat},${lng}`;
			
			const request = new XMLHttpRequest();
			var url = `https://maps.googleapis.com/maps/api/geocode/json?sensor=true`;
			url += `&latlng=${lat},${lng}`;
			url += `&key=${apiKey}`;
			request.open('GET', url, true);
			request.onreadystatechange = function(){
				if (request.readyState == 4 && request.status == 200){
					const data = JSON.parse(request.responseText);
					switch(data.status) {
						case 'REQUEST_DENIED': updateVisuals('Request denied, check Google API token!'); break;
						default:
							const address = data.results[0];
							updateVisuals(address.formatted_address, targetUrl);
					}
				}
			};
			request.send();
		} else {
			updateVisuals('You need to reload the page every round!');
		}
	} else {
		updateVisuals('Error! If you are in a game, reload this page!');
	}
}

// Add elements to the DOM
window.addEventListener('load', function() {
	
	const statusChild = document.querySelector('.game-layout__status > div');
	statusChild.id = 'status-child';
	const statusChildSecondChild = document.querySelectorAll('.game-layout__status > div > div')[1];
	statusChildSecondChild.id = 'status-child-second-child';
	
	const container = document.createElement('div');
	container.id = 'address-helper';
	const locationDiv = document.createElement('div');
	locationDiv.id = 'address-helper-button'
	const a = document.createElement('a');
	a.text = 'Get Location...';
	const locationIcon = document.createElement('img');
	locationIcon.src = 'https://png.monster/wp-content/uploads/2021/06/png.monster-10.png';
	a.prepend(locationIcon);
	a.addEventListener('click', getLocation);
	locationDiv.appendChild(locationIcon);
	locationDiv.appendChild(a);
	container.appendChild(locationDiv)
	const resultDiv = document.createElement('div');
	resultDiv.id = 'result';
	const mapsIcon = document.createElement('img');
	mapsIcon.src = 'https://seeklogo.com/images/N/new-google-maps-icon-logo-263A01C734-seeklogo.com.png';
	const aa = document.createElement('a');
	aa.target = '_blank';
	aa.style.display = 'none';
	aa.appendChild(mapsIcon);
	resultDiv.appendChild(aa);
	resultDiv.appendChild(document.createElement('p'));
	container.appendChild(resultDiv);
	resultDiv.style.display = 'none';
	statusChild.appendChild(container);

});
