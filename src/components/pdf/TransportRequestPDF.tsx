import React from 'react';
import { Page, Text, View, Document, StyleSheet, Font, Image } from '@react-pdf/renderer';

// Register font for better rendering (optional, default fonts can work but sometimes look slightly different)
// Font.register({
//   family: 'Open Sans',
//   src: 'https://fonts.gstatic.com/s/opensans/v18/mem8YaGs126MiZpBA-UFVZ0e.ttf',
// });

const styles = StyleSheet.create({
  page: {
    padding: 20,
    fontSize: 9,
    fontFamily: 'Helvetica',
    lineHeight: 1.4,
  },
  masterBox: {
    borderWidth: 1,
    borderColor: '#000',
    flex: 1,
  },
  headerContainer: {
    borderBottomWidth: 1,
    borderBottomColor: '#000',
    paddingTop: 10,
    paddingBottom: 5,
  },
  headerTitle: {
    fontSize: 13,
    fontFamily: 'Helvetica-Bold',
    textDecoration: 'underline',
    textAlign: 'center',
  },
  section: {
    padding: 6,
  },
  row: {
    flexDirection: 'row',
    marginBottom: 3,
  },
  label: {
    width: 120,
  },
  colon: {
    width: 10,
  },
  valueLine: {
    flex: 1,
    borderBottomWidth: 1,
    borderBottomColor: '#000',
    minHeight: 11,
  },
  valueText: {
    position: 'absolute',
    bottom: 2,
    left: 0,
  },
  greenHeader: {
    backgroundColor: '#92D050',
    padding: 3,
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderColor: '#000',
  },
  greenHeaderText: {
    fontFamily: 'Helvetica-BoldOblique',
    textAlign: 'center',
  },
  borderBox: {
    // we remove outer borders since masterBox handles it, just need bottom border if not at end
    borderBottomWidth: 1,
    borderColor: '#000',
  },
  checkbox: {
    width: 11,
    height: 11,
    borderWidth: 1,
    borderColor: '#000',
    marginRight: 4,
    justifyContent: 'center',
    alignItems: 'center',
  },
  checkMark: {
    fontSize: 9,
    marginTop: -1,
  },
  signatureRow: {
    flexDirection: 'row',
    borderTopWidth: 1,
    borderColor: '#000',
  },
  signatureCell: {
    flex: 1,
    borderRightWidth: 1,
    borderRightColor: '#000',
  },
  signatureCellLast: {
    flex: 1,
  },
  signatureHeader: {
    textAlign: 'center',
    borderBottomWidth: 1,
    borderBottomColor: '#000',
    padding: 2,
  },
  signatureBox: {
    height: 40,
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 2,
  },
  signatureFooter: {
    textAlign: 'center',
    borderTopWidth: 1,
    borderTopColor: '#000',
    padding: 2,
    fontSize: 8,
  },
  bbmBox: {
    width: 15,
    height: 15,
    borderWidth: 1,
    borderColor: '#000',
  },
  footerText: {
    fontSize: 7,
    marginTop: 5,
    flexDirection: 'row',
    justifyContent: 'space-between',
  }
});

// Mock data interface mapping to the form
export interface TransportRequestPDFProps {
  data: {
    employee_name: string;
    department: string;
    use_date_start: string;
    use_date_end: string;
    use_time_start: string;
    use_time_end: string;
    origin: string;
    destination: string;
    purpose: string;
    request_number: string;
    vehicle_category: 'OPERATIONAL' | 'CONVENTIONAL' | 'ONLINE' | '';
    vehicle_type: string;
    license_plate: string;
    user_signature_url: string; // base64 or URL
    ga_signature_url: string;
    manager_signature_url: string;
    odometer_start?: string;
    odometer_end?: string;
    fuel_level_start?: string; // E, 1/4, 1/2, 3/4, F
    fuel_level_end?: string;
    vehicle_condition_start?: string;
    vehicle_condition_end?: string;
    notes?: string;
    user_inspection_signature_url?: string;
    ga_inspection_signature_url?: string;
    manager_inspection_signature_url?: string;
    status?: string;
  }
}

const renderCheckbox = (isChecked: boolean) => (
  <View style={styles.checkbox}>
    {isChecked ? <Text style={styles.checkMark}>x</Text> : null}
  </View>
);

