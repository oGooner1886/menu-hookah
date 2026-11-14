import React, { useState, useEffect, useRef } from 'react';
import style from './ModalMenu.module.css';

const ModalMenu = ({
  item,
  closeModalForEdit,
  order = {},
  stopList = [],
  addToOrder,
  removeFromOrder,
}) => {
  const { title, descr, gallery, editions = [] } = item || {};

  // Доступные опции (не в стоп-листе)
  const availableEditions = editions.filter((ed) => !stopList.includes(String(ed.uid)));

  // Выбранная опция (по умолчанию первая доступная или первая из списка)
  const [selectedEdition, setSelectedEdition] = useState(
    availableEditions[0] || editions[0] || null
  );

  // Свайп / перетягивание вниз для быстрого закрытия на мобильных устройствах
  const [dragY, setDragY] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const touchStartY = useRef(0);
  const touchCurrentY = useRef(0);

  // Закрытие по клавише Escape и блокировка скролла фона
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
  const isCurrentStopped = currentUid ? stopList.includes(String(currentUid)) : false;
  const currentQty = currentUid ? order[currentUid] || 0 : 0;
  const totalEditionsInOrder = editions.reduce((sum, ed) => sum + (order[ed.uid] || 0), 0);

  // Обработка свайпа вниз
  const handleTouchStart = (e) => {
    touchStartY.current = e.touches[0].clientY;
    touchCurrentY.current = touchStartY.current;
    setIsDragging(true);
  };

  const handleTouchMove = (e) => {
    if (!isDragging) return;
    const currentY = e.touches[0].clientY;
    touchCurrentY.current = currentY;
    const delta = currentY - touchStartY.current;
    if (delta > 0) {
      setDragY(delta);
    }
  };

  const handleTouchEnd = () => {
    if (!isDragging) return;
    setIsDragging(false);
    const delta = touchCurrentY.current - touchStartY.current;
    if (delta > 85) {
      closeModalForEdit();
    }
    setDragY(0);
  };

  // Контекстная метка секции в зависимости от позиций
  const getSectionLabel = () => {
    const lowerTitle = (title || '').toLowerCase();
    if (
      lowerTitle.includes('соус') ||
      editions.some((e) => (e.subtitle || e.title || '').toLowerCase().includes('соус'))
    ) {
      return 'Выберите соус:';
    }
    if (editions.some((e) => /л|мл|г|гр/i.test(e.subtitle || e.weight || ''))) {
      return 'Выберите объём / порцию:';
    }
    return 'Выберите вариант:';
  };

  // Корректный путь к изображению
  const imageSrc = gallery
    ? gallery.startsWith('/')
      ? `/images/menu${gallery}`
      : `/images/menu/${gallery}`
    : null;

  return (
    <div className={style.backdrop} onClick={closeModalForEdit}>
      <div
        className={style.bottomSheet}
        style={{
          transform: dragY > 0 ? `translateY(${dragY}px)` : undefined,
          transition: isDragging ? 'none' : 'transform 0.25s cubic-bezier(0.16, 1, 0.3, 1)',
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Верхняя панель со свайп-хватателем */}
        <div
          className={style.handleBarWrap}
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleTouchEnd}
        >
          <div className={style.handleBar} />
        </div>

        {/* Кнопка закрытия ✕ */}
        <button
          className={style.closeBtn}
          onClick={closeModalForEdit}
          aria-label="Закрыть"
        >
          ✕
        </button>

        {/* Скроллируемая область контента */}
        <div className={style.scrollContent}>
          {/* Фотография блюда */}
          {imageSrc && (
            <div className={style.imageWrap}>
              <img
                src={imageSrc}
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

          {/* Список модификаторов / порций */}
          {editions.length > 0 && (
            <div className={style.editionsSection}>
              <div className={style.sectionHeader}>
                <span className={style.sectionLabel}>{getSectionLabel()}</span>
                <span className={style.sectionBadge}>1 вариант</span>
              </div>

              <div className={style.editionsList}>
                {editions.map((ed) => {
                  const isSelected = selectedEdition?.uid === ed.uid;
                  const isStopped = stopList.includes(String(ed.uid));
                  const qty = order[ed.uid] || 0;

                  return (
                    <div
                      key={ed.uid}
                      className={`${style.editionCard} ${
                        isSelected ? style.editionCardSelected : ''
                      } ${isStopped ? style.editionCardStopped : ''}`}
                      onClick={() => !isStopped && setSelectedEdition(ed)}
                      style={{ cursor: isStopped ? 'not-allowed' : 'pointer' }}
                    >
                      <div className={style.editionLeft}>
                        <div className={style.editionTitleRow}>
                          <span className={style.editionName}>
                            {ed.subtitle || ed.title}
                          </span>
                          {ed.weight && ed.weight !== (ed.subtitle || ed.title) && (
                            <span className={style.editionWeight}>{ed.weight}</span>
                          )}
                        </div>

                        {isStopped ? (
                          <span className={style.badgeStopped}>Закончилось</span>
                        ) : qty > 0 ? (
                          <span className={style.editionBadge}>
                            {qty} в заказе
                          </span>
                        ) : null}
                      </div>

                      <div className={style.editionRight}>
                        <span className={style.editionPrice}>{ed.price} ₽</span>
                        {!isStopped && (
                          <div
                            className={`${style.radio} ${
                              isSelected ? style.radioSelected : ''
                            }`}
                          >
                            {isSelected && <div className={style.radioInner} />}
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>

        {/* Нижняя фиксированная панель действий */}
        <div className={style.footer}>
          {isCurrentStopped ? (
            <button className={`${style.btnPrimary} ${style.btnPrimaryDisabled}`} disabled>
              {selectedEdition?.subtitle ? `«${selectedEdition.subtitle}» закончился` : 'Закончилось'}
            </button>
          ) : currentQty === 0 ? (
            <button
              className={style.btnPrimary}
              onClick={() => {
                if (currentUid && addToOrder) {
                  addToOrder(currentUid);
                }
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
