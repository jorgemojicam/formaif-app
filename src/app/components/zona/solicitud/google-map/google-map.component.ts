import { Component, OnInit } from '@angular/core';

declare const google: any;

@Component({
  selector: 'app-google-map',
  templateUrl: './google-map.component.html',
  styleUrls: ['./google-map.component.scss']
})
export class GoogleMapComponent implements OnInit {

  constructor() { }

  title = 'My first AGM project';
  drawingManager
  selectedShape

  lat = 51.678418;
  lng = 7.809007;
  pointList: { lat: number; lng: number }[] = [];
  allShapes = [];

  ngOnInit(): void {
  }

  click(event: any) {
    this.clearSelection()  
  }

  onMapReady(map) {
    this.initDrawingManager(map);
  }

  deleteSelectedShape() {
    if (!this.selectedShape) {
      alert("There are no shape selected");
      return;
    }
    var index = this.allShapes.indexOf(this.selectedShape);
    this.allShapes.splice(index, 1);
    this.selectedShape.setMap(null);
    console.log("allshapes after removing one", this.allShapes);
  }

  clearSelection() {
    if (this.selectedShape) {
      this.selectedShape.setEditable(false);
      this.selectedShape = null;
    }
  }

  getShapeCoords(shape) {
    var path = shape.getPath();
    var coords = [];
    for (var i = 0; i < path.length; i++) {
      coords.push({
        latitude: path.getAt(i).lat(),
        longitude: path.getAt(i).lng()
      });
    }
    return coords;
  }

  setSelection(shape) {
    this.clearSelection();
    this.selectedShape = shape;
    shape.setEditable(true);
  }

  initDrawingManager(map: any) {

    const self = this;
    const options = {
      drawingControl: true,
      center: {
        latitude: 19.997454,
        longitude: 73.789803
      },
      zoom: 10,
      stroke: {
        color: '#08B21F',
        weight: 2,
        opacity: 1
      },
      fill: {
        color: '#08B21F',
        opacity: 0.5
      },
      geodesic: true, // optional: defaults to false
      draggable: false, // optional: defaults to false
      clickable: false, // optional: defaults to true
      editable: false, // optional: defaults to false
      visible: true, // optional: defaults to true
      control: {},
      refresh: "refreshMap",
      options: {
        scrollwheel: true
      },
      Polygon: {
        visible: true,
        editable: true,
        draggable: true,
        geodesic: true,
        stroke: {
          weight: 3,
          color: 'red'
        }
      },
      source: {
        id: 'source',
        coords: {
          'latitude': 19.9989551,
          'longitude': 73.75095599999997
        },
        options: {
          draggable: false,
        }
      },
      isDrawingModeEnabled: true,
      drawingControlOptions: {
        drawingModes: ['polygon'],
      },
      polygonOptions: {
        fillColor: '#BCDCF9',
        strokeColor: '#57ACF9',
        fillOpacity: 0.5,
        strokeWeight: 2,
        clickable: false,
        editable: true,
        zIndex: 1
      },
      drawingMode: google.maps.drawing.OverlayType.POLYGON,
    };
    self.allShapes = [];

    this.drawingManager = new google.maps.drawing.DrawingManager(options);

    google.maps.event.addListener(this.drawingManager, 'overlaycomplete', (event) => {

      this.drawingManager.setDrawingMode(null);
      let newShape = event.overlay;

      console.log('shape coords added', self.getShapeCoords(newShape));
      newShape.setOptions({
        clickable: true
      });
      newShape.type = event.type;
      google.maps.event.addListener(newShape, 'click', function () {
        self.setSelection(newShape);
        google.maps.event.addListener(newShape.getPath(), 'insert_at', function () {
          //alert('updated shape, go update it in your db');
          console.log("allshapes index updated =");
          self.allShapes.indexOf(newShape)
        });
        google.maps.event.addListener(newShape.getPath(), 'set_at', function () {
          self.getShapeCoords(newShape)
          console.log('shape coords updated');
          //alert('updated shape, go update it in your db');
        });
      });
      self.allShapes.push(newShape);
      console.log("all shapes array", self.allShapes);
      console.log("first coords", self.getShapeCoords(self.allShapes[0]));
      //after drawing = set selected
      self.setSelection(newShape);

    });
    google.maps.event.addListener(this.drawingManager, 'drawingmode_changed', self.clearSelection);

    this.drawingManager.setMap(map);

    //google.maps.event.addListener(map, 'click', self.clearSelection);


  }

}
