import React from "react";
import style from "./Modal.module.css";

const Modal = ({ active, setActive }) => {
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
            <p>
              Вход только для лиц старше 18 лет. Будьте готовы предъявить
              документ, удостоверяющий личность. <br />
              При посещении нашего заведения заказ кальяна обязателен.
              <br />
              Один кальян рассчитан на 4 человека. Для 5-8 человек 2 кальяна.
              Для 9-12 человек 3 кальяна и т.д.
              <br />
              Один кальян рассчитан на 2 часа курения, после чего заказывается
              новый кальян.
              <br />
              Лицам, находящимся в состоянии алкогольного опьянения, сотрудник
              зала вправе отказать без объяснения причин.
              <br />
              Запрещается приносить и распивать свои алкогольные напитки.
              <br />
              Запрещено самостоятельно переносить кальян, производить замену
              углей и любые манипуляции без кальянного мастера.
              <br />
              <span className={style.modal__content_main_hb}>
                В день рождения при предоставлении документа, удостоверяющего
                личность, NUA дарит Вам второй кальян в подарок!
              </span>
              <br />
              Стоимость основного кальяна - 850 рублей
              <br />
              Стоимость дополнительного кальяна - 650 рублей
              <br />
              Сервисный сбор в размере 4% от общей суммы чека.
            </p>
          </div>
        </div>
        <div className={style.modal__agree}>
          <div>С правилами посещения заведения</div>
          <button
            onClick={() => setActive(false)}
            className={style.modal__agree_btn}
          >
            <span>СОГЛАСЕН</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default Modal;
