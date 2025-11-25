import { Routes, Route } from "react-router-dom";
import Header from "./components/Header/Header";
import './App.css';
import MainContainer from "./container/MainContainer/MainContainer";

function App() {
  return (
    <div className="whole_container">
      <Header />
      <aside>
        {/* Add your sidebar content here */}
      </aside>
      <div className="main_content">
        <Routes>
          <Route path="*" element={<MainContainer />} />
        </Routes>
      </div>
    </div>
  );
}

export default App;
