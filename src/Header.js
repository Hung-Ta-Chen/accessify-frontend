import React from "react";
import "./index.css";
import FilteredSearchBar from "./FilteredSearchBar";

function Header() {
  return (
    <header className="site-header">
      <h1>Accessify</h1>
      <FilteredSearchBar />
    </header>
  );
}

export default Header;
