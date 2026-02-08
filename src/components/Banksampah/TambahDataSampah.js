import React, { useState, useRef, useEffect } from 'react';
import { useQuery, useMutation } from '@apollo/client';
import { GET_ALL_CITIZENS, GET_WARGA } from '../../graphql/userQueries'; 
import { ADD_SETORAN_SAMPAH } from '../../graphql/sampahMutations';
import { GET_SAMPAH_STATS } from '../../graphql/sampahQueries';

const TambahDataSampah = () => {
  // State untuk Data
  const [citizenId, setCitizenId] = useState('');
  const [selectedName, setSelectedName] = useState('');
  const [berat, setBerat] = useState('');
  const [kategori, setKategori] = useState('Plastik');
  
  // State untuk Pencarian
  const [searchTerm, setSearchTerm] = useState('');
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  const { data: citizenData, loading: loadCitizen } = useQuery(GET_ALL_CITIZENS);
  
  const [addSetoran, { loading: isSaving }] = useMutation(ADD_SETORAN_SAMPAH, {
    refetchQueries: [{ query: GET_SAMPAH_STATS }, { query: GET_WARGA }],
    onCompleted: () => {
      alert("✅ Data Berhasil Disimpan!");
      setBerat('');
      setCitizenId('');
      setSelectedName('');
      setSearchTerm('');
    },
    onError: (err) => alert("❌ Gagal: " + err.message)
  });

  // Tutup dropdown jika klik di luar area
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Filter warga berdasarkan input pencarian
  const filteredCitizens = citizenData?.citizens.filter(c =>
    c.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    c.family?.noKK.includes(searchTerm)
  ) || [];

  const handleSelectWarga = (c) => {
    setCitizenId(c.id);
    setSelectedName(`${c.name} (KK: ${c.family?.kepalaKeluarga || 'N/A'})`);
    setSearchTerm('');
    setIsDropdownOpen(false);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!citizenId) return alert("Pilih warga terlebih dahulu!");
    addSetoran({ variables: { citizenId, berat: parseFloat(berat), kategori } });
  };

  return (
    <div className="form-card-premium">
      <div className="form-header">
        <span className="icon-bg">🔍</span>
        <h3>Input Setoran Baru</h3>
      </div>
      
      <form onSubmit={handleSubmit}>
        <div className="form-group searchable-container" ref={dropdownRef}>
          <label>Cari Nama Warga / No. KK</label>
          
          {/* Input Pencarian / Display */}
          <div className="search-input-wrapper">
            <input
              type="text"
              className="search-input"
              placeholder={selectedName || "-- Cari Nama Warga --"}
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value);
                setIsDropdownOpen(true);
              }}
              onFocus={() => setIsDropdownOpen(true)}
            />
            {selectedName && !searchTerm && (
              <button type="button" className="clear-search" onClick={() => {setCitizenId(''); setSelectedName('');}}>✕</button>
            )}
          </div>

          {/* List Hasil Pencarian */}
          {isDropdownOpen && (
            <div className="search-results-dropdown">
              {loadCitizen ? (
                <div className="dropdown-item disabled">Memuat data...</div>
              ) : filteredCitizens.length > 0 ? (
                filteredCitizens.map((c) => (
                  <div 
                    key={c.id} 
                    className="dropdown-item"
                    onClick={() => handleSelectWarga(c)}
                  >
                    <div className="item-name">{c.name}</div>
                    <div className="item-kk">KK: {c.family?.noKK || '-'} | {c.family?.kepalaKeluarga || '-'}</div>
                  </div>
                ))
              ) : (
                <div className="dropdown-item disabled">Warga tidak ditemukan</div>
              )}
            </div>
          )}
        </div>

        <div className="input-row">
          <div className="form-group">
            <label>Berat (Kg)</label>
            <input 
              type="number" step="0.1" value={berat} 
              onChange={(e) => setBerat(e.target.value)} 
              placeholder="0.0" required 
            />
          </div>
          <div className="form-group">
            <label>Kategori</label>
            <select value={kategori} onChange={(e) => setKategori(e.target.value)}>
              <option value="Plastik">Plastik</option>
              <option value="Kertas/Kardus">Kertas/Kardus</option>
              <option value="Logam/Besi">Logam/Besi</option>
              <option value="Kaca">Kaca</option>
            </select>
          </div>
        </div>

        <button type="submit" className="btn-save-main" disabled={isSaving || !citizenId}>
          {isSaving ? 'Memproses...' : '🚀 Simpan ke Tabungan KK'}
        </button>
      </form>
    </div>
  );
};

export default TambahDataSampah;