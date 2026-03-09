// import React from 'react';
// import { useQuery, gql } from '@apollo/client';

// const GET_MY_KK = gql`
//   query GetKK($id: ID!) {
//     getFamilyById(id: $id) {
//       noKK
//       address
//       members {
//         name
//         nik
//         relationship
//         profession
//       }
//     }
//   }
// `;

// export default function ProfilKeluarga() {
//   const familyId = localStorage.getItem("familyId");
//   const { loading, data } = useQuery(GET_MY_KK, { variables: { id: familyId } });

//   if (loading) return <div className="warga-loading">Menarik data KK...</div>;
//   const family = data?.getFamilyById;

//   return (
//     <div className="warga-page">
//       <div className="kk-box">
//         <div className="kk-header">
//           <p>NOMOR KARTU KELUARGA</p>
//           <h1>{family?.noKK}</h1>
//           <p className="address">{family?.address}</p>
//         </div>

//         <div className="member-list">
//           <h3>Daftar Anggota Keluarga</h3>
//           {family?.members.map((m, i) => (
//             <div key={i} className="member-item">
//               <div className="member-info">
//                 <p className="name">{m.name}</p>
//                 <p className="nik">NIK: {m.nik}</p>
//               </div>
//               <span className="tag">{m.relationship}</span>
//             </div>
//           ))}
//         </div>
//       </div>
//     </div>
//   );
// }



import React from 'react';
import { useQuery, gql } from '@apollo/client';

const GET_MY_KK = gql`
  query GetKK($id: ID!) {
    getFamilyById(id: $id) {
      noKK
      address
      members {
        name
        nik
        relationship
        profession
        phone
        email
      }
    }
  }
`;

export default function ProfilKeluarga() {
  const familyId = localStorage.getItem("familyId");
  const { loading, data } = useQuery(GET_MY_KK, { variables: { id: familyId } });

  if (loading) return <div className="warga-loading">Menarik data KK...</div>;
  const family = data?.getFamilyById;

  return (
    <div className="warga-page">
      <div className="kk-box">
        <div className="kk-header">
          <p>NOMOR KARTU KELUARGA</p>
          <h1>{family?.noKK}</h1>
          <p className="address">{family?.address}</p>
        </div>

        <div className="member-list">
          <h3>Daftar Anggota Keluarga</h3>
          {family?.members.map((m, i) => (
            <div key={i} className="member-item" style={{ flexWrap: 'wrap', gap: '10px' }}>
              <div className="member-info">
                <p className="name">{m.name}</p>
                <p className="nik">NIK: {m.nik}</p>
                {/* Menampilkan Email dan No HP */}
                <p className="nik" style={{ color: '#3b82f6', marginTop: '2px', fontWeight: 'bold' }}>
                  📧 {m.email && m.email !== "-" ? m.email : "Tidak ada email"} | 📞 {m.phone && m.phone !== "-" ? m.phone : "Tidak ada HP"}
                </p>
              </div>
              <span className="tag">{m.relationship}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}