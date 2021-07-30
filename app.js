window.onload = ZoomGPS;

var map;
var untiled;
var tiled;
var crd;
var long;
var lat;
var pureCoverage = false;
      var format = 'image/png';
      var bounds = [-180, -90,
                    180, 83.65833282470703];
                    untiled = new ol.layer.Image({
                        source: new ol.source.ImageWMS({
                          ratio: 1,
                          url: 'http://localhost:8080/geoserver/geoSpatial/wms',
                          params: {'FORMAT': format,
                                   'VERSION': '1.1.1',  
                                "STYLES": '',
                                "LAYERS": 'geoSpatial:gadm36',
                                "exceptions": 'application/vnd.ogc.se_inimage',
                          }
                        })
                      });
                
                      tiled = new ol.layer.Tile({
                        visible: false,
                        source: new ol.source.TileWMS({
                          url: 'http://localhost:8080/geoserver/geoSpatial/wms',
                          params: {'FORMAT': format,
                                   'VERSION': '1.1.1',
                                   tiled: true,
                                "STYLES": '',
                                "LAYERS": 'geoSpatial:gadm36',
                                "exceptions": 'application/vnd.ogc.se_inimage',
                             tilesOrigin: -180 + "," + -90
                          }
                        })
                      });

                      var options = {
                        enableHighAccuracy: true,
                        timeout: 10000,
                        maximumAge: 0
                      };
                      
                      function success(pos) {
                        crd = pos.coords;
                      
                        console.log('Your current position is:');
                        console.log(`Latitude : ${crd.latitude}`);
                        console.log(`Longitude: ${crd.longitude}`);
                        console.log(`More or less ${crd.accuracy} meters.`);

                        init();
                      }
                      
                      function error(err) {
                        console.warn(`ERROR(${err.code}): ${err.message}`);
                      }

                      function ZoomGPS(){
                        navigator.geolocation.getCurrentPosition(success, error, options);
                      }
function init(){
    const mousePositionControl = new ol.control.MousePosition({
        coordinateFormat: ol.coordinate.createStringXY(4),
        projection: 'EPSG:4326',
        className: 'custom-mouse-position',
        target: document.getElementById('location'),
      });

     map = new ol.Map({
        controls: ol.control.defaults().extend([mousePositionControl]),
        target: 'map',
        layers: [
            new ol.layer.Tile({
                source: new ol.source.OSM()
              })
        ],
        view: new ol.View({
          center: ol.proj.fromLonLat([crd.longitude, crd.latitude]),
          zoom: 17
        })
      });
}


const OpenStreetMap = new ol.layer.Tile({
  source: new ol.source.OSM()
})

const StamenMap = new ol.layer.Tile({
  source: new ol.source.Stamen({layer: 'watercolor'})
})

const HumaniterianMap = new ol.layer.Tile({
    source: new ol.source.OSM({
        url: 'https://{a-c}.tile.openstreetmap.fr/hot/{z}/{x}/{y}.png'
    })
})


var worldMap = new ol.layer.Image({
  source: new ol.source.ImageWMS({
      url:'http://192.168.43.110:8080/geoserver/geoSpatial/wms', //url link for geoserver wms
      params:{'LAYERS':'geoSpatial:gadm36'},//same name as layer in geoserver
      serverType:'geoserver'

  })
});

function LayerTrigger(){
var strtView = document.getElementById("OpenStreetView");
var stamenView = document.getElementById("Stamen");
var humanView = document.getElementById("HMAP");
var meshView = document.getElementById("Mesh");

  if (strtView.checked == true) {
      map.removeLayer(StamenMap);
      map.removeLayer(worldMap);
      map.removeLayer(HumaniterianMap);
  }
  else if(stamenView.checked == true){
      StamenMap.setOpacity(1);
      map.addLayer(StamenMap);
      map.removeLayer(worldMap);
      map.removeLayer(HumaniterianMap);  
  }
  else if(humanView.checked == true){
    HumaniterianMap.setOpacity(1);
    map.addLayer(HumaniterianMap);
    map.removeLayer(worldMap);
    map.removeLayer(StamenMap);  
}
  else if(meshView.checked == true){
    worldMap.setOpacity(0.4);
    map.addLayer(worldMap);
    map.removeLayer(StamenMap);
    map.removeLayer(HumaniterianMap);  
}
}




