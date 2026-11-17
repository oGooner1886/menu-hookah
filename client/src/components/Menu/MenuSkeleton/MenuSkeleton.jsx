import React from 'react';
import style from './MenuSkeleton.module.css';

const MenuSkeleton = () => {
  return (
    <div className={style.skeletonWrapper} aria-hidden="true">
      {/* Скелетон табов категорий */}
      <div className={style.categoryTabsSkeleton}>
        <div className={`${style.tabPill} ${style.tabPillActive} ${style.shimmer}`} />
        <div className={`${style.tabPill} ${style.shimmer}`} />
        <div className={`${style.tabPill} ${style.shimmer}`} />
        <div className={`${style.tabPill} ${style.shimmer}`} />
        <div className={`${style.tabPill} ${style.shimmer}`} />
        <div className={`${style.tabPill} ${style.shimmer}`} />
        <div className={`${style.tabPill} ${style.shimmer}`} />
      </div>

      <div className={style.itemWrapper}>
        {/* Заголовок первой секции */}
        <div className={style.sectionHeaderSkeleton}>
          <div className={`${style.titleBar} ${style.shimmer}`} />
        </div>

        {/* Сетка скелетонов карточек (6 штук) */}
        <div className={style.cardsGrid}>
          {[...Array(6)].map((_, i) => (
            <div key={i} className={style.card}>
              <div className={style.cardDesc}>
                <div className={style.cardTextGroup}>
                  <div className={`${style.cardTitle} ${style.shimmer}`} />
                  <div className={`${style.cardLineLong} ${style.shimmer}`} />
                  <div className={`${style.cardLineShort} ${style.shimmer}`} />
                </div>
                <div className={style.cardBottom}>
                  <div className={`${style.cardPrice} ${style.shimmer}`} />
                  <div className={`${style.cardBtn} ${style.shimmer}`} />
                </div>
              </div>
              <div className={`${style.cardImage} ${style.shimmer}`} />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default MenuSkeleton;
