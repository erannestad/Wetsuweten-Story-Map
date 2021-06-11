L.Layer.prototype.setInteractive = function (interactive) {
    if (this.getLayers) {
        this.getLayers().forEach(layer => {
            layer.setInteractive(interactive);
        });
        return;
    }
    if (!this._path) {
        return;
    }

    this.options.interactive = interactive;

    if (interactive) {
        L.DomUtil.addClass(this._path, 'leaflet-interactive');
    } else {
        L.DomUtil.removeClass(this._path, 'leaflet-interactive');
    }
};




var mapOptions = {
  center: [54.157,-127.166],
  zoom: 5,
  zoomControl: true,
  dragging: false,
  scrollWheelZoom: false,
  doubleClickZoom: false,
  boxZoom: false,
  tap: false
};
var map = new L.map('map1', mapOptions);

////////////////////////////////////////
/////          BASEMAPS         ////////
////////////////////////////////////////

var mapboxStyle1 = new L.TileLayer('mapbox://styles/erannestad/ckpiv2brq1l4h19qt154ap5b4/draft/.', {attribution: '&copy; <a href="www.mapbox.com">Mapbox</a>'});
var mapboxStyle2 = new L.TileLayer('https://api.mapbox.com/styles/v1/erannestad/ckpiv2brq1l4h19qt154ap5b4/tiles/256/{z}/{x}/{y}?access_token=pk.eyJ1IjoiZXJhbm5lc3RhZCIsImEiOiJjamp4dHp3N2ExaHp1M3FycnJsamZ4cGpuIn0.Z3DvBItGT21xpbhnIbJLBg', {attribution: '&copy; <a href="www.mapbox.com">Mapbox</a>'});
var osm = new L.TileLayer('http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'});
var Stamen_Watercolor = L.tileLayer.provider('Stamen.Watercolor');
var Stamen_Toner = L.tileLayer.provider('Stamen.Toner');
var Esri_WorldGrey = L.tileLayer.provider('Esri.WorldGrayCanvas');  
map.addLayer(mapboxStyle2); //add stamen toner map







function bindMouseOverFunctionality(e){
	var layer = e.target;
	var newOpacity = (parseFloat(layer.options.fillOpacity) + .2).toString();
	// var newOpacityString = newOpacityNum.toString()
    layer.setStyle({
        fillOpacity: newOpacity
    });
}

function bindMouseOutFunctionality(e){

	var layer = e.target;
	var newOpacity = (parseFloat(layer.options.fillOpacity) - .2).toString();

    layer.setStyle({
        fillOpacity: newOpacity
    });
}

function bindClickFunctionality(e){
	var layer = e.target;
	var newOpacity = (parseFloat(layer.options.fillOpacity) - .2).toString();

    layer.setStyle({
        
    });
}

function onEachFeatureOverview(feature, layer){
	layer.on({
        mouseover: bindMouseOverFunctionality,
        mouseout: bindMouseOutFunctionality,
        click: bindClickFunctionality
    });

    
    popupOptions = {
		closeButton: true,
	    autoClose: true,
	    offset: new L.Point(0, -8),
	    className: "label-popup"
    };

	if (feature.properties.NAME){
		console.log("NAME");
		console.log(feature.properties.NAME);
		layer.bindPopup(feature.properties.NAME, popupOptions);
	}

       
}





////////////////////////////////////////
/////          LAYERS           ////////
////////////////////////////////////////

var wetsuwetenBoundaryLayer = L.geoJSON(wetsuwetenBoundary, {
	onEachFeature: onEachFeatureOverview
});
var RCMPinfrastructureLayer = L.geoJSON(RCMPinfrastructure);
var moriceFSRlayer = L.geoJSON(moriceFSR);
var cglLayer = L.geoJSON(cgl, {
	onEachFeature: onEachFeatureOverview
});

////////////////////////////////////////
/////        POINT LAYERS       ////////
////////////////////////////////////////

// SELECTED ICON
function selectedIcon(feature) {
	return(
		new L.icon({
		    iconUrl: 'icons/camp'+ feature.properties.SLUG +'_selecticon.svg',
		    iconSize:     [18, 18], // size of the icon
		    iconAnchor:   [9, 9], // point of the icon which will correspond to marker's location
		    popupAnchor:  [-0, -18] // point from which the popup should open relative to the iconAnchor
		})
	) 
}

function whiteIcon(feature) {
	return(
		new L.icon({
		    iconUrl: 'icons/camp'+ feature.properties.SLUG +'_whiteicon.svg',
		    iconSize:     [18, 18], // size of the icon
		    iconAnchor:   [9, 9], // point of the icon which will correspond to marker's location
		    popupAnchor:  [-0, -18] // point from which the popup should open relative to the iconAnchor
		})
	) 
}


