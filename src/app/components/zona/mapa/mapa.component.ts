import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import esriConfig from "@arcgis/core/config.js";
import MapView from "@arcgis/core/views/MapView";
import Map from "@arcgis/core/Map";
import GraphicsLayer from "@arcgis/core/layers/GraphicsLayer";

import Graphic from "@arcgis/core/Graphic";
import Sketch from "@arcgis/core/widgets/Sketch";

esriConfig.apiKey = "AAPK7d8e7f5fbe484587845583d624ad5f4661U73yeiDt-rdiitWwxbj92mqQMGlhYgfJmb97ZZpalTLhniXfHunb8ajs2yB_44";
import esri = __esri;
import { MatDialog } from '@angular/material/dialog';
import { ModalInfomapComponent } from '../modal-infomap/modal-infomap.component';

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

  animal: string;
  name: string;

  constructor(public dialog: MatDialog) { }

  async initializeMap() {

    const that = this
    try {
      // Configure the Map
      const mapProperties: esri.MapProperties = {
        basemap: this._basemap,
      };
      const map: esri.Map = new Map(mapProperties);
      const graphicsLayer = new GraphicsLayer();
      map.add(graphicsLayer);

      const mapViewProperties: esri.MapViewProperties = {
        container: this.mapViewEl.nativeElement,
        center: this._center,
        zoom: this._zoom,
        map: map
      };

      this._view = new MapView(mapViewProperties);

      await this._view.when(() => {

      });

      let sketch = new Sketch({

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

      sketch.create("polygon", { mode: "click" });

      sketch.on("create", function (event) {
        if (event.state === "complete") {
          that.openDialog(event.graphic.geometry)
          console.log("lo creo->", event.graphic.geometry)      
        }
      });

      sketch.on("update", function (event) {
        if (event.state === "complete") {

          console.log("lo modifico->", event.graphics) 
          //that.updatePolygonGraphic( graphics[0].attributes[0])
          //selectFeastures(event.graphic.geometry);
        }
      });

      this._view.ui.add(sketch, "top-right");
      return this._view;
    } catch (error) {
      console.log("EsriLoader: ", error);
    }
  }

  openDialog(graph): void {
    const that = this
    const dialogRef = this.dialog.open(ModalInfomapComponent, {
      width: '500px',
      data: { name: this.name, animal: this.animal }
    });

    dialogRef.afterClosed().subscribe(result => {
      
      if (result.data) {
        const attributes = {
          Name: result.data.titulo,
          Description: result.data.descripcion
        }
        let color = result.data.color
        that.createPolygonGraphic(graph, attributes, color);
      }
    });
  }

  ngOnInit(): void {
    const that = this
    this.initializeMap().then(mapView => {
      this._loaded = that._view.ready;
    });
  }

  createPolygonGraphic(polygon, attributes, color) {
    //this._view.graphics.removeAll();
    const popupTemplate = {
      title: "{Name}",
      content: "{Description}"
    }
    const opacity = [parseInt(color.slice(-6, -4), 16), parseInt(color.slice(-4, -2), 16), parseInt(color.slice(-2), 16), 0.6];
    console.log(opacity)
    const simpleFillSymbol = {
      type: "simple-fill",
      color: opacity,
      outline: {
        color: color,
        width: 1
      }
    };
    let graphic = new Graphic({
      geometry: polygon,
      symbol: simpleFillSymbol,
      attributes: attributes,
      popupTemplate: popupTemplate
    });

    this._view.graphics.add(graphic);
  }


  updatePolygonGraphic(polygon,description) {
    
    for (let gL =0; gL< this._view.graphics.length; gL++){
      if ( this._view.graphics[gL].attributes[0] == description){
        this._view.graphics.remove(this._view.graphics[gL]);        
      }
    }
/*
    const popupTemplate = {
      title: "{Name}",
      content: "{Description}"
    }
    const opacity = [parseInt(color.slice(-6, -4), 16), parseInt(color.slice(-4, -2), 16), parseInt(color.slice(-2), 16), 0.6];
    console.log(opacity)
    const simpleFillSymbol = {
      type: "simple-fill",
      color: opacity,
      outline: {
        color: color,
        width: 1
      }
    };
    let graphic = new Graphic({
      geometry: polygon,
      symbol: simpleFillSymbol,
      attributes: attributes,
      popupTemplate: popupTemplate
    });

    this._view.graphics.add(graphic);
    */
  }

  ngOnDestroy() {
    if (this._view) {
      // destroy the map view
      this._view.container = null;
    }
  }



}
