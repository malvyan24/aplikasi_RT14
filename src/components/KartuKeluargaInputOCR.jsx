import React, { useState, useRef } from 'react';
import Tesseract from 'tesseract.js';
import { 
  Upload, 
  Keyboard, 
  QrCode, 
  Check
} from 'lucide-react';
import Swal from 'sweetalert2';
import './KartuKeluargaInputOCR.css';

export default function KartuKeluargaInputOCR() {
  const [inputMode, setInputMode] = useState('manual');
  const [kkNumber, setKkNumber] = useState('');
  const [kkData, setKkData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [ocrProgress, setOcrProgress] = useState(0);
  const [uploadPreview, setUploadPreview] = useState(null);
  const fileInputRef = useRef(null);
  const workerRef = useRef(null);

  // Initialize Tesseract Worker once
  const initializeWorker = async () => {
    if (!workerRef.current) {
      try {
        workerRef.current = await Tesseract.createWorker('ind', 1, {
          corePath: 'https://cdn.jsdelivr.net/npm/tesseract.js-core@v5/tesseract-core.wasm.js',
          workerPath: 'https://cdn.jsdelivr.net/npm/tesseract.js@v5/dist/worker.min.js',
          langPath: 'https://cdn.jsdelivr.net/npm/tesseract.js-data@v1.0.25/fast'
        });
      } catch (error) {
        console.error('Worker initialization error:', error);
        throw new Error('Gagal menginisialisasi OCR. Silakan refresh halaman.');
      }
    }
    return workerRef.current;
  };

  // ===== MODE 1: INPUT MANUAL =====
  const handleManualInput = (e) => {
    const value = e.target.value.replace(/\D/g, '');
    setKkNumber(value);
  };

  // ===== MODE 2: OCR DARI GAMBAR =====
  const handleFileUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // Validasi ukuran file
    if (file.size > 5 * 1024 * 1024) {
      Swal.fire('Error', 'Ukuran file terlalu besar (maksimal 5MB)', 'error');
      return;
    }

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
      // Show loading dialog
      Swal.fire({
        title: 'Memproses Gambar',
        html: `
          <div style="margin: 20px 0;">
            <p style="margin-bottom: 15px;">Mengekstrak teks dari gambar...</p>
            <div class="progress" style="height: 20px; background: #f0f0f0; border-radius: 5px; overflow: hidden;">
              <div class="progress-bar" id="ocrProgressBar" style="width: 0%; background: #007bff; transition: width 0.3s; height: 100%;"></div>
            </div>
            <p style="margin-top: 10px; font-size: 14px; color: #666;" id="progressText">Inisialisasi...</p>
          </div>
        `,
        allowOutsideClick: false,
        didOpen: async () => {
          try {
            const worker = await initializeWorker();

            // Update progress
            worker.on('progress', (progress) => {
              const percent = Math.round(progress.progress * 100);
              setOcrProgress(percent);
              
              const progressBar = document.getElementById('ocrProgressBar');
              const progressText = document.getElementById('progressText');
              if (progressBar) progressBar.style.width = percent + '%';
              if (progressText) progressText.textContent = `Proses: ${percent}%`;
            });

            const result = await worker.recognize(imageSrc);
            const text = result.data.text;

            // Ekstrak nomor KK (16 digit)
            const kkMatch = text.match(/\b\d{16}\b/);
            const extractedData = extractKKData(text);

            if (kkMatch) {
              setKkNumber(kkMatch[0]);
              setKkData(extractedData);
              
              Swal.fire({
                title: 'Sukses!',
                html: `
                  <div style="text-align: left;">
                    <p><strong>Nomor KK:</strong> <span style="font-size: 18px; font-weight: bold; color: #28a745;">${kkMatch[0]}</span></p>
                    ${extractedData.nama ? `<p><strong>Nama:</strong> ${extractedData.nama}</p>` : ''}
                    ${extractedData.alamat ? `<p><strong>Alamat:</strong> ${extractedData.alamat}</p>` : ''}
                    ${extractedData.kota ? `<p><strong>Kota:</strong> ${extractedData.kota}</p>` : ''}
                  </div>
                `,
                icon: 'success',
              });
            } else {
              Swal.fire({
                title: 'Perhatian',
                text: 'Nomor KK 16 digit tidak terdeteksi. Silakan periksa kualitas gambar atau input manual.',
                html: `
                  <p>Teks yang terdeteksi:</p>
                  <textarea style="width: 100%; height: 100px; margin-top: 10px; border: 1px solid #ddd; padding: 10px; border-radius: 5px;" readonly>${text.substring(0, 200)}</textarea>
                `,
                icon: 'info',
              });
            }

            setLoading(false);
          } catch (error) {
            console.error('OCR Error:', error);
            Swal.fire({
              title: 'Error',
              text: 'Gagal memproses gambar. Error: ' + error.message,
              html: `
                <p>${error.message}</p>
                <p style="margin-top: 10px; font-size: 12px; color: #666;">
                  Tips: Pastikan gambar KK jelas dan terbaca. Coba ambil ulang dengan pencahayaan lebih baik.
                </p>
              `,
              icon: 'error',
            });
            setLoading(false);
          }
        },
      });
    } catch (error) {
      console.error('OCR Setup Error:', error);
      Swal.fire('Error', 'Gagal memulai OCR: ' + error.message, 'error');
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
      rawText: text,
    };

    // Ekstrak Nomor KK (16 digit)
    const kkMatch = text.match(/\b\d{16}\b/);
    if (kkMatch) data.kkNumber = kkMatch[0];

    // Ekstrak Nama
    const namaMatch = text.match(/(?:Nama|NAMA)\s*:?\s*([A-Za-z\s]+?)(?:\n|Usia|Jenis|Tempat|$)/i);
    if (namaMatch) data.nama = namaMatch[1].trim();

    // Ekstrak Alamat
    const alamatMatch = text.match(/(?:Alamat|ALAMAT)\s*:?\s*([^,\n]+)/i);
    if (alamatMatch) data.alamat = alamatMatch[1].trim();

    // Ekstrak Kota/Kabupaten
    const kotaMatch = text.match(/(?:Kota|Kabupaten|KOTA|KABUPATEN)\s*:?\s*([A-Za-z\s]+?)(?:\n|Provinsi|$)/i);
    if (kotaMatch) data.kota = kotaMatch[1].trim();

    // Ekstrak Tanggal Lahir
    const tglMatch = text.match(/\d{1,2}[-\/]\d{1,2}[-\/]\d{4}/);
    if (tglMatch) data.tglLahir = tglMatch[0];

    // Ekstrak Pekerjaan
    const pekerjaanMatch = text.match(/(?:Pekerjaan|PEKERJAAN)\s*:?\s*([A-Za-z\s]+?)(?:\n|Agama|$)/i);
    if (pekerjaanMatch) data.pekerjaan = pekerjaanMatch[1].trim();

    // Ekstrak Agama
    const agamaMatch = text.match(/(Islam|Kristen|Katolik|Hindu|Buddha|Konghucu)/i);
    if (agamaMatch) data.agama = agamaMatch[1];

    return data;
  };

  // ===== SUBMIT =====
  const handleSubmit = (e) => {
    e.preventDefault();
    if (!kkNumber || kkNumber.length < 16) {
      Swal.fire('Error', 'Nomor KK harus 16 digit', 'error');
      return;
    }

    const submitData = {
      kkNumber,
      ...kkData,
      source: inputMode,
    };

    Swal.fire('Sukses!', `Nomor KK: ${kkNumber} berhasil didaftarkan`, 'success').then(() => {
      console.log('Submit KK Data:', submitData);
      // Kirim ke backend
      // sendToBackend(submitData);
    });
  };

  // Cleanup on unmount
  React.useEffect(() => {
    return () => {
      if (workerRef.current) {
        workerRef.current.terminate();
      }
    };
  }, []);

  return (
    <div className="container mt-5 mb-5">
      <div className="card shadow-lg">
        <div className="card-header bg-primary text-white">
          <h4 className="mb-0">
            <QrCode className="me-2" size={24} style={{ display: 'inline' }} />
            Input Kartu Keluarga (KK) dengan OCR
          </h4>
          <small>Upload Gambar atau Input Manual</small>
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
              }}
            >
              <Upload size={18} className="me-2" style={{ display: 'inline' }} />
              Upload OCR
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
                    Klik untuk upload gambar KK
                  </p>
                  <small className="text-muted">
                    (JPG, PNG, maksimal 5MB)
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
            {kkData && Object.keys(kkData).some(k => k !== 'rawText' && kkData[k]) && (
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