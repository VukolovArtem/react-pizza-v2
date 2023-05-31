import React from "react";

import Categories from "../component/Categories";
import PizzaBlock from "../component/PizzaBlock";
import Skeleton from "../component/PizzaBlock/Skeleton";
import Sort from "../component/Sort";
import Pagination from "../component/Pagination";

const Home = ({ searchValue }) => {
  const [items, setItems] = React.useState([]);
  const [isLoading, setIsLoading] = React.useState(true);
  const [categoryId, setCategoryId] = React.useState(0);
  const [currentPage, setCurrentPage] = React.useState(1);
  const [sortType, setSortType] = React.useState({
    name: "популярности ↑ ",
    sortProperty: "rating",
  });

  React.useEffect(() => {
    setIsLoading(true);

    const category = categoryId > 0 ? `category=${categoryId}` : "";
    const search = searchValue ? `&search=${searchValue}` : "";
    const sortBy = sortType.sortProperty.replace("-", "");
    const order = sortType.sortProperty.includes("-") ? "asc" : "desc";

    fetch(
      `https://6469e04603bb12ac20946e3a.mockapi.io/items?page=${currentPage}&limit=4&${category}&sortBy=${sortBy}&order=${order}${search}`
    )
      .then((res) => {
        return res.json();
      })
      .then((arr) => {
        setItems(arr);
        setIsLoading(false);
      });
    window.scrollTo(0, 0);
  }, [categoryId, sortType, searchValue, currentPage]);

  //  .filter((pizza) => {
  //   if (
  //     pizza.title
  //       .toLocaleLowerCase()
  //       .includes(searchValue.toLocaleLowerCase())
  //   ) {
  //     return true;
  //   }
  //   return false;
  // })

  const pizzas = items.map((pizza) => (
    <PizzaBlock
      key={pizza.id}
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
        <Categories
          value={categoryId}
          onClickCategory={(index) => setCategoryId(index)}
        />
        <Sort value={sortType} onClickSort={(index) => setSortType(index)} />
      </div>
      <h2 className="content__title">
        {searchValue ? searchValue : "Все пиццы"}
      </h2>
      <div className="content__items">{isLoading ? skeletons : pizzas}</div>
      <Pagination onChangePage={(number) => setCurrentPage(number)} />
    </div>
  );
};

export default Home;
