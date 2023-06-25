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
    marginBottom: 10,
    paddingVertical: 7,
    flexDirection: "row",
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
              {`${hour.proximoHorario} - ${hour.medicacion} ${
                hour.notas && "( " + hour.notas + " )"
              } `}
            </Text>
            {hour.notes && <Text>{hour.notes}</Text>}
          </View>
        ))}
      </View>
    </Page>
  </Document>
);
