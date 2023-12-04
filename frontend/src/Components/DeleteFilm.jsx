import { useState, useEffect } from "react";
import Axios from "axios";

const DeleteFilm = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);

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
  return (
    <div>
      <h1>DeleteFilm</h1>
    </div>
  );
};

export default DeleteFilm;
