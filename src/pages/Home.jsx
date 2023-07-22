import React from "react";
import qs from "qs";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";

import {
  setCategoryId,
  setCurrentPage,
  setFilters,
} from "../redux/slices/filterSlice";

import { fetchPizzas } from "../redux/slices/pizzasSlice";

import Categories from "../component/Categories";
import PizzaBlock from "../component/PizzaBlock";
import Skeleton from "../component/PizzaBlock/Skeleton";
import Sort, { sortList } from "../component/Sort";
import Pagination from "../component/Pagination";
import { SearchContext } from "../App";
import ErrorInfo from "../component/ErrorInfo";

const Home = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const isSearch = React.useRef(false);
  const isMounted = React.useRef(false);

  const { categoryId, sort, currentPage } = useSelector(
    (state) => state.filterSlice
  );

  const { status, items } = useSelector((state) => state.pizzasSlice);
  const sortType = sort.sortProperty;
  const { searchValue } = React.useContext(SearchContext);

  const onClickCategory = React.useCallback((id) => {
    dispatch(setCategoryId(id));
  }, []);

  const onChangePage = (number) => {
    dispatch(setCurrentPage(number));
  };

  //------ Функция запрос на сервер на получение списка пиц и рендкр их нас транице --------------
  const getPizzas = async () => {
    const category = categoryId > 0 ? `category=${categoryId}` : "";
    const search = searchValue ? `&search=${searchValue}` : "";
    const sortBy = sortType.replace("-", "");
    const order = sortType.includes("-") ? "asc" : "desc";
    //Запрос с сервера. Бизнес логика в редаксе
    dispatch(
      fetchPizzas({
        category,
        search,
        sortBy,
        order,
        currentPage,
      })
    );
    window.scrollTo(0, 0);
  };

  //----- Если изменили параметры и был первый рендер то будет действие -----------------
  React.useEffect(() => {
    if (isMounted.current) {
      const queryString = qs.stringify({
        sortProperty: sort.sortProperty,
        categoryId,
        currentPage,
      });
      navigate(`?${queryString}`);
    }
    isMounted.current = true;
  }, [categoryId, sort.sortProperty, currentPage]);

  //----- Если был первый рендер то проверяем юрл параметров и сохраняем редаксе -----------------
  React.useEffect(() => {
    if (window.location.search) {
      const params = qs.parse(window.location.search.substring(1));

      const sort = sortList.find(
        (obj) => obj.sortProperty === params.sortProperty
      );

      dispatch(
        setFilters({
          ...params,
          sort,
        })
      );
      isSearch.current = true;
    }
  }, []);

  //  ----- Если был первый рендер то запрашиваем пиццы ---------------------
  React.useEffect(() => {
    window.scrollTo(0, 0);

    if (!isSearch.current) {
      getPizzas();
    }
    isSearch.current = false;
  }, [categoryId, sort.sortProperty, searchValue, currentPage]);

  const pizzas = items.map((pizza) => (
    <PizzaBlock
      key={pizza.id}
      id={pizza.id}
      imageUrl={pizza.imageUrl}
      title={pizza.title}
      price={pizza.price}
      types={pizza.types}
      sizes={pizza.sizes}
      category={pizza.category}
      rating={pizza.rating}
    />
  ));

  const skeletons = [...new Array(8)].map((_, index) => (
    <Skeleton key={index} />
  ));

  return (
    <div className="container">
      {status === "error" ? (
        <ErrorInfo />
      ) : (
        <>
          <div className="content__top">
            <Categories value={categoryId} onClickCategory={onClickCategory} />
            <Sort value={sort} />
          </div>
          <h2 className="content__title">
            {searchValue ? searchValue : "Все пиццы"}
          </h2>
          <div className="content__items">
            {status === "loading" ? skeletons : pizzas}
          </div>
          <Pagination currentPage={currentPage} onChangePage={onChangePage} />
        </>
      )}
    </div>
  );
};

export default Home;
