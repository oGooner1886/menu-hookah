import React, { memo, useState } from 'react';
import style from './MenuItem.module.css';
import Placeholder from '../../../mocks/Placeholder/Placeholder';

const MenuItem = memo(({ item, portion, order = {}, stopList = [], addToOrder, removeFromOrder, openModalForEdit }) => {
  const { title, descr, price, gallery, uid, editions, uiType } = item;
  const hasEditions = Boolean(editions && editions.length > 0);
  const isInlineSwitch = uiType === 'inline_switch' && hasEditions;

  // Проверка стоп-листа
  const isSingleStopped = !hasEditions && stopList.includes(String(uid));
  const availableEditions = hasEditions
    ? editions.filter((ed) => !stopList.includes(String(ed.uid)))
    : [];
  const isEntireItemStopped = hasEditions && availableEditions.length === 0;
  const isCardDisabled = isSingleStopped || isEntireItemStopped;

  // Для переключателя прямо в карточке
  const [selectedIdx, setSelectedIdx] = useState(0);
  const activeEdition = hasEditions ? editions[selectedIdx] || editions[0] : null;
  const activeEditionQty = activeEdition ? order[activeEdition.uid] || 0 : 0;
  const isActiveEditionStopped = activeEdition
    ? stopList.includes(String(activeEdition.uid))
    : false;

  const handleAddClick = (e) => {
    e.stopPropagation();
    if (isCardDisabled) return;

    if (isInlineSwitch) {
      if (activeEdition && !isActiveEditionStopped) {
        addToOrder(activeEdition.uid);
      }
    } else if (hasEditions) {
      if (typeof openModalForEdit === 'function') openModalForEdit(item);
    } else {
      addToOrder(uid);
    }
  };

  const handleRemoveClick = (e) => {
    e.stopPropagation();
    if (isInlineSwitch) {
      if (activeEdition) removeFromOrder(activeEdition.uid);
    } else if (hasEditions) {
      if (typeof openModalForEdit === 'function') openModalForEdit(item);
    } else {
      removeFromOrder(uid);
    }
  };

  const handleCardClick = () => {
    if (isCardDisabled) return;
    if (!isInlineSwitch && hasEditions && typeof openModalForEdit === 'function') {
      openModalForEdit(item);
    }
  };

  // Вычисляем отображаемую цену
  const displayPrice = isInlineSwitch
    ? activeEdition?.price
    : hasEditions
    ? `от ${price}`
    : price;

  // Вычисляем количество в корзине
  const currentPortion = isInlineSwitch ? activeEditionQty : portion;

  return (
    <div
      className={`${style.item} ${isCardDisabled ? style.itemStopped : ''}`}
      onClick={handleCardClick}
      style={{
        cursor: isCardDisabled
          ? 'not-allowed'
          : !isInlineSwitch && hasEditions
          ? 'pointer'
          : 'default',
      }}
    >
      <div className={style.desc}>
        <div className={style.desc__prop}>
          <h2 className={style.desc__title}>{title}</h2>
          {descr && <p className={style.desc__title_prop}>{descr}</p>}
        </div>

        {/* Переключатель прямо в карточке (Inline Segments) */}
        {isInlineSwitch && (
          <div className={style.inlineSegments}>
            {editions.map((ed, idx) => {
              const isEdStopped = stopList.includes(String(ed.uid));
              return (
                <button
                  key={ed.uid}
                  type="button"
                  className={`${style.segmentBtn} ${idx === selectedIdx ? style.segmentBtnActive : ''} ${isEdStopped ? style.segmentBtnStopped : ''}`}
                  onClick={(e) => {
                    e.stopPropagation();
                    setSelectedIdx(idx);
                  }}
                  title={isEdStopped ? 'Закончился' : ''}
                >
                  {ed.subtitle || ed.title}
                </button>
              );
            })}
          </div>
        )}

        <div className={style.desc__price}>
          <p className={style.desc__price_num}>{displayPrice} ₽</p>
          <div className={style.desc__price_addToCart}>
            {isCardDisabled ? (
              <span className={style.btnStopped}>Закончилось</span>
            ) : isInlineSwitch && isActiveEditionStopped ? (
              <span className={style.btnStopped}>Закончился</span>
            ) : !currentPortion ? (
              <button className={style.btn_add} onClick={handleAddClick}>
                {!isInlineSwitch && hasEditions ? 'Выбрать' : '+ Добавить'}
              </button>
            ) : (
              <div className={style.counter_group}>
                <button
                  className={style.desc__price_button}
                  onClick={handleRemoveClick}
                  aria-label="Убрать"
                >
                  −
                </button>
                <p className={style.desc__price_quantity}>{currentPortion}</p>
                <button
                  className={style.desc__price_button}
                  onClick={handleAddClick}
                  aria-label="Добавить"
                >
                  +
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      <div className={style.images}>
        {gallery ? (
          <img
            src={`/images/menu/${gallery}`}
            alt={title}
            loading="lazy"
            decoding="async"
          />
        ) : (
          <Placeholder />
        )}
      </div>
    </div>
  );
});

export default MenuItem;
