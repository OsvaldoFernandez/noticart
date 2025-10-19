console.log("Hello World from uva!");


import axios from "axios";
axios.defaults.timeout = 50000; // Sets a global timeout of 5 seconds (5000 milliseconds)
const TEST = false;

let products = [
	{ id: 'EAN123', name: 'Yogur' }, 
	{ id: 'EAN456', name: 'Queso' },
	{ id: 'EAN789', name: 'Ketchup' }
]

let results = [];


const locSuccess = (position) => {
  getSucursales(position.coords);
}

const locError = () => { alert("Sorry, no position available.") };


const getLocation = () => {
  (navigator.geolocation) ? navigator.geolocation.getCurrentPosition(locSuccess, locError) : locError();
}

const sucSuccess = (resp) => {
	debugger;
  getProductos(resp, products);
}

const getSucursales = (location) => {
  const params = {lat: location.latitude, lng: location.longitude, offset: 0, limit: 30 }

	//axios.get('https://d3e6htiiul5ek9.cloudfront.net/prod/sucursales', { params }).then(sucSuccess)
	new Promise((resolve, reject) => {resolve([1,2,3]); }).then(sucSuccess);
}

const prodSuccess = (resp, idsSucursales, productos) => {
  results.push(resp);
  getProductos(idsSucursales, productos);
};

const showResults = () => {
	console.log(results);
};

const getProductos = (idsSucursales, productos) => {
	if (productos.length === 0) return showResults();

	const params = { id_producto: productos[0].id, array_sucursales: idsSucursales.join(','), limit: 30 };
	//axios.get('https://d3e6htiiul5ek9.cloudfront.net/prod/producto', { params }).then((resp) => prodSuccess(resp, idsSucursales, productos));
	new Promise((resolve, reject) => {resolve(productos.shift()) }).then((resp) => prodSuccess(resp, idsSucursales, productos));
}

getLocation();