export const TransportRequestPDF: React.FC<TransportRequestPDFProps> = ({ data }) => (
  <Document>
    <Page size="A4" style={styles.page}>
      
      <View style={styles.masterBox}>
        {/* HEADER */}
        <View style={styles.headerContainer}>
          <Text style={styles.headerTitle}>PERMINTAAN FASILITAS TRANSPORTASI</Text>
        </View>
        
        {/* SECTION 1: PEMOHON */}
        <View style={styles.section}>
          <Text style={{ marginBottom: 5 }}>Dengan ini mengajukan fasilitas transportasi bagi karyawan dibawah ini :</Text>
        
        <View style={styles.row}><Text style={styles.label}>Nama</Text><Text style={styles.colon}>:</Text>
          <View style={styles.valueLine}><Text style={styles.valueText}>{data.employee_name}</Text></View>
        </View>
        <View style={styles.row}><Text style={styles.label}>Divisi / Dept.</Text><Text style={styles.colon}>:</Text>
          <View style={styles.valueLine}><Text style={styles.valueText}>{data.department}</Text></View>
        </View>
        <View style={styles.row}>
          <Text style={styles.label}>Tanggal Pemakaian</Text><Text style={styles.colon}>:</Text>
          <View style={styles.valueLine}><Text style={styles.valueText}>{data.use_date_start}</Text></View>
          <Text style={{ width: 30, textAlign: 'center' }}>s/d</Text>
          <View style={styles.valueLine}><Text style={styles.valueText}>{data.use_date_end}</Text></View>
        </View>
        <View style={styles.row}>
          <Text style={styles.label}>Waktu Pemakaian</Text><Text style={styles.colon}>:</Text>
          <View style={styles.valueLine}><Text style={styles.valueText}>{data.use_time_start}</Text></View>
          <Text style={{ width: 30, textAlign: 'center' }}>s/d</Text>
          <View style={styles.valueLine}><Text style={styles.valueText}>{data.use_time_end}</Text></View>
        </View>
        <View style={styles.row}><Text style={styles.label}>Dari</Text><Text style={styles.colon}>:</Text>
          <View style={styles.valueLine}><Text style={styles.valueText}>{data.origin}</Text></View>
        </View>
        <View style={styles.row}><Text style={styles.label}>Tujuan</Text><Text style={styles.colon}>:</Text>
          <View style={styles.valueLine}><Text style={styles.valueText}>{data.destination}</Text></View>
        </View>
        <View style={styles.row}><Text style={styles.label}>Keperluan</Text><Text style={styles.colon}>:</Text>
          <View style={styles.valueLine}><Text style={styles.valueText}>{data.purpose}</Text></View>
        </View>
        <View style={styles.row}><Text style={styles.label}></Text><Text style={styles.colon}></Text>
          <View style={styles.valueLine} />
        </View>
      </View>

      {/* SECTION 2: GA SECTION */}
      <View style={styles.borderBox}>
        <View style={styles.greenHeader}>
          <Text style={styles.greenHeaderText}>Diisi oleh PIC GA / Personalia (beri tanda checklist (√))</Text>
        </View>
        
        <View style={{ padding: 6 }}>
          <View style={{ flexDirection: 'row', marginBottom: 6 }}>
            <Text style={{ width: 120 }}>Nomor Urut Permintaan</Text>
            <Text>:</Text>
            <View style={{ borderBottomWidth: 1, width: 100, marginLeft: 10 }}><Text style={{ position: 'absolute', bottom: 1 }}>{data.request_number}</Text></View>
          </View>
          
          <View style={{ flexDirection: 'row', marginBottom: 10 }}>
            {renderCheckbox(data.vehicle_category === 'OPERATIONAL')}
            <Text style={{ width: 120, marginLeft: 4 }}>Kendaraan Operasional</Text>
          </View>
          <View style={{ flexDirection: 'row', marginBottom: 8, paddingLeft: 15 }}>
            <Text style={{ width: 80 }}>Merek/Tipe</Text><Text>:</Text>
            <View style={{ borderBottomWidth: 1, width: 180, marginLeft: 5, marginRight: 20 }}><Text style={{ position: 'absolute', bottom: 1 }}>{data.vehicle_type}</Text></View>
            <Text style={{ width: 60 }}>Nomor Polisi</Text><Text>:</Text>
            <View style={{ borderBottomWidth: 1, width: 100, marginLeft: 5 }}><Text style={{ position: 'absolute', bottom: 1 }}>{data.license_plate}</Text></View>
          </View>

          <View style={{ flexDirection: 'row', marginBottom: 4 }}>
            {renderCheckbox(data.vehicle_category === 'CONVENTIONAL')}
            <Text style={{ marginLeft: 4 }}>Transportasi Konvensional (Bis, Taksi, dll)</Text>
          </View>
          <View style={{ flexDirection: 'row' }}>
            {renderCheckbox(data.vehicle_category === 'ONLINE')}
            <Text style={{ marginLeft: 4 }}>Transportasi Online (Taksi, Ojek, dll)</Text>
          </View>
        </View>
      </View>

      {/* APPROVAL ROW 1 (Minimal Dept Head, PIC GA, HROGA Dept Head) */}
      <View style={styles.signatureRow}>
        <View style={styles.signatureCell}>
          <Text style={styles.signatureHeader}>Diajukan oleh,</Text>
          <View style={styles.signatureBox}>
            <Text style={{ fontSize: 8 }}>Tgl,</Text>
            {data.user_signature_url ? <Image src={data.user_signature_url} style={{ width: 70, height: 30, alignSelf: 'center' }} /> : null}
          </View>
          <Text style={styles.signatureFooter}>(                                                 )</Text>
          <Text style={[styles.signatureFooter, { borderTopWidth: 0 }]}>Karyawan / Dept. Head</Text>
        </View>
        <View style={styles.signatureCell}>
          <Text style={styles.signatureHeader}>Diketahui oleh,</Text>
          <View style={styles.signatureBox}>
            <Text style={{ fontSize: 7 }}>Tgl,</Text>
            {data.ga_signature_url ? <Image src={data.ga_signature_url} style={{ width: 70, height: 30, alignSelf: 'center' }} /> : null}
          </View>
          <Text style={styles.signatureFooter}>(                                                 )</Text>
          <Text style={[styles.signatureFooter, { borderTopWidth: 0 }]}>PIC GA / Personalia</Text>
        </View>
        <View style={styles.signatureCellLast}>
          <Text style={styles.signatureHeader}>Disetujui oleh,</Text>
          <View style={styles.signatureBox}>
            <Text style={{ fontSize: 7 }}>Tgl,</Text>
            {data.manager_signature_url ? <Image src={data.manager_signature_url} style={{ width: 70, height: 30, alignSelf: 'center' }} /> : null}
          </View>
          <Text style={styles.signatureFooter}>(                                                 )</Text>
          <Text style={[styles.signatureFooter, { borderTopWidth: 0 }]}>HROGA Dept Head / Manager Kantor / Kepala Depo</Text>
        </View>
      </View>

      {/* SECTION 4: PEMERIKSAAN KENDARAAN */}
      <View style={styles.borderBox}>
        <View style={styles.greenHeader}>
          <Text style={styles.greenHeaderText}>Pemeriksaan Kendaraan (diisi bila menggunakan kendaraan operasional)</Text>
        </View>
        
        <View style={{ padding: 6 }}>
          <Text style={{ fontFamily: 'Helvetica-Bold', marginBottom: 5 }}>Sebelum Pemakaian Kendaraan Operasional :</Text>
          <View style={{ flexDirection: 'row', marginBottom: 5 }}>
            <Text style={{ width: 150 }}>Posisi Angka Odometer (KM)</Text><Text>:</Text>
            <View style={{ borderWidth: 1, width: 100, marginLeft: 10, height: 16 }}><Text style={{ paddingLeft: 5 }}>{data.odometer_start}</Text></View>
          </View>
          <View style={{ flexDirection: 'row', marginBottom: 5, alignItems: 'center' }}>
            <Text style={{ width: 150 }}>Posisi Meter BBM</Text><Text style={{ marginRight: 20 }}>:</Text>
            <Text style={{ fontFamily: 'Helvetica-Bold', marginRight: 5 }}>E</Text>
            <View style={styles.bbmBox}>{data.fuel_level_start === 'E' ? <Text style={styles.checkMark}>x</Text> : null}</View>
            <View style={styles.bbmBox}>{data.fuel_level_start === '1/4' ? <Text style={styles.checkMark}>x</Text> : null}</View>
            <View style={styles.bbmBox}>{data.fuel_level_start === '1/2' ? <Text style={styles.checkMark}>x</Text> : null}</View>
            <View style={styles.bbmBox}>{data.fuel_level_start === '3/4' ? <Text style={styles.checkMark}>x</Text> : null}</View>
            <Text style={{ fontFamily: 'Helvetica-Bold', marginLeft: 5 }}>F</Text>
          </View>
          <View style={{ flexDirection: 'row', marginBottom: 5 }}>
            <Text style={{ width: 150 }}>Kondisi Kendaraan</Text><Text>:</Text>
            <View style={{ borderBottomWidth: 1, flex: 1, marginLeft: 10 }}><Text style={{ position: 'absolute', bottom: 2 }}>{data.vehicle_condition_start}</Text></View>
          </View>

          <Text style={{ fontFamily: 'Helvetica-Bold', marginBottom: 2 }}>Sesudah Pemakaian Kendaraan Operasional :</Text>
          <View style={{ flexDirection: 'row', marginBottom: 2 }}>
            <Text style={{ width: 150 }}>Posisi Angka Odometer (KM)</Text><Text>:</Text>
            <View style={{ borderWidth: 1, width: 100, marginLeft: 10, height: 16 }}><Text style={{ paddingLeft: 5 }}>{data.odometer_end}</Text></View>
          </View>
          <View style={{ flexDirection: 'row', marginBottom: 2, alignItems: 'center' }}>
            <Text style={{ width: 150 }}>Posisi Meter BBM</Text><Text style={{ marginRight: 20 }}>:</Text>
            <Text style={{ fontFamily: 'Helvetica-Bold', marginRight: 5 }}>E</Text>
            <View style={styles.bbmBox}>{data.fuel_level_end === 'E' ? <Text style={styles.checkMark}>x</Text> : null}</View>
            <View style={styles.bbmBox}>{data.fuel_level_end === '1/4' ? <Text style={styles.checkMark}>x</Text> : null}</View>
            <View style={styles.bbmBox}>{data.fuel_level_end === '1/2' ? <Text style={styles.checkMark}>x</Text> : null}</View>
            <View style={styles.bbmBox}>{data.fuel_level_end === '3/4' ? <Text style={styles.checkMark}>x</Text> : null}</View>
            <Text style={{ fontFamily: 'Helvetica-Bold', marginLeft: 5 }}>F</Text>
          </View>
          <View style={{ flexDirection: 'row', marginBottom: 5 }}>
            <Text style={{ width: 150 }}>Kondisi Kendaraan</Text><Text>:</Text>
            <View style={{ borderBottomWidth: 1, flex: 1, marginLeft: 10 }}><Text style={{ position: 'absolute', bottom: 2 }}>{data.vehicle_condition_end}</Text></View>
          </View>
        </View>
      </View>

      {/* SECTION 5: KETERANGAN */}
      <View style={[styles.borderBox, { borderBottomWidth: 0, flex: 1 }]}>
        <View style={{ padding: 6, flex: 1 }}>
          <Text style={{ textDecoration: 'underline' }}>Keterangan :</Text>
          <Text style={{ marginTop: 2 }}>{data.notes}</Text>
        </View>
        <View style={{ backgroundColor: '#EFEFEF', padding: 4, borderTopWidth: 1, borderTopColor: '#000' }}>
          <Text style={{ fontFamily: 'Helvetica-BoldOblique', fontSize: 7.5 }}>
            Catatan : Apabila sudah waktunya harus kembali tetapi Kendaraan Operasional <Text style={{ textDecoration: 'underline' }}>terpaksa</Text> disimpan (menginap) di luar Head Office / Pabrik / Depo, mohon dicantumkan tempat penyimpanan, tanggal dan waktu pengembalian serta alasannya pada kolom Keterangan.
          </Text>
        </View>
      </View>

      {/* APPROVAL ROW 2 (Karyawan, PIC GA, HROGA Dept Head) */}
      <View style={styles.signatureRow}>
        <View style={styles.signatureCell}>
          <Text style={styles.signatureHeader}>Dibuat oleh,</Text>
          <View style={styles.signatureBox}>
            <Text style={{ fontSize: 7 }}>Tgl,</Text>
            {data.user_inspection_signature_url ? <Image src={data.user_inspection_signature_url} style={{ width: 70, height: 30, alignSelf: 'center' }} /> : null}
          </View>
          <Text style={styles.signatureFooter}>(                                                 )</Text>
          <Text style={[styles.signatureFooter, { borderTopWidth: 0 }]}>Karyawan / Pemakai</Text>
        </View>
        <View style={styles.signatureCell}>
          <Text style={styles.signatureHeader}>Diketahui oleh,</Text>
          <View style={styles.signatureBox}>
            <Text style={{ fontSize: 7 }}>Tgl,</Text>
            {data.ga_inspection_signature_url ? <Image src={data.ga_inspection_signature_url} style={{ width: 70, height: 30, alignSelf: 'center' }} /> : null}
          </View>
          <Text style={styles.signatureFooter}>(                                                 )</Text>
          <Text style={[styles.signatureFooter, { borderTopWidth: 0 }]}>PIC GA / Personalia</Text>
        </View>
        <View style={styles.signatureCellLast}>
          <Text style={styles.signatureHeader}>Disetujui oleh,</Text>
          <View style={styles.signatureBox}>
            <Text style={{ fontSize: 7 }}>Tgl,</Text>
            {data.manager_inspection_signature_url ? <Image src={data.manager_inspection_signature_url} style={{ width: 70, height: 30, alignSelf: 'center' }} /> : null}
          </View>
          <Text style={styles.signatureFooter}>(                                                 )</Text>
          <Text style={[styles.signatureFooter, { borderTopWidth: 0 }]}>HROGA Dept Head / Manager Kantor / Kepala Depo</Text>
        </View>
      </View>
      
      </View>

      <View style={styles.footerText}>
        <Text>FRM-KM.CRP.49-01.00/0122</Text>
        <Text style={{ fontFamily: 'Helvetica-Oblique' }}>Manual 1 (satu) Rangkap : (1) PIC GA / Personalia</Text>
      </View>

    </Page>
  </Document>
);
