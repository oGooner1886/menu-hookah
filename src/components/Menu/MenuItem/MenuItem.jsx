import React, { memo } from 'react';
import style from './MenuItem.module.css';
import Placeholder from '../../../utils/Placeholder';
const MenuItem = memo(({ item, portion, addToOrder, removeFromOrder, openModalForEdit }) => {
  const { title, descr, price, gallery, uid } = item;
  const handleAddClick = () => {
    if (item.editions) {
      openModalForEdit(item);
    } else addToOrder(uid);
  };
  return (
    <div className={style.item}>
      <div className={style.desc}>
        <div className={style.desc__prop}>
          <h2 className={style.desc__title}>{title}</h2>
          <p className={style.desc__title_prop}>{descr}</p>
        </div>
        <div className={style.desc__price}>
          <p className={style.desc__price_num}>{price} ₽</p>
          <div className={style.desc__price_addToCart}>
            {!portion ? (
              <button className={style.btn_add} onClick={handleAddClick}>
                + Добавить
              </button>
            ) : (
              <div className={style.counter_group}>
                <button
                  className={style.desc__price_button}
                  onClick={() => {
                    removeFromOrder(uid);
                  }}
                >
                  <span>-</span>
                </button>
                <p className={style.desc__price_quantity}>
                  <span>{portion}</span>
                </p>
                <button className={style.desc__price_button} onClick={handleAddClick}>
                  <span>+</span>
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
      <div className={style.images}>
        {gallery ? <img src={'../../images/menu' + gallery} alt={title} loading="lazy" /> : <Placeholder />}
      </div>
    </div>
  );
});

export default MenuItem;
