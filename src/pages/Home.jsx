import React from "react";
import qs from "qs";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { useDispatch, useSelector } from "react-redux";

import {
  setCategoryId,
  setCurrentPage,
  setFilters,
} from "../redux/slices/filterSlice";
import Categories from "../component/Categories";
import PizzaBlock from "../component/PizzaBlock";
import Skeleton from "../component/PizzaBlock/Skeleton";
import Sort, { sortList } from "../component/Sort";
import Pagination from "../component/Pagination";
import { SearchContext } from "../App";

const Home = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const isSearch = React.useRef(false);
  const isMounted = React.useRef(false);

  const { categoryId, sort, currentPage } = useSelector(
    (state) => state.filterSlice
  );
  const sortType = sort.sortProperty;

  const { searchValue } = React.useContext(SearchContext);
  const [items, setItems] = React.useState([]);
  const [isLoading, setIsLoading] = React.useState(true);

  const onClickCategory = (id) => {
    dispatch(setCategoryId(id));
  };

  const onChangePage = (number) => {
    dispatch(setCurrentPage(number));
  };

  //------ Функция запрос на сервер на получение списка пиц и рендкр их нас транице --------------
  const fetchPizzas = async () => {
    setIsLoading(true);

    const category = categoryId > 0 ? `category=${categoryId}` : "";
    const search = searchValue ? `&search=${searchValue}` : "";
    const sortBy = sortType.replace("-", "");
    const order = sortType.includes("-") ? "asc" : "desc";

    try {
      const res = await axios.get(
        `https://6469e04603bb12ac20946e3a.mockapi.io/items?page=${currentPage}&limit=4&${category}&sortBy=${sortBy}&order=${order}${search}`
      );
      setItems(res.data);
    } catch (error) {
      alert("Ошибка получения");
      console.log("ERROR", error);
    } finally {
      setIsLoading(false);
    }
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
      fetchPizzas();
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
      <div className="content__top">
        <Categories value={categoryId} onClickCategory={onClickCategory} />
        <Sort />
      </div>
      <h2 className="content__title">
        {searchValue ? searchValue : "Все пиццы"}
      </h2>
      <div className="content__items">{isLoading ? skeletons : pizzas}</div>
      <Pagination currentPage={currentPage} onChangePage={onChangePage} />
    </div>
  );
};

export default Home;
