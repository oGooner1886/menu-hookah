import React, { useEffect, useRef, useState } from 'react';
import jsQR from 'jsqr';
import styles from './QrScannerModal.module.css';

/**
 * Минималистичный встроенный сканер QR-кода столика.
 * Позволяет подтвердить стол прямо со страницы заказа без перезагрузки и потери корзины.
 */
const QrScannerModal = ({ isOpen, onClose, onScanSuccess }) => {
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const [cameraError, setCameraError] = useState(null);
  const [scanWarning, setScanWarning] = useState(null);

  useEffect(() => {
    if (!isOpen) return;

    let stream = null;
    let rafId = null;
    let isActive = true;
    let lastScanTime = 0;

    setCameraError(null);
    setScanWarning(null);

    const stopCamera = () => {
      isActive = false;
      if (rafId) cancelAnimationFrame(rafId);
      if (stream) {
        stream.getTracks().forEach((track) => track.stop());
      }
    };

    const tick = (now) => {
      if (!isActive) return;

      const video = videoRef.current;
      const canvas = canvasRef.current;

      // Сканируем кадр каждые ~150 мс, чтобы не нагружать процессор телефона
      if (video && canvas && video.readyState === video.HAVE_ENOUGH_DATA && now - lastScanTime > 150) {
        lastScanTime = now;
        const width = video.videoWidth;
        const height = video.videoHeight;

        if (width > 0 && height > 0) {
          canvas.width = width;
          canvas.height = height;
          const ctx = canvas.getContext('2d', { willReadFrequently: true });
          ctx.drawImage(video, 0, 0, width, height);

          const imageData = ctx.getImageData(0, 0, width, height);
          const qr = jsQR(imageData.data, imageData.width, imageData.height, {
            inversionAttempts: 'dontInvert',
          });

          if (qr?.data) {
            try {
              const parsed = new URL(qr.data, window.location.origin);
              const table = parsed.searchParams.get('table') || parsed.searchParams.get('t');
              const sign = parsed.searchParams.get('sign') || parsed.searchParams.get('s');

              if (table && sign) {
                stopCamera();
                onScanSuccess(table, sign);
                return;
              } else {
                setScanWarning('Этот QR-код не содержит подпись столика');
              }
            } catch {
              setScanWarning('Неизвестный формат QR-кода');
            }
          }
        }
      }

      rafId = requestAnimationFrame(tick);
    };

    const startCamera = async () => {
      if (!navigator.mediaDevices?.getUserMedia) {
        setCameraError('Камера недоступна в этом браузере. Откройте камеру телефона и наведите на QR-код стола.');
        return;
      }

      try {
        stream = await navigator.mediaDevices.getUserMedia({
          video: { facingMode: { ideal: 'environment' } },
          audio: false,
        });

        if (!isActive) {
          stream.getTracks().forEach((t) => t.stop());
          return;
        }

        if (videoRef.current) {
          videoRef.current.srcObject = stream;
          await videoRef.current.play();
          rafId = requestAnimationFrame(tick);
        }
      } catch {
        setCameraError('Нет доступа к камере. Разрешите доступ в настройках браузера или наведите штатную камеру телефона.');
      }
    };

    startCamera();

    return stopCamera;
  }, [isOpen, onScanSuccess]);

  if (!isOpen) return null;

  return (
    <div className={styles.overlay} onClick={onClose}>
      <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
        <div className={styles.header}>
          <h3 className={styles.title}>QR-код столика</h3>
          <button type="button" className={styles.closeBtn} onClick={onClose} aria-label="Закрыть">
            ×
          </button>
        </div>

        <div className={styles.viewport}>
          {cameraError ? (
            <div className={styles.errorBox}>{cameraError}</div>
          ) : (
            <>
              <video ref={videoRef} className={styles.video} playsInline muted />
              <div className={styles.frame} />
            </>
          )}
        </div>

        <canvas ref={canvasRef} style={{ display: 'none' }} />

        <div className={`${styles.hint} ${scanWarning ? styles.hintError : ''}`}>
          {scanWarning || 'Наведите камеру на QR-код на вашем столе'}
        </div>
      </div>
    </div>
  );
};

export default QrScannerModal;
