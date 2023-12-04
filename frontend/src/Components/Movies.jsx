import React, { useEffect, useState } from "react";
import Axios from "axios";
import { Outlet, Link } from "react-router-dom";

function Movies() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [modifieduser, setModifiedUser] = useState("");

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

  async function DeleteFilm(id) {
    try {
      setLoading(true);
      const response = await Axios.delete(`http://localhost:8000/home/${id}`);
      setData(response.data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  }

  async function EditTitle(id, film) {
    try {
      setLoading(true);
      const response = await Axios.put(`http://localhost:8000/home/${id}`, {
        filmname: film,
      });
      setData(response.data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  }

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
            <h2 style={{ fontSize: 32 }}>{x.title}</h2>
            <p>{x.description || "No description found"}</p>
            <img src={x.image} alt={`Image of ${x.title}`}></img>
            <a href={x.trailer}>Trailer for {x.title}</a>
            <label>
              <button
                onClick={() => {
                  DeleteFilm(x._id);
                }}
              >
                Delete Film
              </button>
              <input
                onChange={(e) => {
                  setModifiedUser(e.target.value);
                }}
                placeholder="Update Film Title"
              ></input>
              <button
                onClick={() => {
                  EditTitle(x._id, modifieduser);
                }}
              >
                Make changes
              </button>
            </label>
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
