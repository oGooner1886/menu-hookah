import React from "react";
import style from "./ModalMenu.module.css";


const ModalMenu = ({ active, setActive }) => {
  
  return (
    <div className={active ? style.modalActive : style.modal}>
      <div className={style.modal__block}>
        <div className={style.modal__content}>
          <div className={style.modal__content_header}>
            <h1>Рады приветствовать Вас в нашем заведении.</h1>
            <h2>
              Обращаем Ваше внимание, что в нашем заведении действуют правила.
            </h2>
          </div>
          <div className={style.modal__content_main}>
            ,ksdkadkaskdsakdk
          </div>
        </div>
        <div className={style.modal__agree}>
          <div>С правилами посещения заведения</div>
          <button onClick={() => setActive(false)} className={style.modal__agree_btn}>
            <span>СОГЛАСЕН</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default ModalMenu;
