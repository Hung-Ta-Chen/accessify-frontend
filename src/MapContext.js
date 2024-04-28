import React, { createContext } from "react";

// Define a context for holding the map instances
const MapContext = createContext({
  map: null,
  setMap: () => {},
  markers: null,
  setMarkers: () => {},
  center: null,
  setCenter: () => {},
});

export default MapContext;
