import React, { useState, useContext } from "react";
import "./index.css";
import MapContext from "./MapContext";

const iconMap = {
  0: "http://maps.gstatic.com/mapfiles/ms2/micons/parkinglot.png",
  1: "http://maps.gstatic.com/mapfiles/ms2/micons/restaurant.png",
  2: "http://maps.gstatic.com/mapfiles/ms2/micons/tree.png",
  3: "http://maps.gstatic.com/mapfiles/ms2/micons/hospitals.png",
};

function FilteredSearchBar() {
  const {
    map,
    setMap,
    markers,
    setMarkers,
    center,
    setCenter,
    selectedMarker,
    setSelectedMarker,
  } = useContext(MapContext);

  const [checkedBoxes, setcheckedBoxes] = useState({
    parking: true,
    restaurant: true,
    park: true,
    hospital: true,
  });

  const [showDropdown, setShowDropdown] = useState(false);
  const [distance, setDistance] = useState(5);
  const [locationFormat, setLocationFormat] = useState("latlng");
  const [searchText, setSearchText] = useState("");
  const [nextPageToken, setNextPageToken] = useState(null); // For pagination

  const onFilterChange = (event) => {
    const { value, checked } = event.target;

    // Update the state
    setcheckedBoxes((prevState) => ({
      ...prevState,
      [value]: checked, // Computed property name
    }));
  };

  const onDistanceChange = (event) => {
    setDistance(event.target.value);
  };

  const onLocationFormatChange = (event) => {
    setLocationFormat(event.target.value);
  };

  const onSearchTextChange = (event) => {
    setSearchText(event.target.value);
  };

  const toggleDropdown = () => {
    setShowDropdown(!showDropdown);
  };

  const onSearch = () => {
    // Code for search
    // Check if the map is loaded
    if (!map) return;

    const geocoder = new window.google.maps.Geocoder();
    const handleResults = (location) => {
      setCenter(location);

      const service = new window.google.maps.places.PlacesService(map);
      const filterTypes = Object.keys(checkedBoxes).filter(
        (key) => checkedBoxes[key]
      );
      let allMarkers = [];

      // Use recursive function instead of for-loop to avoid exceeding rate limit
      const searchPlaces = (index) => {
        if (index < filterTypes.length) {
          const request = {
            location: location,
            radius: distance * 1000,
            type: filterTypes[index],
          };

          service.nearbySearch(request, (results, status, pagination) => {
            if (status === window.google.maps.places.PlacesServiceStatus.OK) {
              const newMarkers = results.map((place) => ({
                lat: place.geometry.location.lat(),
                lng: place.geometry.location.lng(),
                title: place.name,
                icon: {
                  url: iconMap[index],
                  scaledSize: new window.google.maps.Size(40, 40), // Scale the icon
                },
                id: place.place_id,
                googleRating: place.rating || 0,
                googleRatingsCount: place.user_ratings_total || 0,
                type: filterTypes[index],
              }));

              allMarkers = allMarkers.concat(newMarkers);
              if (pagination && pagination.hasNextPage) {
                // If more results are available, keep fetching
                setTimeout(() => pagination.nextPage(), 200); // respect API limit
              } else {
                // No more results, process next type
                searchPlaces(index + 1); // Recurse to search next type
              }
            } else {
              // Proceed to next type even if current search fails
              searchPlaces(index + 1);
            }
          });
        } else {
          // Set all the combined markers after searching all filter types
          // Don't use location.lat, location.lng!!!
          allMarkers.push({
            lat: location.lat(),
            lng: location.lng(),
            title: "Target Location",
            icon: "",
            id: null,
            googleRating: 0,
            googleRatingsCount: 0,
          });
          setMarkers(allMarkers);
        }
      };

      // Start searching from the first type
      searchPlaces(0);
    };

    if (locationFormat === "latlng") {
      const latLng = searchText.split(",").map(Number);
      if (latLng.length === 2 && !isNaN(latLng[0]) && !isNaN(latLng[1])) {
        handleResults(new window.google.maps.LatLng(latLng[0], latLng[1]));
      } else {
        alert("Invalid latitude and longitude format.");
      }
    } else {
      geocoder.geocode({ address: searchText }, (results, status) => {
        if (status === "OK" && results[0]) {
          handleResults(results[0].geometry.location);
        } else {
          alert("Geocoding failed due to: " + status);
        }
      });
    }
  };

  return (
    <div className="search-bar">
      <button onClick={toggleDropdown} className="dropdown-button">
        Type Filters
      </button>
      <select
        onChange={onDistanceChange}
        value={distance}
        className="distance-toggle"
      >
        <option value="1">1 km</option>
        <option value="5">5 km</option>
        <option value="10">10 km</option>
      </select>
      <select onChange={onLocationFormatChange} value={locationFormat}>
        <option value="latlng">Coordinate</option>
        <option value="addr">Address</option>
      </select>
      <input
        type="text"
        placeholder="Target Location"
        className="search-input"
        onChange={onSearchTextChange}
        value={searchText}
      />
      <button onClick={onSearch} className="search-button">
        Search
      </button>
      {showDropdown && (
        <div className="dropdown-content">
          <label>
            <input
              type="checkbox"
              onChange={onFilterChange}
              value="parking"
              checked={checkedBoxes.parking}
            />{" "}
            Parking Spot
          </label>
          <label>
            <input
              type="checkbox"
              onChange={onFilterChange}
              value="restaurant"
              checked={checkedBoxes.restaurant}
            />{" "}
            Restaurant
          </label>
          <label>
            <input
              type="checkbox"
              onChange={onFilterChange}
              value="park"
              checked={checkedBoxes.park}
            />{" "}
            Park
          </label>
          <label>
            <input
              type="checkbox"
              onChange={onFilterChange}
              value="hospital"
              checked={checkedBoxes.hospital}
            />{" "}
            Hospital
          </label>
        </div>
      )}
    </div>
  );
}

export default FilteredSearchBar;
