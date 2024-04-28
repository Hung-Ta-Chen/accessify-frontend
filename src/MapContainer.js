import React, { useState, useRef } from "react";
import {
  GoogleMap,
  LoadScript,
  Marker,
  useLoadScript,
} from "@react-google-maps/api";
import LocatorButton from "./LocatorButton"; // Ensure this component is correctly imported

const containerStyle = {
  width: "100vw",
  height: "86vh",
};

const initialCenter = {
  lat: -34.397,
  lng: 150.644,
};

const API_KEY = "AIzaSyBLtwzy9EsFK_EqMlOoa_dB5TVGkSe4ggU";

function MapContainer() {
  const [map, setMap] = useState(null);
  const [center, setCenter] = useState(initialCenter);
  const [markers, setMarkers] = useState([]);

  // Function to handle the loading of the map
  const onLoad = (mapInstance) => {
    setMap(mapInstance);
  };

  // Function to handle map clicks and add markers
  const onMapClick = (event) => {
    setMarkers((currentMarkers) => [
      ...currentMarkers,
      { lat: event.latLng.lat(), lng: event.latLng.lng() },
    ]);
  };

  return (
    <LoadScript googleMapsApiKey={API_KEY} libraries={["places"]}>
      <GoogleMap
        mapContainerStyle={containerStyle}
        center={center}
        zoom={15}
        onLoad={onLoad}
        onClick={onMapClick}
      >
        {/* Load map components here */}
        {markers.map((marker, idx) => (
          <Marker key={idx} position={marker} />
        ))}
      </GoogleMap>
      {map && <LocatorButton map={map} />}
    </LoadScript>
  );
}

export default MapContainer;
