import { Document, Page, StyleSheet, Text, View } from "@react-pdf/renderer";

const styles = StyleSheet.create({
  page: {
    display: "flex",
    margin: 20,
    padding: 15,
  },
  checkbox: {
    border: "1px solid black",
    width: 18,
    height: 18,
    marginRight: 15,
  },
  row: {
    marginBottom: 15,
    border: "1px solid grey",
    padding: 7,
    borderRadius: 4,
    maxWidth: 400,
    flexDirection: "row",
    alignItems: "center",
  },
  horario: { textTransform: "capitalize" },
});

export const PDFDocument = ({ hours }) => (
  <Document>
    <Page size="A4" style={styles.page}>
      <View style={{}}>
        {hours.map((hour, index) => (
          <View style={styles.row} key={index}>
            <View style={styles.checkbox} />
            <Text style={styles.horario}>
              {`${hour.proximoHorario} - ${hour.medicacion}`}
            </Text>
          </View>
        ))}
      </View>
    </Page>
  </Document>
);
