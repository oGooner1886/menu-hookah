// import React, { useEffect } from 'react';
// import style from './Modal.module.css';

// const Modal = ({ active, setActive }) => {
//   // Закрытие по Escape
//   useEffect(() => {
//     const handleEscape = (e) => {
//       if (e.key === 'Escape' && active) {
//         setActive(false);
//       }
//     };

//     document.addEventListener('keydown', handleEscape);
//     return () => document.removeEventListener('keydown', handleEscape);
//   }, [active, setActive]);

//   // Закрытие по клику на backdrop
//   const handleBackdropClick = (e) => {
//     if (e.target === e.currentTarget) {
//       setActive(false);
//     }
//   };

//   if (!active) return null;

//   return (
//     <div 
//       className={style.modal} 
//       onClick={handleBackdropClick}
//       role="dialog"
//       aria-modal="true"
//       aria-labelledby="modal-title"
//     >
//       <div className={style.modal__content}>
//         {/* Кнопка закрытия */}
//         <button 
//           className={style.closeBtn}
//           onClick={() => setActive(false)}
//           aria-label="Закрыть"
//         >
//           ✕
//         </button>

//         <div className={style.modal__header}>
//           <h1 id="modal-title">Рады приветствовать вас в Gusto Lounge</h1>
//           <h2>Обращаем ваше внимание на важные правила заведения</h2>
//         </div>

//         <div className={style.modal__body}>
//           <ul className={style.rulesList}>
//             <li>Вход только для лиц <strong>старше 18 лет</strong>. Будьте готовы предъявить документ.</li>
//             <li>При посещении заведения <strong>заказ кальяна обязателен</strong>.</li>
//             <li>Один кальян рассчитан на 4 человека. Для большего количества — пропорционально.</li>
//             <li>Один кальян — 2 часа курения, после чего заказывается новый.</li>
//             <li>Сервисный сбор — <strong>5%</strong> от суммы чека.</li>
//           </ul>
//         </div>

//         <div className={style.modal__footer}>
//           <button 
//             onClick={() => setActive(false)}
//             className={style.agreeBtn}
//           >
//             Я СОГЛАСЕН С ПРАВИЛАМИ
//           </button>
//           <p className={style.footerText}>
//             Соблюдение правил помогает нам создавать комфортную атмосферу для всех гостей
//           </p>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default Modal;

// .modal {
//   position: fixed;
//   inset: 0;
//   background-color: rgba(0, 0, 0, 0.75);
//   display: flex;
//   align-items: center;
//   justify-content: center;
//   z-index: 10000;
//   opacity: 0;
//   visibility: hidden;
//   transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
//   backdrop-filter: blur(8px);
// }

// .modalActive {
//   opacity: 1;
//   visibility: visible;
// }

// .modal__content {
//   background: white;
//   max-width: 620px;
//   width: 92%;
//   border-radius: 20px;
//   box-shadow: 0 25px 50px -12px rgb(0 0 0 / 0.4);
//   position: relative;
//   overflow: hidden;
//   transform: scale(0.95);
//   transition: transform 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
//   animation: modalPop 0.4s cubic-bezier(0.34, 1.56, 0.64, 1) forwards;
// }

// @keyframes modalPop {
//   to {
//     transform: scale(1);
//   }
// }

// /* Header */
// .modal__header {
//   padding: 32px 32px 20px;
//   text-align: center;
//   border-bottom: 1px solid #f1f1f1;
// }

// .modal__header h1 {
//   font-size: 26px;
//   font-weight: 800;
//   margin: 0 0 12px 0;
//   line-height: 1.2;
//   color: #1f2937;
// }

// .modal__header h2 {
//   font-size: 17px;
//   font-weight: 600;
//   color: #4b5563;
//   margin: 0;
// }

// /* Body */
// .modal__body {
//   padding: 24px 32px;
//   font-size: 16.5px;
//   line-height: 1.65;
//   color: #374151;
// }

// .rulesList {
//   list-style: none;
//   padding: 0;
//   margin: 0;
// }

// .rulesList li {
//   padding: 12px 0 12px 28px;
//   position: relative;
//   border-bottom: 1px solid #f3f4f6;
// }

// .rulesList li:last-child {
//   border-bottom: none;
// }

// .rulesList li::before {
//   content: "•";
//   position: absolute;
//   left: 0;
//   color: #5ca1e1;
//   font-size: 22px;
//   line-height: 1;
// }

// /* Footer */
// .modal__footer {
//   padding: 20px 32px 32px;
//   text-align: center;
//   background: #f8fafc;
// }

// .agreeBtn {
//   background: linear-gradient(135deg, #5ca1e1, #3b8ad1);
//   color: white;
//   border: none;
//   padding: 16px 48px;
//   font-size: 18px;
//   font-weight: 700;
//   border-radius: 12px;
//   cursor: pointer;
//   transition: all 0.3s ease;
//   box-shadow: 0 10px 15px -3px rgb(92 161 225 / 0.3);
//   margin-bottom: 16px;
// }

// .agreeBtn:hover {
//   transform: translateY(-2px);
//   box-shadow: 0 20px 25px -5px rgb(92 161 225 / 0.4);
// }

// .footerText {
//   font-size: 14px;
//   color: #6b7280;
//   margin: 0;
// }

// /* Close button */
// .closeBtn {
//   position: absolute;
//   top: 16px;
//   right: 16px;
//   width: 40px;
//   height: 40px;
//   border-radius: 50%;
//   border: none;
//   background: rgba(0, 0, 0, 0.05);
//   color: #6b7280;
//   font-size: 20px;
//   cursor: pointer;
//   display: flex;
//   align-items: center;
//   justify-content: center;
//   transition: all 0.2s;
//   z-index: 10;
// }

// .closeBtn:hover {
//   background: rgba(0, 0, 0, 0.1);
//   color: #374151;
// }

// /* Адаптив */
// @media (max-width: 640px) {
//   .modal__content {
//     width: 96%;
//     margin: 10px;
//   }

//   .modal__header,
//   .modal__body,
//   .modal__footer {
//     padding-left: 24px;
//     padding-right: 24px;
//   }

//   .modal__header h1 {
//     font-size: 22px;
//   }
// }