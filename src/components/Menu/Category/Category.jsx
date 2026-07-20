import React, { memo, useEffect, useState } from 'react';
import style from './Category.module.css';
import { useStore } from '../../../store/useStore';
import { CATEGORIES_CONFIG } from './../../../config/categories';

const Category = memo(() => {
  const branch = useStore((state) => state.branch);

  const activeCategories = CATEGORIES_CONFIG.filter((cat) => cat.branches.includes(branch));

  const [activeId, setActiveId] = useState(activeCategories[0]?.id || '');

  const scrollToCategory = (id) => {
    setActiveId(id);
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  useEffect(() => {
    const observerOptions = {
      root: null,
      rootMargin: '-20% 0px -80% 0px',
    };
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          setActiveId(entry.target.id);
        }
      });
    }, observerOptions);
    activeCategories.forEach((cat) => {
      const el = document.getElementById(cat.id);
      if (el) observer.observe(el);
    });
    return () => observer.disconnect();
  }, [activeCategories]);

  return (
    <div className={style.wrapper}>
      <div className={style.category}>
        {activeCategories.map(({ id, label }) => (
          <button
            key={id}
            onClick={() => scrollToCategory(id)}
            className={activeId === id ? style.category__item_active : style.category__item}
          >
            {/* <button className={style.category__item_btn}> */}
            <span className={style.category__item_text}>{label}</span>
            {/* </button> */}
          </button>
        ))}
      </div>
    </div>
  );
});

Category.displayName = 'Category';
export default Category;
