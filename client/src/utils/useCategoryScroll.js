import { useCallback, useEffect, useRef, useState } from 'react';

export const useCategoryScroll = (activeCategories = []) => {
  const sectionsRefs = useRef({});
  const [activeId, setActiveId] = useState(activeCategories[0]?.id || '');

  // Флаг: идёт ручной скролл — Observer не должен перезаписывать activeId
  const isManualScrolling = useRef(false);
  const scrollTimer = useRef(null);

  const registerSection = useCallback(
    (id) => (el) => {
      if (el) {
        sectionsRefs.current[id] = el;
      } else {
        delete sectionsRefs.current[id];
      }
    },
    [],
  );

  const scrollToCategory = useCallback((id) => {
    // Сразу переключаем активный таб
    setActiveId(id);

    // Блокируем Observer пока скролл не завершится
    isManualScrolling.current = true;
    clearTimeout(scrollTimer.current);

    const element = sectionsRefs.current[id];
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }

    // Разблокируем через ~800ms (smooth scroll обычно занимает ~500-700ms)
    scrollTimer.current = setTimeout(() => {
      isManualScrolling.current = false;
    }, 800);
  }, []);

  // Синхронизируем activeId при смене категорий (например после загрузки меню)
  useEffect(() => {
    if (activeCategories.length > 0 && !activeCategories.find((c) => c.id === activeId)) {
      setActiveId(activeCategories[0].id);
    }
  }, [activeCategories, activeId]);

  useEffect(() => {
    if (!activeCategories.length) return;

    const observerOptions = {
      root: null,
      // Секция считается активной когда её верхний край входит в зону 0–30% сверху
      rootMargin: '-10% 0px -70% 0px',
      threshold: 0,
    };

    const observer = new IntersectionObserver((entries) => {
      // Не перебиваем ручной скролл
      if (isManualScrolling.current) return;

      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          setActiveId(entry.target.id);
        }
      });
    }, observerOptions);

    activeCategories.forEach((cat) => {
      const el = sectionsRefs.current[cat.id];
      if (el) observer.observe(el);
    });

    return () => observer.disconnect();
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
