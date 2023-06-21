import { Document, Page, Text, View } from "@react-pdf/renderer";

export const PDFDocument = ({ hours }) => (
  <Document>
    <Page>
      <View>
        {hours.map((hour, index) => (
          <Text key={index} style={{ fontSize: 20, fontWeight: 300 }}>
            {`${hour.proximoHorario} - ${hour.medicacion}`}
          </Text>
        ))}
      </View>
    </Page>
  </Document>
);
