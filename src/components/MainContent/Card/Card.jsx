import React from "react";
import styles from "./Card.module.css";

function Card(props) {
  return (
    <div className={styles.wrapper}>
      <div className={styles.image}>
        <img src={"./images/menu" + props.item.gallery} alt="" />
        {/* <a href="#addtofavorites" class={styles.image__toFav}>
          <svg
            width="21"
            height="18"
            viewBox="0 0 21 18"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M20 6.32647C20 11.4974 10.5 17 10.5 17C10.5 17 1 11.4974 1 6.32647C1 -0.694364 10.5 -0.599555 10.5 5.57947C10.5 -0.599555 20 -0.507124 20 6.32647Z"
              stroke="black"
              stroke-linejoin="round"
            ></path>
          </svg>
        </a> */}
      </div>
      <div className={styles.properties}>
        <h2 className={styles.properties__title}>{props.item.title}</h2>
        <p>{props.item.price} ₽</p>
        <p className={styles.properties__desc}>{props.item.descr}</p>
        <div className={styles.properties__addToFav}>+</div>
      </div>
    </div>
  );
}

export default Card;

// {props.state.map((item) => {
//   return <div>{item.title}</div>;
// })}
