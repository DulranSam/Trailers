import React, { useEffect, useState } from "react";
import Axios from "axios";
import { Outlet, Link } from "react-router-dom";

function Movies() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [modifiedUser, setModifiedUser] = useState("");

  useEffect(() => {
    async function fetchFromBack() {
      try {
        setLoading(true);
        const response = await Axios.get("http://localhost:8000/home");
        setData(response.data);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    }
    fetchFromBack();
  }, []);

  async function deleteFilm(id) {
    try {
      setLoading(true);
      await Axios.delete(`http://localhost:8000/home/${id}`);

      setData((prevData) => prevData.filter((film) => film._id !== id));
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  }

  async function editTitle(id, film) {
    try {
      setLoading(true);
      await Axios.put(`http://localhost:8000/home/${id}`, {
        filmname: film,
      });

      setData((prevData) =>
        prevData.map((item) =>
          item._id === id ? { ...item, title: film } : item
        )
      );
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  }

  const handleSearch = async (e, searchTerm) => {
    e.preventDefault();
    try {
      setLoading(true);
      const response = await Axios.post(
        `http://localhost:8000/home/${searchTerm}`
      );
      setData(response.data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <form
        onSubmit={(e) => {
          handleSearch(e, searchTerm);
        }}
      >
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
            <img src={x.image} alt={`Image of ${x.title}`} />
            <a href={x.trailer}>Trailer for {x.title}</a>
            <label>
              <button
                onClick={() => {
                  deleteFilm(x._id);
                }}
              >
                Delete Film
              </button>
              <input
                onChange={(e) => {
                  setModifiedUser(e.target.value);
                }}
                placeholder="Update Film Title"
              />
              <button
                onClick={() => {
                  editTitle(x._id, modifiedUser);
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
