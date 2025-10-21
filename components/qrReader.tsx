'use client';

import { useState, useEffect, useRef } from 'react';
import { BrowserQRCodeReader, IScannerControls } from '@zxing/browser';

interface QRCameraScannerProps {
  onScanResult: (result: string) => void;
}

export default function QRCameraScanner({ onScanResult }: QRCameraScannerProps) {
  const [isScanning, setIsScanning] = useState(false);
  const [cameras, setCameras] = useState<MediaDeviceInfo[]>([]);
  const [selectedCamera, setSelectedCamera] = useState<string>('');
  const [permissionDenied, setPermissionDenied] = useState(false);
  const [scanSuccess, setScanSuccess] = useState(false);

  const videoRef = useRef<HTMLVideoElement>(null);
  const controlsRef = useRef<IScannerControls | null>(null);

  useEffect(() => {
    const initCameras = async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ video: true });
        stream.getTracks().forEach((t) => t.stop());

        const devices = await navigator.mediaDevices.enumerateDevices();
        const videoDevices = devices.filter((d) => d.kind === 'videoinput');
        setCameras(videoDevices);
        if (videoDevices[0]) setSelectedCamera(videoDevices[0].deviceId);
      } catch {
        setPermissionDenied(true);
      }
    };
    initCameras();

    return () => {
      stopScanner();
    };
  }, []);

  const startScanner = async () => {
    if (!selectedCamera || !videoRef.current) return;
    try {
      setIsScanning(true);
      setScanSuccess(false);
      setPermissionDenied(false);

      const stream = await navigator.mediaDevices.getUserMedia({
        video: { deviceId: selectedCamera },
      });
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        await videoRef.current.play();
      }

      const hints = new Map();
      //hints.set(DecodeHintType.TRY_HARDER, true);

      const codeReader = new BrowserQRCodeReader();
      controlsRef.current = await codeReader.decodeFromVideoDevice(
        selectedCamera,
        videoRef.current,
        (result: any) => {
          if (result) {
            setScanSuccess(true);
            onScanResult(result.getText());
            stopScanner();
          }
        },
      );
    } catch {
      setPermissionDenied(true);
      setIsScanning(false);
    }
  };

  const stopScanner = () => {
    controlsRef.current?.stop();
    if (videoRef.current?.srcObject) {
      const tracks = (videoRef.current.srcObject as MediaStream).getTracks();
      tracks.forEach((t) => t.stop());
      videoRef.current.srcObject = null;
    }
    setIsScanning(false);
  };

  return (
    <div style={{ maxWidth: 400, margin: '0 auto', textAlign: 'center' }}>
      <div style={{ position: 'relative', width: '100%', height: 300, backgroundColor: '#000' }}>
        <video
          ref={videoRef}
          style={{ width: '100%', height: '100%', objectFit: 'cover' }}
          playsInline
          muted
        />
        {!isScanning && !scanSuccess && (
          <div
            onClick={startScanner}
            style={{
              color: '#fff',
              position: 'absolute',
              top: '40%',
              width: '100%',
              whiteSpace: 'pre-line',
            }}
          >
            {permissionDenied ? 'Camera denied' : 'Look around \n(press to scan QR Code)'}
          </div>
        )}
        {scanSuccess && (
          <div
            style={{
              position: 'absolute',
              inset: 0,
              backgroundColor: 'rgba(0,0,0,0.6)',
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              color: 'white',
            }}
          >
            <div onClick={startScanner}>
              No location found!
              <br />
              (Press t try again)
            </div>
          </div>
        )}
      </div>

      {/*
      <div style={{ marginTop: 10 }}>
        <select
          value={selectedCamera}
          onChange={(e) => setSelectedCamera(e.target.value)}
          disabled={isScanning}
          style={{ width: '100%', padding: 8 }}
        >
					
          
					cameras.map(cam => (
            <option key={cam.deviceId} value={cam.deviceId}>
              {cam.label || `Câmera ${cameras.indexOf(cam) + 1}`}
            </option>
          ))
				
        </select>
      </div>
			/** */}

      <div style={{ marginTop: 10 }}>
        {isScanning && (
          <button onClick={stopScanner} style={{ width: '100%', padding: 10 }}>
            Cancel
          </button>
        )}
      </div>
    </div>
  );
}
