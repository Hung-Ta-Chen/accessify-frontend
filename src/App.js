import React, { useState } from "react";
import "./App.css";
import MapContainer from "./MapContainer";
import Header from "./Header";
import MapContext from "./MapContext";

const initialCenter = {
  lat: -34.397,
  lng: 150.644,
};

function App() {
  const [map, setMap] = useState(null);
  const [center, setCenter] = useState(initialCenter);
  const [markers, setMarkers] = useState([]);

  return (
    <MapContext.Provider
      value={{ map, setMap, markers, setMarkers, center, setCenter }}
    >
      <div className="App">
        <Header />
        <MapContainer />
      </div>
    </MapContext.Provider>
  );
}

export default App;
