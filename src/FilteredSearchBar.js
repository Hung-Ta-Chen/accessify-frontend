import React, { useState, useContext } from "react";
import "./index.css";
import MapContext from "./MapContext";

function FilteredSearchBar() {
  const { map, setMap, markers, setMarkers, center, setCenter } =
    useContext(MapContext);

  const [checkedBoxes, setcheckedBoxes] = useState({
    parking: false,
    restaurant: false,
    park: false,
    hospital: false,
  });

  const [showDropdown, setShowDropdown] = useState(false);
  const [distance, setDistance] = useState(5);
  const [searchText, setSearchText] = useState("");

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

  const toggleDropdown = () => {
    setShowDropdown(!showDropdown);
  };

  const onSearch = () => {
    // Code for search
  };

  return (
    <div className="search-bar">
      <button onClick={toggleDropdown} className="dropdown-button">
        Type Filters
      </button>
      <select onChange={onDistanceChange} value={distance}>
        <option value="1">1 km</option>
        <option value="5">5 km</option>
        <option value="10">10 km</option>
        <option value="20">20 km</option>
        <option value="50">50 km</option>
      </select>
      <input
        type="text"
        placeholder="Target Location"
        className="search-input"
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
