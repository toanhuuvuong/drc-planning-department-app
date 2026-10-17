import { Document, Font, Page, StyleSheet, Text, View } from '@react-pdf/renderer';
import { KhovtTransPhieuNhapWithRelations } from 'main/apis/drc/models';
import { DateFormat } from 'main/constants';
import moment from 'moment';

Font.register({
  family: 'Arial',
  src: `${process.env.PUBLIC_URL}/assets/fonts/arial/ARIAL.TTF`,
});

const styles = StyleSheet.create({
  page: {
    flexDirection: 'column',
    padding: 30,
    fontFamily: 'Arial',
  },
  mottoContainer: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 10,
    marginBottom: 20,
  },
  motto: {
    fontSize: 16,
    padding: 5,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  subTitle: {
    fontSize: 16,
    marginBottom: 8,
    textAlign: 'center',
  },
  section: {
    fontSize: 14,
    marginBottom: 12,
    textAlign: 'right',
  },
  table: {
    display: 'flex',
    width: 'auto',
    borderStyle: 'solid',
    borderColor: '#000',
    borderWidth: 1,
    marginBottom: 20,
    fontWeight: 'bold',
  },
  tableRow: {
    flexDirection: 'row',
  },
  tableCol: {
    borderStyle: 'solid',
    borderColor: '#000',
    borderWidth: 1,
    padding: 2,
  },
  tableCell: {
    fontSize: 10,
  },
  header: {
    backgroundColor: '#f2f2f2',
  },
  signatureContainer: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'flex-end',
    padding: 10,
    marginBottom: 20,
  },
  signature: {
    fontSize: 16,
    padding: 5,
  },
});

type Props = {
  title: string;
  data?: KhovtTransPhieuNhapWithRelations;
};

function KH22BillPdfDocument({ title, data }: Props) {
  return (
    <Document title={title}>
      <Page style={styles.page} size="A4" orientation="landscape">
        <View style={styles.mottoContainer}>
          <View>
            <View style={styles.motto}>
              <Text>CÔNG TY CP CAO SU ĐÀ NẴNG</Text>
            </View>
            <View style={styles.motto}>
              <Text>Địa chỉ: {new Array(42).fill('.')}</Text>
            </View>
          </View>

          <View style={styles.motto}>
            <Text>KH.22/BH03</Text>
          </View>
        </View>

        <View>
          <Text style={styles.title}>PHIẾU BÁO NHẬP KHO</Text>
          <Text style={styles.subTitle}>{moment().format(DateFormat.LONG_DATE_ONLY_VN)}</Text>
        </View>

        {data && (
          <>
            <Text style={styles.section}>Số phiếu: {data.soPhieuNhap}</Text>
            <Text style={styles.section}>Số phiếu nhập: {new Array(28).fill('.')}</Text>

            <View style={styles.table}>
              <View style={[styles.tableRow, styles.header]}>
                <View style={{ ...styles.tableCol, width: '30%' }}>
                  <Text style={styles.tableCell}>Mã vật tư</Text>
                </View>
                <View style={{ ...styles.tableCol, width: '20%' }}>
                  <Text style={styles.tableCell}>Tên vật tư</Text>
                </View>
                <View style={{ ...styles.tableCol, width: '5%' }}>
                  <Text style={styles.tableCell}>Đơn vị tính</Text>
                </View>
                <View style={{ ...styles.tableCol, width: '5%' }}>
                  <Text style={styles.tableCell}>Số lượng</Text>
                </View>
                <View style={{ ...styles.tableCol, width: '20%' }}>
                  <Text style={styles.tableCell}>Nhà cung cấp</Text>
                </View>
                <View style={{ ...styles.tableCol, width: '20%' }}>
                  <Text style={styles.tableCell}>Ghi chú</Text>
                </View>
              </View>
              {data.details &&
                data.details.map((item) => (
                  <View style={styles.tableRow}>
                    <View style={{ ...styles.tableCol, width: '30%' }}>
                      <Text style={styles.tableCell}>{item.maVt}</Text>
                    </View>
                    <View style={{ ...styles.tableCol, width: '20%' }}>
                      <Text style={styles.tableCell}>{item.tenVt}</Text>
                    </View>
                    <View style={{ ...styles.tableCol, width: '5%' }}>
                      <Text style={styles.tableCell}>{item.dvt}</Text>
                    </View>
                    <View style={{ ...styles.tableCol, width: '5%' }}>
                      <Text style={styles.tableCell}>{item.soLuong}</Text>
                    </View>
                    <View style={{ ...styles.tableCol, width: '20%' }}>
                      <Text style={styles.tableCell}>{data.donViNhap}</Text>
                    </View>
                    <View style={{ ...styles.tableCol, width: '20%' }}>
                      <Text style={styles.tableCell}>{item.ghiChu}</Text>
                    </View>
                  </View>
                ))}
            </View>

            <View style={styles.signatureContainer}>
              <View style={styles.signature}>
                <Text>THỦ KHO</Text>
              </View>
            </View>
            <View style={styles.signatureContainer}>
              <View style={styles.signature}>
                <Text style={{ marginTop: 40 }}>{new Array(56).fill('.')}</Text>
              </View>
            </View>
          </>
        )}
      </Page>
    </Document>
  );
}

export default KH22BillPdfDocument;
