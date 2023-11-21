import React, { useContext } from "react";
import Context from "./../../Context/Context";
import MenuItem from "../Menu/MenuItem/MenuItem";
import { NavLink } from "react-router-dom";
import style from "./Category.module.css";

const Category = () => {
  const { products } = useContext(Context);
    
  let salads = products.filter((item) => item.uid < 100);
  return (
    <div className={style.category}>
      <NavLink to={"/menu/salads"}>
        <button>
          <h1>Салаты</h1>
        </button>
      </NavLink>
      <NavLink to={"/menu/soup"}>
        <button>
          <h1>Супы</h1>
        </button>
      </NavLink>
    </div>
  );
};

export default Category;
