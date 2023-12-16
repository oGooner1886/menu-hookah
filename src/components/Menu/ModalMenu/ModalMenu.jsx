import React, { useEffect, useState } from "react";
import style from "./ModalMenu.module.css";
import ItemEditions from "./ItemEditions/ItemEditions";

const ModalMenu = ({
  active,
  setActive,
  editions,
  item,
  closeModalForEdit,
  addToOrder,
  priceItem,
  setPriceItem,
}) => {
  const { uid } = item;
  // let priceEl = item.price

  // let [priceItem, setPriceItem] = useState( 0 && priceEl )
  let editionsTest = () => {
    if (editions === undefined) {
      console.log("Опций нет");
    } else {
      // return item = items.map((el) => el)
      return editions?.map((el) => {
        return el;
      });
    }
  };

  const selectDiff = (price) => {
    setPriceItem(() => {
      // return item.price + (difference || 0);
      return price
    });
  };

  editionsTest();
  // useEffect(() => {

  // },[])

  return (
    <div className={active ? style.modalActive : style.modal}>
      <div className={style.modal__block}>
        <div className={style.modal__block_title}>
          <h2 className={style.modal_title}>{item.title}</h2>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            className={style.modal_close}
            onClick={() => closeModalForEdit()}
          >
            <path d="M0 0h24v24H0V0z" fill="none"></path>
            <path d="M18.3 5.71a.996.996 0 00-1.41 0L12 10.59 7.11 5.7A.996.996 0 105.7 7.11L10.59 12 5.7 16.89a.996.996 0 101.41 1.41L12 13.41l4.89 4.89a.996.996 0 101.41-1.41L13.41 12l4.89-4.89c.38-.38.38-1.02 0-1.4z"></path>
          </svg>
        </div>

        <div className={style.modal__content}>
          <div>Выберите опцию</div>
          <div className={style.modal__item}>
            {editions !== undefined &&
              editions.map((item) => (
                <ItemEditions
                  key={item.uid}
                  item={item}
                  selectDiff={selectDiff}
                />
              ))}
          </div>
        </div>
        <div className={style.modal__content_main}></div>
        <div className={style.modal__blockPrice}>
          <div className={style.modal__blockPrice_price}>
            Итог: {priceItem}₽
          </div>

          <button
            className={style.modal__blockPrice_btn}
            onClick={() => {
              addToOrder(uid)
              closeModalForEdit()
            }}
          >
            Добавить в заказ
          </button>
        </div>
      </div>
    </div>
  );
};

export default ModalMenu;
