/* global L:false document:false $:false */
// that first line stops your editor form complaining about these variables
// being undefined, but it will still get mad at you if you accidentlaly try to change
// their values (which you must not do!!)
// `L` is the global Leaflet API object, which must be defined before this
// script is loaded
// `document` is of course the HTML document
// $ is the jQuery object (actually we're not using it here at the moment)
// but just in case you would like to make use of it, it's available


///////////////////////////////////////////////
// VARS!! VARS!! VARS!! VARS!! VARS!! VARS!! //
///////////////////////////////////////////////

//////////////////////////
// Globally Scoped Vars //
//////////////////////////

// In order to access map data, we need some of these variables to
// be defined in global scope. In some cases we can assign values here;
// in others we'll wait till we run the initialization function
// we do this here to make sure we can access them
// whenever we need to -- they have 'global scope'

// map initialization variables
let projectMap, // this will hold the map once it's initialized
    myCenter =  [ 44.6605, -63.6070 ], // *latitude*, then longitude
    myZoom = 14; // set your preferred zoom here. higher number is closer in.
                // I set the zoom wide to give access to context before zooming in


// I'm complicating things a bit with this next set of variables, which will help us
// to make multi-colored markers
// color options are red, blue, green, orange, yellow, violet, grey, black
// just substitute the color name in the URL value (just before `.png`)
const greenURL = 'https://cdn.rawgit.com/pointhi/leaflet-color-markers/master/img/marker-icon-green.png',
      yellowURL = 'https://cdn.rawgit.com/pointhi/leaflet-color-markers/master/img/marker-icon-yellow.png',
      greyURL = 'https://cdn.rawgit.com/pointhi/leaflet-color-markers/master/img/marker-icon-grey.png';

// create new icon classes
// I've added this just in case you want very fine control over your marker placement
const myIconClass = L.Icon.extend({
    options: {
        shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
        iconSize: [25, 41],
        iconAnchor: [12, 41],
        popupAnchor: [1, -34],
        shadowSize: [41, 41]
    }});
// create the new icon types -- cf. https://leafletjs.com/examples/custom-icons/ and
// also https://leafletjs.com/reference-1.5.0.html#icon
const schoolIcon = new myIconClass({iconUrl: yellowURL}),
      churchIcon = new myIconClass({iconUrl: greenURL}),
      railwayIcon = new myIconClass({iconUrl: greyURL});


// storing colors in variables, to make it easier to change all the related features at once
let schoolCol = 'yellow',
    churchCol = 'green',
    africvilleCol = 'grey',
    hospitalCol = 'rgb(40,40,120)',
    railwayCol = 'blue';

///////////////////////////////////////////////////////////////////////
// CHANGE THESE VARIABLE NAMES AND THEIR VALUES TO SUIT YOUR PROJECT //
///////////////////////////////////////////////////////////////////////



//////////////////////////////////////////////////////////
// DATA DATA DATA DATA                                  //
// DATA DATA DATA DATA                                  //
//////////////////////////////////////////////////////////


//////////////////////////////////
// MAP DATA PART 1: MARKER INFO //
//////////////////////////////////

///////////////////////////////
// YOU NEED TO CHANGE THESE! //
///////////////////////////////

// These are placeholder arrays; we use them to generate other JS variables
// that will be more useful to us later on
// but writing them this way keeps the code as D.R.Y. as possible
let churchMarkerInfo =
    [
        {position: [44.67173538250303, -63.620238304138184],
            title: "Seaview United Baptist Church",
            description: '<p>Built by the Africville community, it was the center of life and many members were baptised in the nearby water of Bedford Basin.</p>'
        },
        {position: [44.6684087060401, -63.61946582794189],
            title: "Rockwood Prison",
            description: `<p>This prison was located near the Africville community after the residents of Halifax criticized its construction near Halifax.</p>`
        },
        {position: [44.66950744598924, -63.61963748931885],
         title: "Infectious Diseases Hospital",
         description: `<p>Another structure Haligonians refused to have near their city. This hospital was instead built near Africville.</p>`
        },
        {position: [44.67167434428751, -63.62053871154786],
         title: "Railway Lines",
         description: "<p>The government built these railway lines for freight trains, in the midst of Africville, displacing and destroying several properties. Some house owners were not compesated for their loss.</p>"
        },
        {position: [44.671765901586674, -63.616805076599114],
         title: "Africville School",
         icon: railwayIcon,
         description: `<p>Buiilt by Africville residents for Africville students. This school survived until the 1950's when Nova Scotia desegregation ended the existence of segregated schools.</p>`}
    ],
    africvilleNow =
    [{position: [44.67374960755104, -63.61946582794189],
      title: "Africville Museum",
      description: "<p>The Africville Museum exists in a replica of the Seaview Church. The Church was built as part of the City of Halifax's apology to the residents of Africville.</p>"
     }];


