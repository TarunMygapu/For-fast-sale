import { Routes, Route } from "react-router-dom";
import Header from "./components/Header/Header";
import './App.css';
import ApplicationSaleTableContainer from "./container/Application_sale_table_container/Application_sale_table_container";

function App() {
  return (
    <div className="whole_container">
      <Header />
      <aside>
        {/* Add your sidebar content here */}
      </aside>
      <div className="main_content">
        <Routes>
          <Route path="*" element={<ApplicationSaleTableContainer />} />
        </Routes>
      </div>
    </div>
  );
}

export default App;
