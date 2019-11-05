import React, { Component } from 'react';

class Map extends Component {

  initMap = () => {
    let markers = [];
    let placesAutocomplete = places( {
        appId     : process.env.ALGOLIA_APPID,
        apiKey    : process.env.ALGOLIA_APIKEY,
        container : document.querySelector( '#input-map' ),
    } ).configure( {
        countries         : ['fr'],
        useDeviceLocation : false
    } );

    let map = L.map( 'map-example-container', {
        scrollWheelZoom : true,
        zoomControl     : true
    } );

    let osmLayer = new L.TileLayer( 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        minZoom     : 8,
        maxZoom     : 19,
        attribution : 'Map © <a href="https://openstreetmap.org">OpenStreetMap</a>'
    } );

    map.setView( new L.LatLng( -21.329519, 55.471617 ), 1 );
    map.addLayer( osmLayer );

    placesAutocomplete.on( 'suggestions'  , handleOnSuggestions   );
    placesAutocomplete.on( 'cursorchanged', handleOnCursorchanged );
    placesAutocomplete.on( 'change'       , handleOnChange        );
    placesAutocomplete.on( 'clear'        , handleOnClear         );

    function handleOnSuggestions( e ) {
        markers.forEach( removeMarker );
        markers = [];
        if ( e.suggestions.length === 0 ) {
            map.setView( new L.LatLng( 0, 0 ), 1 );
            return;
        }
        e.suggestions.forEach( addMarker );
        findBestZoom();
    }

    function handleOnChange( e ) {
        markers.forEach( function ( marker, markerIndex ) {
            if ( markerIndex === e.suggestionIndex ) {
                markers = [marker];
                marker.setOpacity( 1 );
                findBestZoom();
            } else {
                removeMarker( marker );
            }
        } );
        document.querySelector('#gps').value = e.suggestion.latlng.lat + ',' + e.suggestion.latlng.lng;
    }

    function handleOnClear() {
        map.setView( new L.LatLng( 0, 0 ), 1 );
        markers.forEach( removeMarker );
    }

    function handleOnCursorchanged( e ) {
        markers.forEach( function ( marker, markerIndex ) {
            if ( markerIndex === e.suggestionIndex ) {
                marker.setOpacity( 1 );
                marker.setZIndexOffset( 1000 );
            } else {
                marker.setZIndexOffset( 0 );
                marker.setOpacity( 0.5 );
            }
        } );
    }

    function addMarker( suggestion ) {
        let marker = L.marker( suggestion.latlng, {
            opacity: .4
        } );
        marker.addTo( map );
        markers.push( marker );
    }

    function removeMarker( marker ) {
        map.removeLayer( marker );
    }

    function findBestZoom() {
        let featureGroup = L.featureGroup( markers );
        map.fitBounds( featureGroup.getBounds().pad( 0.5 ), {
            animate: false
        } );
    }
}
}

// import React, { Component } from 'react';
// import { Map as LMap, TileLayer, Marker, Popup } from 'react-leaflet';

// class Map extends Component {
//   constructor() {
//     super();
//     this.state = {
//       lat: -21.329519,
//       lng: 55.471617,
//       zoom: 9,
//     };
//   }


// //   var map = L.map('map', {
// //     // Set latitude and longitude of the map center (required)
// //     center: [37.7833, -122.4167],
// //     // Set the initial zoom level, values 0-18, where 0 is most zoomed-out (required)
// //     zoom: 10
// // });

// // L.control.scale().addTo(map);

// // // Create a Tile Layer and add it to the map
// // //var tiles = new L.tileLayer('http://{s}.tile.stamen.com/watercolor/{z}/{x}/{y}.png').addTo(map);
// // L.tileLayer('http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
// //     attribution: '&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
// //   }).addTo(map);

// //   var searchControl = new L.esri.Controls.Geosearch().addTo(map);

// //   var results = new L.LayerGroup().addTo(map);

// //   searchControl.on('results', function(data){
// //     results.clearLayers();
// //     for (var i = data.results.length - 1; i >= 0; i--) {
// //       results.addLayer(L.marker(data.results[i].latlng));
// //     }
// //   });

// // setTimeout(function(){$('.pointer').fadeOut('slow');},3400);

//   render() {
//     const position = [this.state.lat, this.state.lng];
//     return (
//             <LMap center={position} zoom={this.state.zoom}>
//                 <TileLayer
//                 attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
//                 url='http://{s}.tile.osm.org/{z}/{x}/{y}.png'
//                 />
//                 <Marker position={position}>
//                 <Popup>
//                     <span>A pretty CSS3 popup. <br/> Easily customizable.</span>
//                 </Popup>
//                 </Marker>
//             </LMap>
//     );
//   }
// }

// export default Map;

// // window.ReactDOM.render(<Map/>, document.getElementById('mapContainer'));