import React, { Suspense } from "react";
import Loadable from "react-loadable";
import { Route, Routes } from "react-router-dom";

import Home from "./pages/Home";
import NotFound from "./pages/NotFound";

import "./scss/app.scss";
import MainLayout from "./layouts/MainLayout";
export const SearchContext = React.createContext("");

const Cart = Loadable({
   loader: () => import(/*webpackChunkName: "Cart" */ "./pages/Cart"),
   loading: () => <div>Идёт загрузка...</div>,
});

const FullPizza = Loadable({
   loader: () => import(/*webpackChunkName: "FullPizza" */ "./pages/FullPizza"),
   loading: () => <div>Идёт загрузка...</div>,
});

function App() {
   const [searchValue, setSearchValue] = React.useState("");
   return (
      <SearchContext.Provider value={{ searchValue, setSearchValue }}>
         <Suspense fallback={<div>Идёт загрузка...</div>}>
            <Routes>
               <Route path="/" element={<MainLayout />}>
                  <Route path="/" element={<Home />}></Route>
                  <Route path="/cart" element={<Cart />}></Route>
                  <Route path="/pizza/:id" element={<FullPizza />}></Route>
                  <Route path="/*" element={<NotFound />}></Route>
               </Route>
            </Routes>
         </Suspense>
      </SearchContext.Provider>
   );
}

export default App;
