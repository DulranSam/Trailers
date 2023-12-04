import { BrowserRouter, Routes, Route } from "react-router-dom";
import Movies from "./Components/Movies";
import AddFilm from "./Components/AddFilm";

import "./App.css";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Movies />}></Route>
        <Route path="/addfilm" element={<AddFilm />} />
      </Routes>
    </BrowserRouter>
  );
}
