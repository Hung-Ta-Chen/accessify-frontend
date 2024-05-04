import React, { useState, useContext } from "react";
import {
  GoogleMap,
  LoadScript,
  Marker,
  InfoWindow,
} from "@react-google-maps/api";
import LocatorButton from "./LocatorButton"; // Ensure this component is correctly imported
import MapContext from "./MapContext";

const containerStyle = {
  width: "100vw",
  height: "86vh",
};

const initialCenter = {
  lat: -34.397,
  lng: 150.644,
};

const MAPS_API_KEY = process.env.REACT_APP_MAPS_API_KEY;
const SERVER_URL = process.env.REACT_APP_BACKEND_URL;
const LIBRARIES = ["places"];

function MapContainer({ onAddReview, onDisplayReviews, handleNearbySearch }) {
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
  } = useContext(MapContext);

  const [infoWindowData, setInfoWindowData] = useState({
    average_wheelchair_access_rating: 0,
    average_restroom_rating: 0,
    average_overall_rating: 0,
    user_review_count: 0,
  });

  // Function to handle the loading of the map
  const onLoad = (mapInstance) => {
    setMap(mapInstance);
    // Initialize the geocoder
    if (!geocoderRef.current) {
      geocoderRef.current = new window.google.maps.Geocoder();
    }
    // Initialize the places service
    if (!placesServiceRef.current) {
      placesServiceRef.current = new window.google.maps.places.PlacesService(
        mapInstance
      );
    }
  };

  // Function to handle map clicks
  // Center the map to the click and display nearby places
  const onMapClick = (event) => {
    const handleResults = (location) => {
      setCenter(location);

      const service = placesServiceRef.current;
      const filterTypes = Object.keys(checkedFilters).filter(
        (key) => checkedFilters[key]
      );

      let allMarkers = [];

      // Start searching from the first type
      handleNearbySearch(location, service, filterTypes, 0, allMarkers);
    };

    handleResults(event.latLng);
  };

  const onMarkerClick = async (marker) => {
    if (marker.id) {
      // Fetch the information for backend
      try {
        const placeId = marker.id;

        // Fetch reviews for the found place ID
        const statsResponse = await fetch(
          `${SERVER_URL}/api/places/${placeId}/stats/`
        );
        if (!statsResponse.ok) throw new Error("Failed to fetch reviews");

        const statsData = await statsResponse.json();
        setInfoWindowData(statsData);
      } catch (error) {
        console.error("Error fetching place or reviews:", error);
        alert("Error fetching place or reviews");
      }

      // Set the selected marker

      setSelectedMarker(marker);
    }
  };

  return (
    <LoadScript googleMapsApiKey={MAPS_API_KEY} libraries={LIBRARIES}>
      <GoogleMap
        mapContainerStyle={containerStyle}
        center={center}
        zoom={15}
        onLoad={onLoad}
        onClick={onMapClick}
      >
        {/* Load map components here */}
        {markers.map((marker, idx) => (
          <Marker
            key={idx}
            position={{ lat: marker.lat, lng: marker.lng }}
            title={marker.title}
            icon={marker.icon}
            onClick={(event) => onMarkerClick(marker)}
          />
        ))}

        {/* Load the review of the selected marker */}
        {selectedMarker && (
          <InfoWindow
            position={{ lat: selectedMarker.lat, lng: selectedMarker.lng }}
            onCloseClick={(event) => setSelectedMarker(null)}
          >
            <div className="info-window-content">
              <h3>{selectedMarker.title}</h3>
              <p>Google Map Rating: {selectedMarker.googleRating} Stars</p>
              <p>
                Wheelchair Access Rating:{" "}
                {Number.isInteger(
                  infoWindowData.average_wheelchair_access_rating
                )
                  ? infoWindowData.average_wheelchair_access_rating
                  : infoWindowData.average_wheelchair_access_rating.toFixed(
                      1
                    )}{" "}
                Stars
              </p>
              <p>
                Restroom Access Rating:{" "}
                {Number.isInteger(infoWindowData.average_restroom_rating)
                  ? infoWindowData.average_restroom_rating
                  : infoWindowData.average_restroom_rating.toFixed(1)}{" "}
                Stars
              </p>
              <p>
                Overall Rating:{" "}
                {Number.isInteger(infoWindowData.average_overall_rating)
                  ? infoWindowData.average_overall_rating
                  : infoWindowData.average_overall_rating.toFixed(1)}{" "}
                Stars
              </p>
              <p>User Review Count: {infoWindowData.user_review_count}</p>
              <p>Pros: </p>
              <p>Cons: </p>
              <div className="info-window-buttons">
                <button onClick={() => onDisplayReviews(selectedMarker)}>
                  Display Reviews
                </button>
                <button onClick={() => onAddReview(selectedMarker)}>
                  Add Review
                </button>
              </div>
            </div>
          </InfoWindow>
        )}
      </GoogleMap>
      {map && <LocatorButton />}
    </LoadScript>
  );
}

export default MapContainer;
