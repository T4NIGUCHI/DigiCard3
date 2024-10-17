import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import CardPage from "./pages/CardPage";
import RegisterPage from "./pages/RegisterPage";
import HomePage from "./pages/HomePage"; // ここでHomePageをインポート

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/cards/:id" element={<CardPage />} />
        <Route path="/cards/register" element={<RegisterPage />} />
      </Routes>
    </Router>
  );
}

export default App;
