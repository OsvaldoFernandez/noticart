import axios from "axios";
import Alpine from 'alpinejs';
import 'bootstrap'; // JS (includes Popper)
import 'bootstrap/dist/css/bootstrap.min.css';

import './base.scss';
const BASE_PATH = 'https://d3e6htiiul5ek9.cloudfront.net';

let products = [
	{ id: '7791337010017', name: 'Yogur Sin sabor' },
	{ id: '7793913013726', name: 'Queso untable' },
	{ id: '7791866000381', name: 'Ketchup' },
	{ id: '8480017558121', name: 'Lata de atún' },
	{ id: '7791720033593', name: 'Lata de atún 2' }
]

let results = [];
let idsSucursales = [];


const locSuccess = (position) => {
  getSucursales(position.coords);
}

const locError = () => { alert("Sorry, no position available.") };


const getLocation = () => {
  (navigator.geolocation) ? navigator.geolocation.getCurrentPosition(locSuccess, locError) : locError();
}

const sucSuccess = (resp) => {
	idsSucursales = resp.data.sucursales.map((suc) => suc.id).slice(0,10);
  getProds(products);
}

const getSucursales = (location) => {
  const params = {lat: location.latitude, lng: location.longitude, offset: 0, limit: 30 }

	axios.get(`${BASE_PATH}/prod/sucursales`, { params }).then(sucSuccess)
}

const updateTable = (id, attr, value) => {
	Alpine.store('controller').products.filter((prod) => prod.id == id)[0][attr] = value
}

const prodSuccess = (resp, remainingProds) => {
  updateTable(remainingProds[0].id, 'precioMin', resp.data.producto.precioMin);
  const minSucursal = resp.data.sucursales.filter((sucursal) => sucursal.preciosProducto && sucursal.preciosProducto.precioLista == resp.data.producto.precioMin)[0];
  const precioIn = minSucursal ? minSucursal.banderaDescripcion + ' - ' + minSucursal.direccion : 'N/A';
  updateTable(remainingProds[0].id, 'precioIn', precioIn);
  let promos = "";
  resp.data.sucursales.forEach((sucursal) => {
  	if (sucursal.preciosProducto && sucursal.preciosProducto.promo2.descripcion) {
      promos += sucursal.banderaDescripcion + ' - ' + sucursal.direccion+"\n"+sucursal.preciosProducto.promo2.descripcion;
      promos += "<br><br>";
  	}
  })
  updateTable(remainingProds[0].id, 'promos', promos);
  Alpine.nextTick(() => {
    $(function () {
      $(`#locationPopover-${remainingProds[0].id}`).attr('data-bs-content', precioIn);
      $(`#locationPopover-${remainingProds[0].id}`).popover('dispose').popover();
      $(`#promoPopover-${remainingProds[0].id}`).attr('data-bs-content', promos);
      $(`#promoPopover-${remainingProds[0].id}`).popover('dispose').popover();
    });
  });

  getProds(remainingProds.slice(1));
};

const getProds = (remainingProds) => {
	if (remainingProds.length === 0) return;
	const params = { id_producto: remainingProds[0].id, array_sucursales: idsSucursales.join(','), limit: 30 };
	axios.get(`${BASE_PATH}/prod/producto`, { params }).then((resp) => prodSuccess(resp, remainingProds));
};

document.addEventListener('alpine:init', () => {
  Alpine.store('controller', {
  	products: products
  });
});


window.fetchPromos = () => {
  getLocation();
};

Alpine.start();



