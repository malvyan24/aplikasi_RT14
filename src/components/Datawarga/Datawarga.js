// src/components/Datawarga/Datawarga.js
import React from "react";
import "./Datawarga.css";

import AddUser from "./AddUser";
import UserList from "./UserList";

const Datawarga = () => {
  return (
    <div className="datawarga-container">
      <h2>DATA WARGA RT 14</h2>

      {/* Form tambah warga */}
      <section className="datawarga-section">
        <AddUser />
      </section>

      {/* Tabel / daftar warga */}
      <section className="datawarga-section">
        <UserList />
      </section>
    </div>
  );
};

export default Datawarga;