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

const API_KEY = "AIzaSyBLtwzy9EsFK_EqMlOoa_dB5TVGkSe4ggU";

function MapContainer({ onAddReview, onDisplayReviews }) {
  const { map, setMap, markers, setMarkers, center, setCenter } =
    useContext(MapContext);

  const [selectedMarker, setSelectedMarker] = useState(null);

  // Function to handle the loading of the map
  const onLoad = (mapInstance) => {
    setMap(mapInstance);
  };

  // Function to handle map clicks and add markers
  const onMapClick = (event) => {
    /*
    setMarkers((currentMarkers) => [
      ...currentMarkers,
      {
        lat: event.latLng.lat(),
        lng: event.latLng.lng(),
        title: "Clicked",
        icon: "",
        id: "test",
        googleRating: 0,
        googleRatingsCount: 0,
        type: "",
      },
    ]);
    */
  };

  const onMarkerClick = (marker) => {
    if (marker.id) {
      // Fetch the information for backend

      // Set the selected marker
      setSelectedMarker(marker);
    }
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
              <p>Google Rating: {selectedMarker.googleRating} Stars</p>
              <p>Wheelchair Access Rating: </p>
              <p>Restroom Access Rating: </p>
              <p>Overall Rating: </p>
              <p>User Review Count: </p>
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