let africvilleNowMarkers = processMarkerLayer(africvilleNow,
                                     {description: 'Africville in the 21st century', defaultIcon: schoolIcon}),
    africvilleThenMarkers = processMarkerLayer(churchMarkerInfo,
                                      {description: 'Africville Before to its Destruction', defaultIcon: churchIcon});



//////////////////////////////
// MAP DATA PART 2: GEOJSON //
//////////////////////////////

// With this powerful feature you can add arbitrary
// data layers to your map.  It's cool. Learn more at:
// https://leafletjs.com/examples/geojson/
// but essentially: we can add all kinds of features here, including polygons and other shapes
// you can create geoJSON layers here: http://geojson.io/
// and learn more about the format here: https://en.wikipedia.org/wiki/GeoJSON
// to set the line and fill color, you will need to set the `myColor` property as below. 
const africvilleData={
    "type": "FeatureCollection",
    "description": "The Neighborhood of Africville",
  "features": [
    {
      "type": "Feature",
        "properties": {myColor: africvilleCol, title: "Region", description: "Africville before it was razed in 1969." },
      "geometry": {
        "type": "Polygon",
        "coordinates": [
          [ [ -63.6157214641571, 44.676122335885175 ], [ -63.61589312553406, 44.676122335885175 ], [ -63.61697137355804, 44.675786650316766 ], [ -63.61728250980377, 44.675687470117595 ], [ -63.617438077926636, 44.675630250694695 ], [ -63.617556095123284, 44.67558828974866 ], [ -63.61786723136902, 44.675450962803765 ], [ -63.61814081668853, 44.67548147993075 ], [ -63.618677258491516, 44.67538229920926 ], [ -63.618972301483154, 44.67525641574139 ], [ -63.61961603164673, 44.674966501260116], [ -63.62007737159729, 44.67463080899613], [ -63.62072110176087, 44.67381445833061], [ -63.62087666988372, 44.67332998310574], [ -63.621021509170525, 44.673154502891265], [ -63.6222767829895, 44.672788281601655], [ -63.6236447095871, 44.67331472397775], [ -63.62427234649658, 44.67227709384862], [ -63.62465858459473, 44.671624750690114], [ -63.625023365020745, 44.67152937826808], [ -63.62532377243042, 44.67162856558371], [ -63.62626791000366, 44.670007213171736], [ -63.62708330154418, 44.66859946099759], [ -63.62869262695312, 44.66580865337823], [ -63.62913250923156, 44.66593074209955], [ -63.62919688224792, 44.665820099206776], [ -63.62915933132171, 44.66580865337823], [ -63.62919688224792, 44.66574188599999], [ -63.62927198410034, 44.665755239481804], [ -63.62937122583389, 44.665707548461256], [ -63.629462420940406, 44.665615981591806], [ -63.62965285778046, 44.665322203575954], [ -63.62989693880081, 44.66489297977218], [ -63.63037973642349, 44.66405169189775], [ -63.630540668964386, 44.664003999475696], [ -63.63063722848892, 44.66379415235255], [ -63.630771338939674, 44.663767444482396], [ -63.62839221954345, 44.66245683602301], [ -63.62654685974121, 44.66254840788247], [ -63.62302780151367, 44.66245683602301], [ -63.619680404663086, 44.66624168565023], [ -63.616504669189446, 44.67191849676381], [ -63.61538887023926, 44.67338339002207], [ -63.614466190338135, 44.6745583297293], [ -63.614251613616936, 44.67579618686543], [ -63.61445814371109, 44.675670304296666], [ -63.61468344926834, 44.675630250694695], [ -63.6153244972229, 44.675807630721756], [ -63.615469336509705, 44.67601361974923], [ -63.61554712057114, 44.67608418989579], [-63.6157214641571, 44.676122335885175]]
        ]
      }
    }
  ]
}

let towns = processJSONLayer(africvilleData)

