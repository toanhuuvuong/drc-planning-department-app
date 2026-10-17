import { Document, Font, Page, StyleSheet, Text, View } from '@react-pdf/renderer';
import { KhovtTransPhieuNhapControllerFindDetail200DataItem } from 'main/apis/drc/models';
import { DateFormat } from 'main/constants';
import { ImportStatus } from 'main/constants/enums';
import moment from 'moment';

Font.register({
  family: 'Noto Sans',
  src: `${process.env.PUBLIC_URL}/assets/fonts/noto-sans/NotoSans-Medium.ttf`,
});

const styles = StyleSheet.create({
  page: {
    flexDirection: 'column',
    padding: 30,
    fontFamily: 'Noto Sans',
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  subTitle: {
    fontSize: 16,
    marginBottom: 20,
    textAlign: 'center',
  },
  table: {
    display: 'flex',
    width: 'auto',
    borderStyle: 'solid',
    borderColor: '#000',
    borderWidth: 1,
    marginBottom: 10,
    fontWeight: 'bold',
  },
  tableRow: {
    flexDirection: 'row',
  },
  tableCol: {
    width: '25%',
    borderStyle: 'solid',
    borderColor: '#000',
    borderWidth: 1,
    padding: 4,
  },
  tableCell: {
    fontSize: 8,
  },
  header: {
    backgroundColor: '#f2f2f2',
  },
});

type Props = {
  title: string;
  data?: KhovtTransPhieuNhapControllerFindDetail200DataItem[];
};

function ImportBillsPdfDocument({ title, data }: Props) {
  return (
    <Document title={title}>
      <Page style={styles.page} size="A4" orientation="landscape">
        <Text style={styles.title}>SỔ THEO DÕI CHỨNG TỪ NHẬP</Text>
        <Text style={styles.subTitle}>
          Tháng {moment().month()} năm {moment().year()}
        </Text>

        <View style={styles.table}>
          <View style={[styles.tableRow, styles.header]}>
            <View style={styles.tableCol}>
              <Text style={styles.tableCell}>Phiếu nhập kho</Text>
            </View>
            <View style={styles.tableCol}>
              <Text style={styles.tableCell}>Mã vật tư</Text>
            </View>
            <View style={styles.tableCol}>
              <Text style={styles.tableCell}>Tên vật tư</Text>
            </View>
            <View style={styles.tableCol}>
              <Text style={styles.tableCell}>Đơn vị tính</Text>
            </View>
            <View style={styles.tableCol}>
              <Text style={styles.tableCell}>Số lượng</Text>
            </View>
            <View style={styles.tableCol}>
              <Text style={styles.tableCell}>Mã số lô</Text>
            </View>
            <View style={styles.tableCol}>
              <Text style={styles.tableCell}>Nhà cung cấp</Text>
            </View>
            <View style={styles.tableCol}>
              <Text style={styles.tableCell}>Ngày nhập</Text>
            </View>
            <View style={styles.tableCol}>
              <Text style={styles.tableCell}>Ghi chú</Text>
            </View>
            <View style={styles.tableCol}>
              <Text style={styles.tableCell}>Trạng thái</Text>
            </View>
          </View>
          {data &&
            data.map((item) => (
              <View style={styles.tableRow}>
                <View style={styles.tableCol}>
                  <Text style={styles.tableCell}>{item.soPhieuNhap}</Text>
                </View>
                <View style={styles.tableCol}>
                  <Text style={styles.tableCell}>{item.maVt}</Text>
                </View>
                <View style={styles.tableCol}>
                  <Text style={styles.tableCell}>{item.tenVt}</Text>
                </View>
                <View style={styles.tableCol}>
                  <Text style={styles.tableCell}>{item.donViNhap}</Text>
                </View>
                <View style={styles.tableCol}>
                  <Text style={styles.tableCell}>{item.soLuong}</Text>
                </View>
                <View style={styles.tableCol}>
                  <Text style={styles.tableCell}>{item.soLo}</Text>
                </View>
                <View style={styles.tableCol}>
                  <Text style={styles.tableCell}>{item.donViNhap}</Text>
                </View>
                <View style={styles.tableCol}>
                  <Text style={styles.tableCell}>{moment(item.ngayNhap).format(DateFormat.DATE_ONLY_VN)}</Text>
                </View>
                <View style={styles.tableCol}>
                  <Text style={styles.tableCell}>{item.ghiChu}</Text>
                </View>
                <View style={styles.tableCol}>
                  <Text style={styles.tableCell}>{ImportStatus[item.status as keyof typeof ImportStatus]?.text}</Text>
                </View>
              </View>
            ))}
        </View>
      </Page>
    </Document>
  );
}

export default ImportBillsPdfDocument;