occupationPointsLayer = L.geoJSON(occupationPoints, {
    style: function(feature) {
        return {
        	opacity: "0"
        };
    },
    pointToLayer: function(feature, latlng) {
  		// var myIcon = new L.icon({
		//     iconUrl: 'icons/camp'+ feature.properties.SLUG +'_whiteicon.svg',
		//     iconSize:     [18, 18], // size of the icon
		//     iconAnchor:   [9, 9], // point of the icon which will correspond to marker's location
		//     popupAnchor:  [-0, -18] // point from which the popup should open relative to the iconAnchor
		// })
		return L.marker(latlng, { icon: whiteIcon(feature) });

    },
    onEachFeature: function (feature, layer) {
    	if (feature.properties.TITLE){
    		layer.bindPopup(feature.properties.TITLE);
    	}
    }
});


map.addLayer(occupationPointsLayer);
occupationPointsLayer.eachLayer(function(layer) {
    layer.setOpacity(0);
});



// CREATE FEATURE GROUP
allLayers = new L.FeatureGroup();
allLayers.addLayer(wetsuwetenBoundaryLayer);
allLayers.addLayer(cglLayer);
allLayers.addLayer(moriceFSRlayer);
map.addLayer(allLayers);
console.log("ALL LAYERS:")
console.log(allLayers._layers);


// ADD CUSTOM PROPERTY TO LEAFLET LAYER
wetsuwetenBoundaryLayer["customID"] = 'wetsuwetenBoundary';
cglLayer["customID"] = 'cgl';
occupationPointsLayer["customID"] = 'occupationPoints';
RCMPinfrastructureLayer["customID"] = 'RCMPinfrastructure';
moriceFSRlayer["customID"] = 'moriceFSR';


// SET STARTING OPACITY
function setStartingAttributes(target) {

	for (var i=0; i < target.length; i++) {
		target[i].setStyle(
	    	function(feature){
	        	return {opacity: "0", fillOpacity: "0", bubblingMouseEvents: 'false' 
	        };
	    });
	}
}

setStartingAttributes([allLayers]);


// FIND ID OF LAYER BY SEARCHING FOR KEY VALUE
function findID(topLayer, searchKey, searchValue) {
	return Object.entries(topLayer._layers).find(arrayItem => arrayItem[1].feature.properties[searchKey] === searchValue);
}



var mapLinks = document.querySelectorAll('.map-link');
for (i=0; i < mapLinks.length; i++) {

	mapLinks[i].onmouseover = function(i) {
		
		var selectedLayer = Object.entries(allLayers._layers).find(arrayItem => arrayItem[1].customID === this.dataset.id);
		console.log(selectedLayer);

		selectedLayer[1].eachLayer(
			function (layer) {
			    layer.openPopup();
			});




	 //    var group = this.dataset.group;
	 //    var id = this.dataset.layer;
	 //    // console.log(id);

	 //    var layerGroup = allLayers.getLayer([group]);

	 //    var selectedLayer = layerGroup.getLayer([id]);
		// // console.log(allLayers)
	 //    console.log(selectedLayer);

  //   	selectedLayer.openPopup();

	 //    layerGroup.setStyle(
	 //    	function(){
	 //    		var newOpacity = (parseFloat(selectedLayer.options.fillOpacity) + .2).toString();
  //   	    	// console.log(this);
	 //        	return {fillOpacity: newOpacity };
	 //    	}
  //   	);
	};

	mapLinks[i].onmouseout = function(i) {
	    // var group = this.dataset.group;
	    // var id = this.dataset.layer;
	    // var layerGroup = allLayers.getLayer([group]);
	    // var selectedLayer = layerGroup.getLayer([id]);

    	// selectedLayer.closePopup();

	    // layerGroup.setStyle(
	    // 	function(){

    	//     	var newOpacity = (parseFloat(selectedLayer.options.fillOpacity) - .2).toString();
    	//     	// console.log(newOpacity);
	    //     	return {fillOpacity: newOpacity };
	    // 	}
    	// );

		var selectedLayer = Object.entries(allLayers._layers).find(arrayItem => arrayItem[1].customID === this.dataset.id);

    	selectedLayer[1].eachLayer(
			function (layer) {
			    layer.closePopup();
			});

	};
}




