import React, { useState, useEffect } from 'react';
import style from './ModalMenu.module.css';

const ModalMenu = ({ item, closeModalForEdit, order = {}, addToOrder, removeFromOrder }) => {
  const { title, descr, gallery, editions = [], modalType } = item;
  const isCentered = modalType === 'centered_modal';

  // По умолчанию выбираем первую опцию
  const [selectedEdition, setSelectedEdition] = useState(editions[0] || null);

  // Закрытие по клавише Escape и блокировка скролла страницы
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') closeModalForEdit();
    };
    document.addEventListener('keydown', handleKeyDown);
    document.body.style.overflow = 'hidden';

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = '';
    };
  }, [closeModalForEdit]);

  if (!item) return null;

  const currentUid = selectedEdition?.uid;
  const currentQty = currentUid ? order[currentUid] || 0 : 0;
  const totalEditionsInOrder = editions.reduce((sum, ed) => sum + (order[ed.uid] || 0), 0);

  return (
    <div
      className={`${style.backdrop} ${isCentered ? style.backdropCentered : ''}`}
      onClick={closeModalForEdit}
    >
      <div
        className={isCentered ? style.centeredModal : style.bottomSheet}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Полоска-хваталка сверху (только для шторки) */}
        {!isCentered && (
          <div className={style.handleBarWrap}>
            <div className={style.handleBar} />
          </div>
        )}

        {/* Кнопка закрытия */}
        <button
          className={style.closeBtn}
          onClick={closeModalForEdit}
          aria-label="Закрыть"
        >
          ✕
        </button>

        {/* Картинка блюда */}
        {gallery && (
          <div className={isCentered ? style.imageWrapCentered : style.imageWrap}>
            <img
              src={`/images/menu/${gallery}`}
              alt={title}
              className={style.image}
              loading="lazy"
            />
          </div>
        )}

        {/* Заголовок и описание */}
        <div className={style.header}>
          <h2 className={style.title}>{title}</h2>
          {descr && <p className={style.descr}>{descr}</p>}
        </div>

        {/* Список опций */}
        {editions.length > 0 && (
          <div className={style.editionsSection}>
            <div className={style.sectionLabel}>
              {isCentered ? 'Выберите вкус:' : 'Выберите порцию:'}
            </div>

            {/* Классический вид: сетка круглых кнопок/пилюль (как было раньше) */}
            {isCentered ? (
              <div className={style.pillGrid}>
                {editions.map((ed) => {
                  const isSelected = selectedEdition?.uid === ed.uid;
                  const qty = order[ed.uid] || 0;

                  return (
                    <button
                      key={ed.uid}
                      type="button"
                      className={`${style.pillBtn} ${isSelected ? style.pillBtnActive : ''}`}
                      onClick={() => setSelectedEdition(ed)}
                    >
                      <span>{ed.subtitle || ed.title}</span>
                      {qty > 0 && (
                        <span className={isSelected ? style.pillBadgeActive : style.pillBadge}>
                          {qty}
                        </span>
                      )}
                    </button>
                  );
                })}
              </div>
            ) : (
              /* Вид шторки: аккуратный список строк с радио-кнопками */
              <div className={style.editionsList}>
                {editions.map((ed) => {
                  const isSelected = selectedEdition?.uid === ed.uid;
                  const qty = order[ed.uid] || 0;

                  return (
                    <div
                      key={ed.uid}
                      className={`${style.editionCard} ${isSelected ? style.editionCardSelected : ''}`}
                      onClick={() => setSelectedEdition(ed)}
                    >
                      <div className={style.editionLeft}>
                        <span className={style.editionName}>{ed.subtitle || ed.title}</span>
                        {qty > 0 && (
                          <span className={style.editionBadge}>{qty} в заказе</span>
                        )}
                      </div>

                      <div className={style.editionRight}>
                        <span className={style.editionPrice}>{ed.price} ₽</span>
                        <div
                          className={`${style.radio} ${isSelected ? style.radioSelected : ''}`}
                        >
                          {isSelected && <div className={style.radioInner} />}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}

        {/* Нижняя панель действий */}
        <div className={style.footer}>
          {currentQty === 0 ? (
            <button
              className={style.btnPrimary}
              onClick={() => {
                if (currentUid && addToOrder) {
                  addToOrder(currentUid);
                }
                closeModalForEdit();
              }}
            >
              Добавить {selectedEdition?.subtitle ? `«${selectedEdition.subtitle}»` : ''} • {selectedEdition?.price} ₽
            </button>
          ) : (
            <div className={style.counterFooter}>
              <div className={style.counterBlock}>
                <button
                  className={style.counterBtn}
                  onClick={() => removeFromOrder && removeFromOrder(currentUid)}
                  aria-label="Уменьшить"
                >
                  −
                </button>
                <span className={style.counterQty}>{currentQty}</span>
                <button
                  className={style.counterBtn}
                  onClick={() => addToOrder && addToOrder(currentUid)}
                  aria-label="Увеличить"
                >
                  +
                </button>
              </div>

              <button className={style.btnDone} onClick={closeModalForEdit}>
                Готово {totalEditionsInOrder > 0 ? `(${totalEditionsInOrder})` : ''}
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ModalMenu;
