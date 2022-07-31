// import logo from './logo.svg';
import "./App.css";
import Home from "./home";
import {
  BrowserRouter,
  Routes,
  Route,
} from "react-router-dom";

import NotFound from "./notFound";
import Dashboard from "./dashboard";
function App() {
  return (

  <div className="App">
    <BrowserRouter>
      
        <Routes>
          <Route path="/" element={<Home />}></Route>
          <Route path="/dashboard" element={<Dashboard />}></Route>
          <Route path="*" element={<NotFound />}></Route>
        </Routes>
      
    </BrowserRouter>
    </div>
  );
}

export default App;