////////////////////////////////////////////////////////
// MAP DATA PART 3: DIRECT CREATION OF SHAPE OVERLAYS //
////////////////////////////////////////////////////////



////////////////////////////////////////////////
// array of all the layers!!!!!!!
// these layers will be added to the map
// you should change these variable names
// to align with the variables you've defiend above
let allLayers = [africvilleNowMarkers, africvilleThenMarkers, towns];


///////////////////////////////////////
// END DATA!!  END DATA!! END DATA!! //
///////////////////////////////////////

//////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////


/////////////////////////////////////////////
// FUNCTIONS FUNCTIONS FUNCTIONS FUNCTIONS //
/////////////////////////////////////////////


/**
 * create a Leaflet map inside an element, add base layer and return the map as a return value
 * @param {HTMLElement|string} element: can be either a full HTMLElement or the ID attribute
 * of a DOM node
 * @returns {Object} a Leaflet map object 
 */
function createMap (element) {
    const map = L.map(element, {renderer:L.canvas(), preferCanvas: true}).setView(myCenter, myZoom);
    // now we add the base layer
    // you can change this if you want!
    // if your tiles seem to load very slowly, you may want to generate your own accessToken
    // and insert the value in `accessToken`, below. 
    // see: https://docs.mapbox.com/help/how-mapbox-works/access-tokens/#creating-and-managing-access-tokens
    // to change the tile layer, change the `id` attribute below.
    // some valid options include: mapbox/streets-v11, mapbox/light-v10, mapbox/satellite-v9, mapbox/satellite-streets-v11 mapbox/dark-v10, mapbox/outdoors-v11
    L.tileLayer('https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}', {
	attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors, <a href="https://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
	maxZoom: 18,
	id: 'mapbox/dark-v10',
        tileSize: 512,
        zoomOffset: -1,
	accessToken: 'pk.eyJ1IjoidGl0YW5pdW1ib25lcyIsImEiOiJjazF0bTdlNXQwM3gxM2hwbXY0bWtiamM3In0.FFPm7UIuj_b15xnd7wOQig'
    })
        .addTo(map);
    return map
}


/**
 * Add Markers to a "layerGroup" and return the populated object
 * @param {Array.<Object>} markerInfo
 * @param {string} markerInfo[].title
 * @param {Array|Object} markerInfo[].position
 * @param {Object} layerGroup
 * @returns {Object} the modified layerGroup object 
 */
function processMarkerLayer (markerInfo, options) {
    let layerGroup = L.layerGroup([], options);
    // iterate over the marker info array, adding to the main marker layer but
    // *also* to another layer if the icon property is set. 
    for (const m of markerInfo) {
        // define a Leaflet marker object for each marker
        // we pass two parameters: a position (2-value array of lat & lng vals)
        // and an object containing marker propertie
        let marker =  L.marker (m.position, {
            // We set the icon 
            icon:   m.icon || layerGroup.options.defaultIcon || L.Icon(),
            title: m.title,
            description: m.description,
            windowContent: m.windowContent //this is obsolete
        });
        let t = assembleTexts(marker);
        marker.bindPopup(t.popup);
        // this seems to be unnecessary on modern browsers for some reason
        //marker.bindTooltip(t.tooltip);
        layerGroup.addLayer(marker);
    }
    return layerGroup;
}

/**
 * create a geoJSON layer and return the geoJSON layer object.
 * If the featureGroup has the non-standard property
 * 'description' it will be explicitly set on the returned object as well.
 * If an individual feature has the property feature.properties.title,
 * then the options.title property will be set on the resultant layer
 * for compatibility with marker layers.
 * The custom property `feature.properties.myColor` will also be used to set line and
 * fill colors.
 * 
 * @param {GeoJSON} jsonData
 * @returns {Object} the newly-created geoJSON layer 
 */
function processJSONLayer (jsonData) {
    return L.geoJSON(jsonData, {
        // the 'style' option is a *function* that modifies some
        // feature properties.  
        // cf https://leafletjs.com/reference-1.5.0.html#geojson-style
        style: function(feature) {
            let c = feature.properties.myColor;
            return {color: c, weight: 3, fillColor: c, fillOpacity: 0.5};
        },
        onEachFeature: function (feature, layer) {
            layer.options.description = '';
            if (feature.properties ) {
                if (feature.properties.title) {
                    layer.options.title = feature.properties.title;
                }
                if (feature.properties.description) {
                    layer.options.description = feature.properties.description;
                }
            }
            let t = assembleTexts(layer);
            layer.bindPopup(t.popup);
            layer.bindTooltip(t.tooltip, {sticky: true});
        },
        description: jsonData.description || "GeoJSON Objects"
    });
}

