import { useCallback, useEffect, useRef, useState } from 'react';

export const useCategoryScroll = (activeCategories = []) => {
  const sectionsRefs = useRef({});
  const callbackRefs = useRef({});
  const [activeId, setActiveId] = useState(activeCategories[0]?.id || '');

  // Флаг: идёт программный скролл — не перебивать activeId
  const isManualScrolling = useRef(false);
  const scrollTimer = useRef(null);

  // Стабильные ссылки на callback-ref для каждой категории (чтобы MenuSection не ререндерился)
  const registerSection = useCallback(
    (id) => {
      if (!callbackRefs.current[id]) {
        callbackRefs.current[id] = (el) => {
          if (el) {
            sectionsRefs.current[id] = el;
          } else {
            delete sectionsRefs.current[id];
          }
        };
      }
      return callbackRefs.current[id];
    },
    [],
  );

  const scrollToCategory = useCallback((id) => {
    // Сразу подсвечиваем нажатый таб
    setActiveId(id);

    // Блокируем авто-определение пока длится анимация плавного скролла
    isManualScrolling.current = true;
    clearTimeout(scrollTimer.current);

    const element = sectionsRefs.current[id];
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }

    const handleScrollEnd = () => {
      isManualScrolling.current = false;
      window.removeEventListener('scrollend', handleScrollEnd);
    };

    if ('onscrollend' in window) {
      window.addEventListener('scrollend', handleScrollEnd, { once: true });
    }

    // Резервный таймер (fallback для Safari/старых браузеров)
    scrollTimer.current = setTimeout(() => {
      isManualScrolling.current = false;
      window.removeEventListener('scrollend', handleScrollEnd);
    }, 1000);
  }, []);

  // Синхронизируем activeId при смене категорий (например после загрузки меню)
  useEffect(() => {
    if (activeCategories.length > 0 && !activeCategories.find((c) => c.id === activeId)) {
      setActiveId(activeCategories[0].id);
    }
  }, [activeCategories, activeId]);

  // Отслеживание текущей активной категории при обычном пользовательском скролле
  useEffect(() => {
    if (!activeCategories.length) return;

    let rafId = null;

    const updateActiveSection = () => {
      if (isManualScrolling.current) return;

      // 1. Проверка на достижение самого низа страницы (чтобы последняя короткая категория тоже подсвечивалась)
      const scrollY = window.scrollY || window.pageYOffset || 0;
      const windowHeight = window.innerHeight;
      const docHeight = document.documentElement.scrollHeight;

      if (windowHeight + scrollY >= docHeight - 50) {
        const lastCat = activeCategories[activeCategories.length - 1];
        if (lastCat) {
          setActiveId(lastCat.id);
          return;
        }
      }

      // 2. Если пользователь в самом верху страницы
      if (scrollY < 120) {
        setActiveId(activeCategories[0]?.id || '');
        return;
      }

      // 3. Ищем секцию, заголовок которой находится под панелью табов (100–180px от верха экрана)
      // На мобилках табы ниже ~90px, на десктопе ~140px
      const headerThreshold = window.innerWidth <= 640 ? 140 : 170;
      let matchedId = null;

      for (let i = 0; i < activeCategories.length; i++) {
        const cat = activeCategories[i];
        const el = sectionsRefs.current[cat.id];
        if (!el) continue;

        const rect = el.getBoundingClientRect();
        // Секция пересекает зону под плавающими табами
        if (rect.top <= headerThreshold && rect.bottom > headerThreshold - 50) {
          matchedId = cat.id;
          break;
        }
      }

      if (matchedId) {
        setActiveId(matchedId);
      }
    };

    const handleScroll = () => {
      if (isManualScrolling.current) return;
      if (rafId) cancelAnimationFrame(rafId);
      rafId = requestAnimationFrame(updateActiveSection);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });

    return () => {
      if (rafId) cancelAnimationFrame(rafId);
      window.removeEventListener('scroll', handleScroll);
    };
  }, [activeCategories]);

  // Очищаем таймер при размонтировании
  useEffect(() => {
    return () => clearTimeout(scrollTimer.current);
  }, []);

  return {
    activeId,
    scrollToCategory,
    registerSection,
  };
};
