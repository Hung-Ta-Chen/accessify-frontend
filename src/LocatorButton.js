import React, { useState, useEffect, useContext } from "react";
import { Marker, Circle } from "@react-google-maps/api";
import MapContext from "./MapContext";

const LocatorButton = () => {
  const { map, setMap, markers, setMarkers, center, setCenter } =
    useContext(MapContext);

  const [userLocation, setUserLocation] = useState(null);
  const [accuracyRadius, setAccuracyRadius] = useState(0);

  // Callback function for getting the user location
  const getUserLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const location = {
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          };
          setUserLocation(location);
          setAccuracyRadius(position.coords.accuracy);
          setCenter(location);
        },
        () => {
          alert("Error: The Geolocation service failed.");
        }
      );
    } else {
      alert("Error: Your browser doesn't support geolocation.");
    }
  };

  // the icon for user location
  const blueDot = {
    fillColor: "#4285F4",
    fillOpacity: 1,
    path: "M10 10m-10 0a10 10 0 1 0 20 0 10 10 0 1 0 -20 0",
    scale: 1,
    strokeColor: "white",
    strokeWeight: 2,
    anchor: { x: 10, y: 10 },
  };

  return (
    <>
      <button
        onClick={getUserLocation}
        style={{ position: "absolute", top: "200px", left: "10px", zIndex: 1 }}
      >
        Current Location
      </button>
      {userLocation && (
        <>
          <Marker
            icon={blueDot}
            position={userLocation}
            map={map}
            title="You are here!"
          />
          <Circle
            center={userLocation}
            map={map}
            radius={accuracyRadius}
            options={{
              fillColor: "#4285F4",
              fillOpacity: 0.2,
              strokeColor: "#4285F4",
              strokeOpacity: 0.5,
              strokeWeight: 1,
            }}
          />
        </>
      )}
    </>
  );
};

export default LocatorButton;