/**
 * create a layerGroup from an array of individual Layer objects.
 * If the non-standard options `windowContent`, `title`, and/or `description` have been
 * set, they will be used to create a popup window and tooltip now, and
 * to generate legend text in `addLayerToLegendHTML` later on.
 * The `options` parameter should include a `description` property,
 * (NOTE: this is *separate* from the description of the individual layers!!)
 * which will also be used by `addLayerToLegendHTML` and in the layers
 * control box. 
 * @param {} layerArray
 * @param {} options
 * @returns {} 
 */
function processManualLayers (layerArray, options = {description: 'Unnamed Layer'}) {
    for (const l of layerArray) {
        let t = assembleTexts(l);
        l.bindPopup(t.popup);
        l.bindTooltip(t.tooltip, {sticky: true});
    }
    return L.layerGroup(layerArray, options)
}


function assembleTexts (feature) {
    let opts = feature.options,
        tooltip = 'Untitled Tooltip',
        popup = '<h2>Untitled</h2>',
        legend = 'Untitled';
    
    if (opts.title) {
        popup = `<h2>${opts.title}</h2>` + (opts.description || '');
        tooltip = opts.title;
        legend = opts.title;
    }
    if (opts.windowContent) {
        popup = opts.windowContent;
    }
    return {tooltip: tooltip, popup: popup, legend: legend};
}
/**
 * For every element of `layerGroup`, add an entry to the innerHTML of
 * the element matched by `querySelector`, consisting of a div whose
 * `onclick` attribute is a call to `locateMapFeature` which navigates to, and
 * opens the popup window of, that feature.  The link text will be one of `options.infoHTML`,
 * `options.title`, or 'no title', in that order.
 * @param {Array} layerGroup
 * @param {string} querySelector
 * @returns {string} innerHTML content of the legend element 
 */
function addLayerToLegendHTML (layerGroup, el) {
    let output = `<div class="legend-content-group-wrapper"><h2>${layerGroup.options.description}</h2>`;
    for (let l in layerGroup._layers) {
        // this is hideously ugly! very roundabout way
        // to access anonymous marker from outside the map
        let current = layerGroup._layers[l];
        let info = assembleTexts(current).legend;
        output +=  `
<div class="pointer" onclick="locateMapFeature(projectMap._layers[${layerGroup._leaflet_id}]._layers[${l}])"> 
    ${info} 
</div>`;
    }
    output += '</div>'
    el.innerHTML += output;
    return el.innerHTML
}

/* a function that will run when the page loads.  It creates the map
   and adds the existing layers to it. You probably don't need to change this function; 
   instead, change data and variable names above, or change some of the helper functions that
   precede this function.
 */
async function initializeMap() {

    // this one line creates the actual map
    // it calls a simple 2-line function defined above
    projectMap = createMap('map_canvas');
    // set the legend location
    let legendEl = document.querySelector('#map_legend');

    let layerListObject = {};
    // add markers to map and to legend, then add a toggle switch to layers control panel
    for (let l of allLayers) {
        l.addTo(projectMap);
        addLayerToLegendHTML(l, legendEl);
        layerListObject[l.options.description] = l;
    }

   // add a layers control to the map, using the layer list object
    // assigned above
    L.control.layers(null, layerListObject).addTo(projectMap);

    // You'll want to comment this out before handing in, but it makes life a bit easier.
    // while you're developing
    coordHelp();
}

/**
 * pan to object if it's a marker; otherwise use the `fitBounds` method on the feature
 * Then open the marker popup.
 * @param {Object} marker
 */
function locateMapFeature (marker) {
    marker.getLatLng ? projectMap.panTo(marker.getLatLng(), {animate: true, duration: 1.5}).setZoom(16) : projectMap.fitBounds(marker.getBounds()); 
    marker.openPopup();
}

function coordHelp () {
    projectMap.on('click', function(e) {
        console.log("Lat, Lon : [ " + e.latlng.lat + ", " + e.latlng.lng + " ]")
    });
}

function resetMap (map) {
    map.setView(myCenter, myZoom).closePopups()
}
