import { useCallback, useEffect, useRef, useState } from 'react';

export const useCategoryScroll = (activeCategories = []) => {
  const sectionsRefs = useRef({});
  const [activeId, setActiveId] = useState(activeCategories[0]?.id || '');

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
    setActiveId(id);
    const element = sectionsRefs.current[id];
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }, []);

  useEffect(() => {
    if (!activeCategories) return;
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
      const el = sectionsRefs.current[cat.id];
      if (el) observer.observe(el);
    });

    return () => observer.disconnect();
  }, [activeCategories]);

  return {
    activeId,
    scrollToCategory,
    registerSection,
  };
};
