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
  selectedArea = 0;

  ngOnInit(): void {
  }

  onMapReady(map) {
    this.initDrawingManager(map);
  }

  updatePointList(path) {
    this.pointList = [];
    const len = path.getLength();
    for (let i = 0; i < len; i++) {
      this.pointList.push(
        path.getAt(i).toJSON()
      );
    }
    console.log(path.getArray());
    this.selectedArea = google.maps.geometry.spherical.computeArea(
      path
    );
  }

  deleteSelectedShape() {
    if (this.selectedShape) {
      this.selectedShape.setMap(null);
      this.selectedArea = 0;
      this.pointList = [];
      // To show the controls:
      this.drawingManager.setOptions({
        drawingControl: true,
      });
    }
  }


  initDrawingManager = (map: any) => {
    const self = this;
    const options = {
      drawingControl: true,
      drawingControlOptions: {
        drawingModes: ['polygon'],
      },
      polygonOptions: {
        draggable: true,
        editable: true,
        delete: true
      },
      drawingMode: google.maps.drawing.OverlayType.POLYGON,
    };
    this.drawingManager = new google.maps.drawing.DrawingManager(options);
    this.drawingManager.setMap(map);

    google.maps.event.addListener(

      this.drawingManager, 'overlaycomplete', (event) => {

        if (event.type === google.maps.drawing.OverlayType.POLYGON) {
          const paths = event.overlay.getPaths();
          for (let p = 0; p < paths.getLength(); p++) {

            //   google.maps.event.addListener(paths.getAt(p),'set_at',() => {
            //       if (!event.overlay.drag) {
            //         self.updatePointList(event.overlay.getPath());
            //       }
            //     }
            //   );
            //   google.maps.event.addListener(
            //     paths.getAt(p),'insert_at',() => {
            //       self.updatePointList(event.overlay.getPath());
            //     }
            //   );
            //   google.maps.event.addListener(
            //     paths.getAt(p),'remove_at',() => {
            //       self.updatePointList(event.overlay.getPath());
            //     }
            //   );
          }
          self.updatePointList(event.overlay.getPath());
        }
        // if (event.type !== google.maps.drawing.OverlayType.MARKER) {
        //   // Switch back to non-drawing mode after drawing a shape.
        //   self.drawingManager.setDrawingMode(null);
        //   // To hide:
        //   self.drawingManager.setOptions({
        //     drawingControl: false,
        //   });
        // }
      }
    );
  }

}
