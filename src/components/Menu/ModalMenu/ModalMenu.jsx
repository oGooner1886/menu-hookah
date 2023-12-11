import React, { useEffect } from "react";
import style from "./ModalMenu.module.css";
import ItemEditions from "./ItemEditions/ItemEditions";

const ModalMenu = ({ active, setActive, items }) => {
  // let item = []
  let editions = () => {
    if(items === undefined){
      console.log('Опций нет');
    } else {
      // return item = items.map((el) => el)
      return items?.map((el)=>{return el})
    }
  }
      
  editions()
  // useEffect(()=>console.log(editions()))
  
  
  
  return (
    <div className={active ? style.modalActive : style.modal}>
      <div className={style.modal__block}>
          <div className={style.modal__block_title}>
            <h2 className={style.modal_title}>TITLE</h2>
            <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 24 24"
        className={style.modal_close}
      >
        <path d="M0 0h24v24H0V0z" fill="none"></path>
        <path d="M18.3 5.71a.996.996 0 00-1.41 0L12 10.59 7.11 5.7A.996.996 0 105.7 7.11L10.59 12 5.7 16.89a.996.996 0 101.41 1.41L12 13.41l4.89 4.89a.996.996 0 101.41-1.41L13.41 12l4.89-4.89c.38-.38.38-1.02 0-1.4z"></path>
      </svg>
          </div>
          
          <div className={style.modal__content}>
            <div>Выберите порцию</div>
            <div className={style.modal__item}>{items !== undefined &&  items.map((item) => <ItemEditions key={item.uid} item={item}/>)}</div>
            
          </div>
          <div className={style.modal__content_main}></div>
      </div>
    </div>
  );
};

export default ModalMenu;

<div
  class="MuiPaper-root MuiDialog-paper MuiDialog-paperScrollPaper MuiDialog-paperWidthSm MuiPaper-elevation24 MuiPaper-rounded"
  role="dialog"
>
  <div class="modifiers-view_content__299qd">
    <div class="modifiers-view_titleBlock__1YTDy">
      <h2 class="modifiers-view_title__1L2u0" title="ORIGINAL Бургер">
        ORIGINAL Бургер
      </h2>
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 24 24"
        class="modifiers-view_closeIcon__3Ya-4"
      >
        <path d="M0 0h24v24H0V0z" fill="none"></path>
        <path d="M18.3 5.71a.996.996 0 00-1.41 0L12 10.59 7.11 5.7A.996.996 0 105.7 7.11L10.59 12 5.7 16.89a.996.996 0 101.41 1.41L12 13.41l4.89 4.89a.996.996 0 101.41-1.41L13.41 12l4.89-4.89c.38-.38.38-1.02 0-1.4z"></path>
      </svg>
    </div>
    <div class="modifiers-view_modifiers__1sR99">
      <div class="modifiers-set_modifierSet__3SkxG modifiers-view_firstModifierSet__11dG3">
        <p class="modifiers-set_modifierSetName__2N1Vh">
          Убрать ингредиент <span class="modifiers-set_amount__3zgK3"></span>
        </p>
        <div class="modifiers-set_modifiers__l0aTh">
          <div class="modifiers-set_modifier__2VVJE">Убрать лук</div>
          <div class="modifiers-set_modifier__2VVJE">Убрать сыр</div>
          <div class="modifiers-set_modifier__2VVJE">Убрать соус</div>
        </div>
      </div>
      <div class="modifiers-set_modifierSet__3SkxG">
        <p class="modifiers-set_modifierSetName__2N1Vh">
          Котлета <span class="modifiers-set_amount__3zgK3">/ выберите 1</span>
        </p>
        <div class="modifiers-set_modifiers__l0aTh">
          <div class="modifiers-set_modifier__2VVJE">
            Веганская
            <span class="modifiers-set_modifierDelta__1I_Nk">+50&nbsp;₽</span>
          </div>
          <div class="modifiers-set_modifier__2VVJE">Куриная</div>
          <div class="modifiers-set_modifier__2VVJE modifiers-set_modifierSelected__Xycfw">
            Говяжья
          </div>
        </div>
      </div>
    </div>
    <div class="modifiers-view_actionBlock__jnQ3L">
      <p class="modifiers-view_total__1P_9n">Итог: 380&nbsp;₽</p>
      <button class="button_button__3pOsY button_primary__2KXpw modifiers-view_button__2YWy_">
        Добавить в заказ
      </button>
    </div>
  </div>
</div>;
