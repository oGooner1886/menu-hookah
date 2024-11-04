import React from 'react';
import style from './Modal.module.css';

const Modal = ({ active, setActive }) => {
  return (
    <div className={active ? style.modalActive : style.modal}>
      <div className={style.modal__block}>
        <div className={style.modal__content}>
          <div className={style.modal__content_header}>
            <h1>Рады приветствовать Вас в нашем заведении.</h1>
            <h2>Обращаем Ваше внимание, что в нашем заведении действуют правила.</h2>
          </div>
          <div className={style.modal__content_main}>
            <ul className={style.modal__content_list}>
              <li>Вход только для лиц старше 18 лет. Будьте готовы предъявить документ, удостоверяющий личность.</li>
              <li>При посещении нашего заведения заказ кальяна обязателен.</li>
              <li>Один кальян рассчитан на 4 человека. Для 5-8 человек 2 кальяна. Для 9-12 человек 3 кальяна и т.д.</li>
              <li>Один кальян рассчитан на 2 часа курения, после чего заказывается новый кальян.</li>
              <li style={{ color: 'blue' }}>Стоимость основного кальяна - 1000 рублей</li>
              <li style={{ color: 'blue' }}>Стоимость дополнительного кальяна - 850 рублей</li>
              <li>Сервисный сбор в размере 5% от общей суммы чека.</li>
            </ul>
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

export default Modal;
