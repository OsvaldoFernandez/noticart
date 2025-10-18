console.log("Hello World from uva!");


import axios from "axios";

const TEST = false;



const logSuccess = (position) => {
  getSucursales(position.coords)
}

const logError = () => {
  alert("Sorry, no position available.");
}


const getLocation = () => {
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(logSuccess, logError);
  } else {
    alert("Geolocation is not supported by this browser.");
  }
}


const getSucursales = (location) => {

	return axios
		.get('https://d3e6htiiul5ek9.cloudfront.net/prod/sucursales', {
			params: {
				lat: location.latitude,
				lng: location.longitude,
				offset: 0,
				limit: 30,
			},
		})
		.then((response) => response.data)
		.catch((e) => {
			console.log(e);
		});
}

getLocation();
