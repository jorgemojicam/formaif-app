import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import esriConfig from "@arcgis/core/config.js";
import MapView from "@arcgis/core/views/MapView";
import Map from "@arcgis/core/Map";
import GraphicsLayer from "@arcgis/core/layers/GraphicsLayer";
import Graphic from "@arcgis/core/Graphic";
import Draw from "@arcgis/core/views/draw/Draw";
import Sketch from "@arcgis/core/widgets/Sketch";
import SketchViewModel from "@arcgis/core/widgets/Sketch";
esriConfig.apiKey = "AAPK7d8e7f5fbe484587845583d624ad5f4661U73yeiDt-rdiitWwxbj92mqQMGlhYgfJmb97ZZpalTLhniXfHunb8ajs2yB_44";
import esri = __esri; // Esri TypeScript Types

@Component({
  selector: 'app-mapa',
  templateUrl: './mapa.component.html',
  styleUrls: ['./mapa.component.scss']
})
export class MapaComponent implements OnInit {

  @ViewChild("mapViewNode", { static: true }) private mapViewEl: ElementRef;

  private _zoom = 15;

  private _center: Array<number> = [-73.11551918100278, 7.06165317851025];
  private _basemap = "topo";
  private _loaded = false;
  private _view: esri.MapView = null;

  constructor(

  ) { }

  async initializeMap() {
    const that = this
    try {

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

      });

      let sketchVM = new SketchViewModel({

        layer: graphicsLayer,
        view: this._view,
        visibleElements: {
          createTools: {
            point: false,
            circle: false,
            rectangle: false,
            polyline: false
          },
          selectionTools: {
            "lasso-selection": false
          },
        },
      });

      sketchVM.create("polygon", { mode: "freehand" });
      // listen to create event, only respond when event's state changes to complete
      sketchVM.on("create", function (event) {
        if (event.state === "complete") {
          // remove the graphic from the layer associated with the sketch widget
          // instead use the polygon that user created to query features that
          // intersect it.
          console.log(event.graphic.geometry)
          that.createPolygonGraphic(event.graphic.geometry);
          //selectFeatures(event.graphic.geometry);
        }
      });

      sketchVM.on("update", function (event) {
        if (event.state === "complete") {
          // remove the graphic from the layer associated with the sketch widget
          // instead use the polygon that user created to query features that
          // intersect it.
          console.log(event.graphics)          
          //selectFeastures(event.graphic.geometry);
        }
      });

      this._view.ui.add(sketchVM, "top-right");
      return this._view;
    } catch (error) {
      console.log("EsriLoader: ", error);
    }
  }

  ngOnInit(): void {
    const that = this
    this.initializeMap().then(mapView => {
      this._loaded = that._view.ready;
    });
  }

  createPolygonGraphic(polygon) {
    //this._view.graphics.removeAll();

    const simpleFillSymbol = {
      type: "simple-fill",
      color: [227, 139, 79, 0.8],  // Orange, opacity 80%
      outline: {
        color: "purple",
        width: 1
      }
    };
    let graphic = new Graphic({
      geometry: polygon,
      symbol: simpleFillSymbol,
    });

    this._view.graphics.add(graphic);
  }

  ngOnDestroy() {
    if (this._view) {
      // destroy the map view
      this._view.container = null;
    }
  }

}
