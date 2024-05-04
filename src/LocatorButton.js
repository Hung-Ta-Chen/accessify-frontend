import React, { useState, useEffect, useContext } from "react";
import { Marker } from "@react-google-maps/api";
import MapContext from "./MapContext";

const LocatorButton = ({ handleNearbySearch }) => {
  const {
    map,
    setMap,
    markers,
    setMarkers,
    center,
    setCenter,
    selectedMarker,
    setSelectedMarker,
    checkedFilters,
    setCheckedFilters,
    showDropdown,
    setShowDropdown,
    distance,
    setDistance,
    searchMode,
    setSearchMode,
    geocoderRef,
    placesServiceRef,
    userLocation,
    setUserLocation,
  } = useContext(MapContext);

  // Callback function for getting the user location
  const onLocatorButtonClicked = () => {
    const handleResults = (location) => {
      setCenter(location);

      const service = placesServiceRef.current;
      const filterTypes = Object.keys(checkedFilters).filter(
        (key) => checkedFilters[key]
      );

      let allMarkers = [];

      // Start searching from the first type
      handleNearbySearch(location, service, filterTypes, 0, allMarkers, false);
    };

    handleResults(
      new window.google.maps.LatLng(userLocation["lat"], userLocation["lng"])
    );
  };

  return (
    <>
      <button
        onClick={onLocatorButtonClicked}
        style={{
          position: "absolute",
          top: "200px",
          left: "10px",
          zIndex: 2000,
        }}
      >
        Current Location
      </button>
    </>
  );
};

export default LocatorButton;
