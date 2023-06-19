import React from "react";

import { Route, Routes } from "react-router-dom";

import Header from "./component/Header";
import Home from "./pages/Home";
import Cart from "./pages/Cart";
import NotFound from "./pages/NotFound";
import FullPizza from "./pages/FullPizza";

import "./scss/app.scss";
import MainLayout from "./layouts/MainLayout";

export const SearchContext = React.createContext("");

function App() {
   const [searchValue, setSearchValue] = React.useState("");
   return (
      <SearchContext.Provider value={{ searchValue, setSearchValue }}>
         <Routes>
            <Route path="/" element={<MainLayout />}>
               <Route path="/" element={<Home />}></Route>
               <Route path="/cart" element={<Cart />}></Route>
               <Route path="/pizza/:id" element={<FullPizza />}></Route>
               <Route path="/*" element={<NotFound />}></Route>
            </Route>
         </Routes>
      </SearchContext.Provider>
   );
}

export default App;
