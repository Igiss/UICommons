import { Suspense } from "react";
import { Route, Routes } from "react-router-dom";
import ElementDetail from "./pages/Detail";
import Home from "./pages/Home";
import Navbar from "./pages/Navbar";
import Elements from "./pages/Element";
import ElementPreview from "./pages/ElementPreview";
import { elementsMock } from "./mockData/home";

function App() {
  return (
    <Suspense fallback={<></>}>
      <Navbar />

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/home" element={<Home />} />
        <Route path="/element/:id" element={<ElementDetail />} />
        <Route
          path="/preview"
          element={
            <ElementPreview
              css={elementsMock[0].css}
              html={elementsMock[0].html}
            />
          }
        />

        <Route path="/elements" element={<Elements />} />
        {/* Route 404 */}
        <Route path="*" element={<div>404 Not Found</div>} />
      </Routes>
    </Suspense>
  );
}

export default App;
