import { BrowserRouter, Route, Routes } from "react-router-dom";
import { HomePage } from "./ui/HomePage";
import { VerificationPage } from "./ui/VerificationPage";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/all-chords" element={<VerificationPage />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
