import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import esriConfig from "@arcgis/core/config.js";
import MapView from "@arcgis/core/views/MapView";
import Map from "@arcgis/core/Map";
import GraphicsLayer from "@arcgis/core/layers/GraphicsLayer";
import Graphic from "@arcgis/core/Graphic";
import Sketch from "@arcgis/core/widgets/Sketch";
esriConfig.apiKey = "AAPK7d8e7f5fbe484587845583d624ad5f4661U73yeiDt-rdiitWwxbj92mqQMGlhYgfJmb97ZZpalTLhniXfHunb8ajs2yB_44";

import { loadModules } from "esri-loader";
import esri = __esri; // Esri TypeScript Types

@Component({
  selector: 'app-mapa',
  templateUrl: './mapa.component.html',
  styleUrls: ['./mapa.component.scss']
})
export class MapaComponent implements OnInit {

  @ViewChild("mapViewNode", { static: true }) private mapViewEl: ElementRef;

  private _zoom = 15;

  private _center: Array<number> = [-73.11551918100278,7.06165317851025];
  private _basemap = "topo";
  private _loaded = false;
  private _view: esri.MapView = null;
  private _poligon

  constructor(

  ) { }

  async initializeMap() {
    try {
      // Load the modules for the ArcGIS API for JavaScript
      /*
      const [EsriMap, EsriMapView] = await loadModules([
        "esri/Map",
        "esri/views/MapView"
      ]);
      */

      // Configure the Map
      const mapProperties: esri.MapProperties = {
        basemap: this._basemap
      };

      const map: esri.Map = new Map(mapProperties);

      const graphicsLayer = new GraphicsLayer();
      map.add(graphicsLayer);

      // Initialize the MapView
      const mapViewProperties: esri.MapViewProperties = {
        container: this.mapViewEl.nativeElement,
        center: this._center,
        zoom: this._zoom,
        map: map
      };

      this._view = new MapView(mapViewProperties);

      await this._view.when(() => {
        const sketch = new Sketch({
          layer: graphicsLayer,
          view: this._view,
          // graphic will be selected as soon as it is created
          creationMode: "update"
        });

        this._view.ui.add(sketch, "top-right");
      }); 

      this._view.on("click", function(evt) {
        console.log(evt)
      })

      return this._view;
    } catch (error) {
      console.log("EsriLoader: ", error);
    }
  }

  ngOnInit(): void {

    this.initializeMap().then(mapView => {
      // The map has been initialized
      console.log("mapView ready: ", this._view.ready);
      console.log("puntos: ", this._view.viewpoint.targetGeometry);
      console.log("mapView ",mapView)
      this._loaded = this._view.ready;
    });
    


    /*
    const map = new Map({
      basemap: "arcgis-topographic"
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

    view.when(() => {
      const sketch = new Sketch({
        layer: graphicsLayer,
        view: view,
        // graphic will be selected as soon as it is created
        creationMode: "update"
      });

      view.ui.add(sketch, "top-right");
    });
*/
  }

  ngOnDestroy() {
    if (this._view) {
      // destroy the map view
      this._view.container = null;
    }
  }

}
