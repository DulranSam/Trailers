import React, { useEffect, useState } from "react";
import Axios from "axios";
import { Outlet, Link } from "react-router-dom";

function Movies() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    async function fetchFromBack() {
      try {
        setLoading(true);
        const response = await Axios.get("http://localhost:8000/home");
        setData(response.data);
      } catch (error) {
        console.error(error);
        setData([]);
      } finally {
        setLoading(false);
      }
    }
    fetchFromBack();
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    // Add logic to filter data based on the search term
    // For example: const filteredData = data.filter(item => item.title.toLowerCase().includes(searchTerm.toLowerCase()));
    // setData(filteredData);
  };

  return (
    <>
      <form onSubmit={handleSearch}>
        <input
          type="text"
          placeholder="Search Here..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <button type="submit" disabled={loading}>
          Search
        </button>
      </form>
      {data.length ? (
        data.map((x) => (
          <div key={x._id}>
            <h1>{x.title}</h1>
            <p>{x.description}</p>
            <a href={x.trailer}>Trailer</a>
          </div>
        ))
      ) : (
        <p>No Trailers Added</p>
      )}
      <Link to="/addfilm">Add Film</Link>
    </>
  );
}

export default Movies;