var waypoint1Selector = '#show-pipelines'
var waypoint1Text = document.querySelectorAll(waypoint1Selector + ' *');
var waypoint1 = new Waypoint({
  element: document.querySelector(waypoint1Selector),
  handler: function(direction) {

	if (direction == 'down') {

		waypoint1Text.forEach(element => element.style.opacity = "1");
		
		document.querySelector('#cgl-caption').classList.remove("disabled");
		document.querySelector('#cgl-caption').classList.add("active");

    	cglLayer.setStyle(function(){
			return {dashArray: '2, 2', dashOffset: '4', opacity: '1', fillOpacity: '1', fillColor: "black", color: "black", weight: '1'}
		})
	}

	if (direction == 'up') {

		waypoint1Text.forEach(element => element.style.opacity = ".3");

		// REMOVE CAPTIONS
		document.querySelector('#cgl-caption').classList.remove("active");
		document.querySelector('#cgl-caption').classList.add("disabled");
		// ADD CAPTIONS
		// document.querySelector('#cgl-caption').classList.remove("disabled");
		// document.querySelector('#cgl-caption').classList.add("active");

		setStartingAttributes([cglLayer]);
	}
  },
  offset: window.innerHeight/2
})


var waypoint2Selector = '#show-territories'
var waypoint2Text = document.querySelectorAll(waypoint2Selector + ' *');
var waypoint2 = new Waypoint({
  element: document.querySelector(waypoint2Selector),
  handler: function(direction) {

	if (direction == 'down') {

		waypoint2Text.forEach(element => element.style.opacity = "1");

		// REMOVE CAPTIONS
		document.querySelector('#cgl-caption').classList.remove("active");
		document.querySelector('#cgl-caption').classList.add("disabled");
		// ADD CAPTIONS
		document.querySelector('#wetsuweten-caption').classList.remove("disabled");
		document.querySelector('#wetsuweten-caption').classList.add("active");
		
		wetsuwetenBoundaryLayer.setStyle(function(){
			return {fillOpacity: '.5', fillColor: "gray"}
		})
	}

	if (direction == 'up') {

		waypoint2Text.forEach(element => element.style.opacity = ".3");

		// REMOVE CAPTIONS
		document.querySelector('#wetsuweten-caption').classList.remove("active");
		document.querySelector('#wetsuweten-caption').classList.add("disabled");
		// ADD CAPTIONS
		document.querySelector('#cgl-caption').classList.remove("disabled");
		document.querySelector('#cgl-caption').classList.add("active");

		setStartingAttributes([wetsuwetenBoundaryLayer]);
	}
  },
  offset: window.innerHeight/2
})


var waypoint3Selector = '#show-occupations'
var waypoint3Text = document.querySelectorAll(waypoint3Selector + ' *');
var waypoint3 = new Waypoint({
  element: document.querySelector(waypoint3Selector),
  handler: function(direction) {

	if (direction == 'down') {

		waypoint3Text.forEach(element => element.style.opacity = "1");

		// REMOVE CAPTIONS
		document.querySelector('#wetsuweten-caption').classList.remove("active");
		document.querySelector('#wetsuweten-caption').classList.add("disabled");
		// ADD CAPTIONS
		// document.querySelector('#').classList.remove("disabled");
		// document.querySelector('#').classList.add("active");

		occupationPointsLayer.eachLayer(function(layer) {
		    layer.setOpacity(1);
		});
		moriceFSRlayer.setStyle(function(){
			return {opacity: '1', weight: "1", color: "#efefef"}
		})


		map.flyTo([54.157,-127.166], 9, {
			animate: true,
        	duration: 1.5
		});

		wetsuwetenBoundaryLayer.setInteractive(false);
		wetsuwetenBoundaryLayer.setStyle(function(){
			return {fillOpacity: '0', fillColor: "gray", weight: '2', color: "gray", opacity: '.7'}
		})

	}

	if (direction == 'up') {

		waypoint3Text.forEach(element => element.style.opacity = ".3");

		// REMOVE CAPTIONS
		// document.querySelector('#wetsuweten-caption').classList.remove("active");
		//document.querySelector('#wetsuweten-caption').classList.add("disabled");
		// ADD CAPTIONS
		document.querySelector('#wetsuweten-caption').classList.remove("disabled");
		document.querySelector('#wetsuweten-caption').classList.add("active");

		occupationPointsLayer.eachLayer(function(layer) {
		    layer.setOpacity(0);
		});
		moriceFSRlayer.setStyle(function(){
			return {opacity: '0', weight: "0", color: "#efefef"}
		})

		setStartingAttributes([occupationPointsLayer]);
		map.flyTo([54.157,-127.166], 5);

		wetsuwetenBoundaryLayer.setInteractive(true);
		wetsuwetenBoundaryLayer.setStyle(function(){
			return {fillOpacity: '.4', fillColor: "gray", weight: '0', color: "red", opacity: '0'}
		})
	}
  },
  offset: window.innerHeight/2
})


