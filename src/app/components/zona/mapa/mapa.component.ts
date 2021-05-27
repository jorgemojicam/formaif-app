import { Component, OnInit } from '@angular/core';
import esriConfig from "@arcgis/core/config.js";
import MapView from "@arcgis/core/views/MapView";
import Map from "@arcgis/core/Map";
import GraphicsLayer from "@arcgis/core/layers/GraphicsLayer";
import Graphic from "@arcgis/core/Graphic";

esriConfig.apiKey = "AAPK7d8e7f5fbe484587845583d624ad5f4661U73yeiDt-rdiitWwxbj92mqQMGlhYgfJmb97ZZpalTLhniXfHunb8ajs2yB_44";

@Component({
  selector: 'app-mapa',
  templateUrl: './mapa.component.html',
  styleUrls: ['./mapa.component.scss']
})
export class MapaComponent implements OnInit {

  constructor(
    
  ) { }

  ngOnInit(): void {

    const map = new Map({
      basemap: "arcgis-topographic" //Basemap layer service
    });

    const graphicsLayer = new GraphicsLayer();
    map.add(graphicsLayer);

    
    const polygon = {
      type: "polygon",
      rings: [
        [-118.818984489994, 34.0137559967283], //Longitude, latitude
        [-118.806796597377, 34.0215816298725], //Longitude, latitude
        [-118.791432890735, 34.0163883241613], //Longitude, latitude
        [-118.79596686535, 34.008564864635],   //Longitude, latitude
        [-118.808558110679, 34.0035027131376]  //Longitude, latitude
      ]
    };
    const simpleFillSymbol = {
      type: "simple-fill",
      color: [227, 139, 79, 0.8],  // Orange, opacity 80%
      outline: {
        color: [255, 255, 255],
        width: 1
      }
    };
    const polygonGraphic = new Graphic({
      geometry: polygon,
      symbol: simpleFillSymbol,
    });

    graphicsLayer.add(polygonGraphic);

    const view = new MapView({
      container: "viewDiv",
      map: map,
      center: [-118.805, 34.027], // Longitude, latitude
      zoom: 13, // Zoom level
    });



  }

}
