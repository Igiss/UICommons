import { Suspense } from "react";
import { Route, Routes } from "react-router-dom";
import About from "./pages/About";
import ElementDetail from "./pages/Elements";
import Home from "./pages/Home";

function App() {
  return (
    <Suspense fallback={<></>}>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/home" element={<Home />} />
        <Route path="/element/:id" element={<ElementDetail />} />
        <Route path="/about" element={<About />} />

        {/* Route 404 */}
        <Route path="*" element={<div>404 Not Found</div>} />
      </Routes>
    </Suspense>
  );
}

export default App;