var waypoint4Selector = '#show-camp66'
var waypoint4Text = document.querySelectorAll(waypoint4Selector + ' *');
var waypoint4 = new Waypoint({
  element: document.querySelector(waypoint4Selector),
  handler: function(direction) {

	if (direction == 'down') {

		console.log(occupationPointsLayer._layers);

		waypoint4Text.forEach(element => element.style.opacity = "1");

		// REMOVE CAPTIONS
		// document.querySelector('#66-caption').classList.remove("active");
		// document.querySelector('#66-caption').classList.add("disabled");
		// ADD CAPTIONS
		document.getElementById('camp66-caption').classList.remove("disabled");
		document.getElementById('camp66-caption').classList.add("active");
		
		camp66 = findID(occupationPointsLayer, 'SLUG', '66');
		camp66[1].openPopup();
		camp66[1].setIcon(
			selectedIcon(camp66[1].feature)
		)
	}

	if (direction == 'up') {

		waypoint4Text.forEach(element => element.style.opacity = ".3");

		// REMOVE CAPTIONS
		document.getElementById('camp66-caption').classList.remove("active");
		document.getElementById('camp66-caption').classList.add("disabled");
		// ADD CAPTIONS
		// document.querySelector('#cgl-caption').classList.remove("disabled");
		// document.querySelector('#cgl-caption').classList.add("active");

		// ...
		camp66[1].closePopup();
		camp66[1].setIcon(
			whiteIcon(camp66[1].feature)
		)


	}
  },
  offset: window.innerHeight/2
})



var waypoint5Selector = '#show-camp44'
var waypoint5Text = document.querySelectorAll(waypoint5Selector + ' *');
var waypoint5 = new Waypoint({
  element: document.querySelector(waypoint5Selector),
  handler: function(direction) {

	if (direction == 'down') {

		console.log(occupationPointsLayer._layers);

		waypoint5Text.forEach(element => element.style.opacity = "1");

		// REMOVE CAPTIONS
		document.getElementById('camp66-caption').classList.remove("active");
		document.getElementById('camp66-caption').classList.add("disabled");
		// ADD CAPTIONS
		// document.querySelector('#cgl-caption').classList.remove("disabled");
		// document.querySelector('#cgl-caption').classList.add("active");
		
		camp44 = findID(occupationPointsLayer, 'SLUG', '44');
		camp44[1].openPopup();
		camp44[1].setIcon(
			selectedIcon(camp44[1].feature)
		)
	}

	if (direction == 'up') {

		waypoint5Text.forEach(element => element.style.opacity = ".3");

		// REMOVE CAPTIONS
		// document.getElementById('camp66-caption').classList.remove("active");
		// document.getElementById('camp66-caption').classList.add("disabled");
		// ADD CAPTIONS
		document.getElementById('camp66-caption').classList.remove("disabled");
		document.getElementById('camp66-caption').classList.add("active");
		
		// ...
		camp44[1].closePopup();
		camp44[1].setIcon(
			whiteIcon(camp44[1].feature)
		)


	}
  },
  offset: window.innerHeight/2
})


var waypoint6Selector = '#show-camp39'
var waypoint6Text = document.querySelectorAll(waypoint6Selector + ' *');
var waypoint6 = new Waypoint({
  element: document.querySelector(waypoint6Selector),
  handler: function(direction) {

	if (direction == 'down') {

		console.log(occupationPointsLayer._layers);

		waypoint6Text.forEach(element => element.style.opacity = "1");
		
		camp39 = findID(occupationPointsLayer, 'SLUG', '39');
		camp39[1].openPopup();
		camp39[1].setIcon(
			selectedIcon(camp39[1].feature)
		)
	}

	if (direction == 'up') {

		waypoint6Text.forEach(element => element.style.opacity = ".3");
		// ...
		camp39[1].closePopup();
		camp39[1].setIcon(
			whiteIcon(camp39[1].feature)
		)


	}
  },
  offset: window.innerHeight/2
})


var waypoint7Selector = '#show-camp27'
var waypoint7Text = document.querySelectorAll(waypoint7Selector + ' *');
var waypoint7 = new Waypoint({
  element: document.querySelector(waypoint7Selector),
  handler: function(direction) {

	if (direction == 'down') {

		console.log(occupationPointsLayer._layers);

		waypoint7Text.forEach(element => element.style.opacity = "1");
		
		camp27 = findID(occupationPointsLayer, 'SLUG', '27');
		camp27[1].openPopup();
		camp27[1].setIcon(
			selectedIcon(camp27[1].feature)
		)
	}

	if (direction == 'up') {

		waypoint7Text.forEach(element => element.style.opacity = ".3");
		// ...
		camp27[1].closePopup();
		camp27[1].setIcon(
			whiteIcon(camp27[1].feature)
		)


	}
  },
  offset: window.innerHeight/2
})


