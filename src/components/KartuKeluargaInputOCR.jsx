import React, { useState, useRef } from 'react';
import Tesseract from 'tesseract.js';
import { Html5QrcodeScanner } from 'html5-qrcode';
import { 
  Upload, 
  Camera, 
  Keyboard, 
  QrCode, 
  AlertCircle, 
  Check, 
  Loader 
} from 'lucide-react';
import Swal from 'sweetalert2';
import './KartuKeluargaInputOCR.css';

export default function KartuKeluargaInputOCR() {
  const [inputMode, setInputMode] = useState('manual');
  const [kkNumber, setKkNumber] = useState('');
  const [kkData, setKkData] = useState(null); // Data dari OCR
  const [loading, setLoading] = useState(false);
  const [ocrProgress, setOcrProgress] = useState(0);
  const [cameraActive, setCameraActive] = useState(false);
  const [uploadPreview, setUploadPreview] = useState(null);
  const fileInputRef = useRef(null);
  const videoRef = useRef(null);
  const scannerRef = useRef(null);

  // ===== MODE 1: INPUT MANUAL =====
  const handleManualInput = (e) => {
    const value = e.target.value.replace(/\D/g, '');
    setKkNumber(value);
  };

  // ===== MODE 2: OCR DARI GAMBAR =====
  const handleFileUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setLoading(true);
    setOcrProgress(0);

    try {
      const reader = new FileReader();
      reader.onload = async (event) => {
        setUploadPreview(event.target.result);
        await performOCR(event.target.result);
      };
      reader.readAsDataURL(file);
    } catch (error) {
      Swal.fire('Error', 'Gagal membaca gambar', 'error');
      setLoading(false);
    }
  };

  const performOCR = async (imageSrc) => {
    try {
      Swal.fire({
        title: 'Memproses Gambar',
        html: '<div class="progress"><div class="progress-bar" style="width: 0%"></div></div><p class="mt-2">Mengekstrak teks dari gambar...</p>',
        allowOutsideClick: false,
        didOpen: async () => {
          const worker = await Tesseract.createWorker('ind'); // Indonesian language

          const result = await worker.recognize(imageSrc);
          const text = result.data.text;

          await worker.terminate();

          // Ekstrak nomor KK (16 digit)
          const kkMatch = text.match(/\b\d{16}\b/);
          
          // Ekstrak informasi lainnya
          const extractedData = extractKKData(text);

          if (kkMatch) {
            setKkNumber(kkMatch[0]);
            setKkData(extractedData);
            
            Swal.fire({
              title: 'Sukses!',
              html: `
                <div class="text-start">
                  <p><strong>Nomor KK:</strong> ${kkMatch[0]}</p>
                  ${extractedData.nama ? `<p><strong>Nama:</strong> ${extractedData.nama}</p>` : ''}
                  ${extractedData.alamat ? `<p><strong>Alamat:</strong> ${extractedData.alamat}</p>` : ''}
                  ${extractedData.kota ? `<p><strong>Kota:</strong> ${extractedData.kota}</p>` : ''}
                </div>
              `,
              icon: 'success',
            });
          } else {
            Swal.fire({
              title: 'Informasi',
              text: 'Nomor KK tidak terdeteksi. Silakan input manual atau coba upload gambar lain.',
              icon: 'info',
            });
          }

          setLoading(false);
        },
      });
    } catch (error) {
      console.error('OCR Error:', error);
      Swal.fire('Error', 'Gagal memproses gambar dengan OCR', 'error');
      setLoading(false);
    }
  };

  // Fungsi untuk mengekstrak data KK dari teks
  const extractKKData = (text) => {
    const data = {
      kkNumber: '',
      nama: '',
      alamat: '',
      kota: '',
      tglLahir: '',
      pekerjaan: '',
      agama: '',
    };

    // Ekstrak Nomor KK (16 digit)
    const kkMatch = text.match(/\b\d{16}\b/);
    if (kkMatch) data.kkNumber = kkMatch[0];

    // Ekstrak Nama (biasanya di baris pertama atau setelah "Nama")
    const namaMatch = text.match(/(?:Nama|NAMA)\s*:?\s*([A-Z][A-Za-z\s]+)/i);
    if (namaMatch) data.nama = namaMatch[1].trim();

    // Ekstrak Alamat
    const alamatMatch = text.match(/(?:Alamat|ALAMAT)\s*:?\s*([^,\n]+)/i);
    if (alamatMatch) data.alamat = alamatMatch[1].trim();

    // Ekstrak Kota/Kabupaten
    const kotaMatch = text.match(/(?:Kota|Kabupaten|KOTA|KABUPATEN)\s*:?\s*([A-Za-z\s]+)/i);
    if (kotaMatch) data.kota = kotaMatch[1].trim();

    // Ekstrak Tanggal Lahir (format: DD/MM/YYYY atau DD-MM-YYYY)
    const tglMatch = text.match(/\d{1,2}[-\/]\d{1,2}[-\/]\d{4}/);
    if (tglMatch) data.tglLahir = tglMatch[0];

    // Ekstrak Pekerjaan
    const pekerjaanMatch = text.match(/(?:Pekerjaan|PEKERJAAN)\s*:?\s*([A-Za-z\s]+)/i);
    if (pekerjaanMatch) data.pekerjaan = pekerjaanMatch[1].trim();

    // Ekstrak Agama
    const agamaMatch = text.match(/(Islam|Kristen|Katolik|Hindu|Buddha|Konghucu)/i);
    if (agamaMatch) data.agama = agamaMatch[1];

    return data;
  };

  // ===== MODE 3: KAMERA REAL-TIME =====
  const startCamera = async () => {
    try {
      setCameraActive(true);
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: 'environment' },
      });

      if (videoRef.current) {
        videoRef.current.srcObject = stream;

        const scanner = new Html5QrcodeScanner(
          'qr-reader-camera',
          { fps: 10, qrbox: { width: 250, height: 250 } },
          false
        );

        scanner.render(
          (result) => {
            setKkNumber(result);
            stopCamera(stream, scanner);
            Swal.fire('Sukses!', `Nomor KK: ${result}`, 'success');
          },
          (error) => {
            console.log('Scan error:', error);
          }
        );

        scannerRef.current = scanner;
      }
    } catch (error) {
      Swal.fire(
        'Error',
        'Tidak dapat mengakses kamera. Pastikan Anda memberikan izin.',
        'error'
      );
      setCameraActive(false);
    }
  };

  const stopCamera = (stream, scanner) => {
    if (stream) {
      stream.getTracks().forEach((track) => track.stop());
    }
    if (scanner) {
      scanner.clear();
    }
    setCameraActive(false);
  };

  const handleStopCamera = () => {
    if (scannerRef.current) {
      scannerRef.current.clear();
    }
    if (videoRef.current?.srcObject) {
      videoRef.current.srcObject.getTracks().forEach((track) => track.stop());
    }
    setCameraActive(false);
  };

  // ===== SUBMIT =====
  const handleSubmit = (e) => {
    e.preventDefault();
    if (!kkNumber || kkNumber.length < 16) {
      Swal.fire('Error', 'Nomor KK harus 16 digit', 'error');
      return;
    }

    // Prepare data to send
    const submitData = {
      kkNumber,
      ...kkData,
      source: inputMode, // manual, upload, atau camera
    };

    Swal.fire('Sukses!', `Nomor KK: ${kkNumber} berhasil didaftarkan`, 'success').then(
      () => {
        console.log('Submit KK Data:', submitData);
        // Kirim ke backend
        // sendToBackend(submitData);
      }
    );
  };

  return (
    <div className="container mt-5 mb-5">
      <div className="card shadow-lg">
        <div className="card-header bg-primary text-white">
          <h4 className="mb-0">
            <QrCode className="me-2" size={24} style={{ display: 'inline' }} />
            Input Kartu Keluarga (KK) dengan OCR
          </h4>
          <small>Scan, Upload, atau Input Manual</small>
        </div>

        <div className="card-body p-4">
          {/* MODE SELECTOR */}
          <div className="btn-group mb-4 w-100" role="group">
            <button
              type="button"
              className={`btn btn-sm ${
                inputMode === 'manual' ? 'btn-primary' : 'btn-outline-primary'
              }`}
              onClick={() => {
                setInputMode('manual');
                setUploadPreview(null);
                handleStopCamera();
              }}
            >
              <Keyboard size={18} className="me-2" style={{ display: 'inline' }} />
              Manual
            </button>

            <button
              type="button"
              className={`btn btn-sm ${
                inputMode === 'upload' ? 'btn-primary' : 'btn-outline-primary'
              }`}
              onClick={() => {
                setInputMode('upload');
                handleStopCamera();
              }}
            >
              <Upload size={18} className="me-2" style={{ display: 'inline' }} />
              Upload OCR
            </button>

            <button
              type="button"
              className={`btn btn-sm ${
                inputMode === 'camera' ? 'btn-primary' : 'btn-outline-primary'
              }`}
              onClick={() => {
                setInputMode('camera');
                setUploadPreview(null);
              }}
            >
              <Camera size={18} className="me-2" style={{ display: 'inline' }} />
              Kamera
            </button>
          </div>

          <form onSubmit={handleSubmit}>
            {/* MODE 1: MANUAL */}
            {inputMode === 'manual' && (
              <div className="mb-3">
                <label className="form-label fw-bold">
                  Masukkan Nomor KK (16 digit)
                </label>
                <input
                  type="text"
                  className="form-control form-control-lg"
                  placeholder="1234567890123456"
                  value={kkNumber}
                  onChange={handleManualInput}
                  maxLength="16"
                  required
                />
                <small className="text-muted">
                  {kkNumber.length}/16 digit
                </small>
              </div>
            )}

            {/* MODE 2: UPLOAD FILE DENGAN OCR */}
            {inputMode === 'upload' && (
              <div className="mb-3">
                <label className="form-label fw-bold">
                  Upload Foto KK (OCR akan mengekstrak data otomatis)
                </label>
                <div
                  className="border-2 border-dashed rounded p-4 text-center bg-light"
                  onClick={() => fileInputRef.current?.click()}
                  style={{ cursor: 'pointer', borderColor: '#007bff' }}
                >
                  <Upload size={32} className="text-primary mb-2" />
                  <p className="mb-1">
                    Klik untuk upload atau drag & drop gambar KK
                  </p>
                  <small className="text-muted">
                    (JPG, PNG, maksimal 5MB) - OCR akan mengekstrak nomor dan data
                  </small>
                </div>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleFileUpload}
                  hidden
                />

                {uploadPreview && (
                  <div className="mt-3">
                    <img
                      src={uploadPreview}
                      alt="Preview KK"
                      style={{
                        maxWidth: '100%',
                        maxHeight: '300px',
                        borderRadius: '8px',
                        border: '2px solid #28a745',
                      }}
                    />
                  </div>
                )}

                {loading && (
                  <div className="mt-3 text-center">
                    <div className="spinner-border text-primary" role="status">
                      <span className="visually-hidden">Loading...</span>
                    </div>
                    <p className="mt-2">Memproses OCR... ({ocrProgress}%)</p>
                    <div className="progress mt-2">
                      <div
                        className="progress-bar"
                        style={{ width: `${ocrProgress}%` }}
                      ></div>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* MODE 3: KAMERA */}
            {inputMode === 'camera' && (
              <div className="mb-3">
                <label className="form-label fw-bold">
                  Scan Barcode dengan Kamera
                </label>
                {!cameraActive ? (
                  <button
                    type="button"
                    className="btn btn-success w-100 btn-lg"
                    onClick={startCamera}
                  >
                    <Camera size={20} className="me-2" style={{ display: 'inline' }} />
                    Buka Kamera
                  </button>
                ) : (
                  <div className="scanner-container">
                    <div id="qr-reader-camera" style={{ width: '100%' }}></div>
                    <button
                      type="button"
                      className="btn btn-danger w-100 mt-3"
                      onClick={handleStopCamera}
                    >
                      Hentikan Kamera
                    </button>
                  </div>
                )}
              </div>
            )}

            {/* HASIL INPUT - NOMOR KK */}
            {kkNumber && (
              <div className="alert alert-success alert-dismissible fade show">
                <Check size={20} className="me-2" style={{ display: 'inline' }} />
                <strong>Nomor KK Terdeteksi:</strong>{' '}
                <span className="fs-5 fw-bold">{kkNumber}</span>
              </div>
            )}

            {/* DATA OCR YANG TEREKSTRAK */}
            {kkData && (
              <div className="card bg-light mb-3">
                <div className="card-header bg-info text-white">
                  <strong>Data Terekstrak dari OCR</strong>
                </div>
                <div className="card-body">
                  {kkData.nama && (
                    <p className="mb-2">
                      <strong>Nama Kepala Keluarga:</strong> {kkData.nama}
                    </p>
                  )}
                  {kkData.alamat && (
                    <p className="mb-2">
                      <strong>Alamat:</strong> {kkData.alamat}
                    </p>
                  )}
                  {kkData.kota && (
                    <p className="mb-2">
                      <strong>Kota/Kabupaten:</strong> {kkData.kota}
                    </p>
                  )}
                  {kkData.tglLahir && (
                    <p className="mb-2">
                      <strong>Tanggal Lahir:</strong> {kkData.tglLahir}
                    </p>
                  )}
                  {kkData.pekerjaan && (
                    <p className="mb-2">
                      <strong>Pekerjaan:</strong> {kkData.pekerjaan}
                    </p>
                  )}
                  {kkData.agama && (
                    <p className="mb-0">
                      <strong>Agama:</strong> {kkData.agama}
                    </p>
                  )}
                </div>
              </div>
            )}

            {/* SUBMIT BUTTON */}
            <button
              type="submit"
              className="btn btn-primary w-100 btn-lg mt-3"
              disabled={!kkNumber || kkNumber.length < 16 || loading}
            >
              <Check size={20} className="me-2" style={{ display: 'inline' }} />
              {loading ? 'Memproses...' : 'Lanjutkan'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}