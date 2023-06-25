import { useState } from "react";
import { useForm } from "react-hook-form";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import {
  TextField,
  Button,
  FormControlLabel,
  Checkbox,
  Chip,
  Grid,
  Box,
  Card,
  CardContent,
  Typography,
} from "@mui/material";
import moment from "moment";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { StaticTimePicker } from "@mui/x-date-pickers/StaticTimePicker";
import { esES } from "@mui/x-date-pickers/locales";
import { PDFViewer } from "@react-pdf/renderer";
import { PDFDocument } from "./components/PDFDocument";

const theme = createTheme({
  palette: {
    primary: {
      main: "#8f0ec5",
    },
    esES,
  },
});

const App = () => {
  const { register, handleSubmit, reset } = useForm();
  const [hours, setHours] = useState([]);
  const [selectedTime, setSelectedTime] = useState(null);
  const [medicationColors, setMedicationColors] = useState({});
  const [showPDF, setShowPDF] = useState(false);

  const onSubmit = (formData) => {
    const time = new Date(selectedTime).toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
      hour12: false,
    });

    const newHours = calculateHours(
      time,
      formData.intervalo,
      formData.medicacion,
      formData.notas
    );
    const updatedHours = [...hours, ...newHours];

    const sortedHours = updatedHours.sort((a, b) => {
      const timeA = moment(a.proximoHorario, "HH:mm");
      const timeB = moment(b.proximoHorario, "HH:mm");
      return timeA.diff(timeB);
    });
    setShowPDF(true);
    setHours(sortedHours);
    reset();
  };

  const calculateHours = (tomaInicial, intervalo, medicacion, notas) => {
    const hours = [
      {
        medicacion: medicacion,
        proximoHorario: tomaInicial,
        checked: false,
        notas: notas,
      },
    ];
    let currentTime = moment(tomaInicial, "HH:mm");

    const endOfDay = moment("23:59", "HH:mm");

    while (currentTime.isBefore(endOfDay)) {
      const nextTime = currentTime.clone().add(intervalo, "hours");
      if (nextTime.isAfter(endOfDay)) {
        break;
      }

      let row = {
        medicacion: medicacion,
        proximoHorario: moment(nextTime).format("HH:mm").padStart(5, "0"),
        notas: notas,
        checked: false,
      };

      hours.push(row);
      currentTime = nextTime;
    }

    return hours;
  };

  const handleCheckboxChange = (index) => {
    setHours((prevData) =>
      prevData.map((row, i) =>
        i === index ? { ...row, checked: !row.checked } : row
      )
    );
  };

  const handleColorChange = (medicacion, color) => {
    setMedicationColors((prevColors) => ({
      ...prevColors,
      [medicacion]: color,
    }));
  };

  const getRandomColor = () => {
    const minValue = 175; // Minimum value for each color channel (R, G, B)
    const range = 65;

    const randomChannelValue = () =>
      minValue + Math.floor(Math.random() * range);

    const red = randomChannelValue();
    const green = randomChannelValue();
    const blue = randomChannelValue();

    return `rgb(${red},${green},${blue})`;
  };

  const getMedicationColor = (medicacion) => {
    if (medicationColors[medicacion]) {
      return medicationColors[medicacion];
    } else {
      const color = getRandomColor();
      handleColorChange(medicacion, color);
      return color;
    }
  };

  const handleDeleteToma = (index) => {
    setHours((prevData) => prevData.filter((_, i) => i !== index));
  };

  return (
    <ThemeProvider theme={theme}>
      <div className="container">
        <Card
          sx={{
            boxShadow: "0 0 15px 1px rgba(100,100,100,0.5)",
          }}
          variant="outlined"
          shadow="sm"
        >
          <CardContent>
            <Grid container spacing={1}>
              <Grid item>
                <form onSubmit={handleSubmit(onSubmit)}>
                  <Grid container spacing={4}>
                    <Grid item xs={12}>
                      <TextField
                        label="Medicacion"
                        required
                        {...register("medicacion")}
                      />
                    </Grid>
                    <Grid item>
                      <LocalizationProvider dateAdapter={AdapterDayjs}>
                        <StaticTimePicker
                          sx={{
                            borderRadius: 1,
                            outline: "1px solid rgba(120,120,120,0.4)",
                          }}
                          localeText={{
                            toolbarTitle: "Horario",
                            cancelButtonLabel: null,
                            okButtonLabel: null,
                          }}
                          onChange={(e) => setSelectedTime(e)}
                        />
                      </LocalizationProvider>
                    </Grid>
                    <Grid item xs={12}>
                      <TextField
                        label="Intervalo"
                        type="number"
                        required
                        {...register("intervalo")}
                      />
                    </Grid>
                    <Grid item xs={12}>
                      <TextField label="Notas" {...register("notas")} />
                    </Grid>
                    <Grid item xs={12}>
                      <Button
                        type="submit"
                        variant="contained"
                        style={{ marginBottom: 10 }}
                      >
                        Agregar
                      </Button>
                    </Grid>
                  </Grid>
                </form>
              </Grid>

              <Grid item sm={6}>
                {hours.map((hour, i) => (
                  <Box key={i}>
                    <FormControlLabel
                      control={
                        <Checkbox
                          checked={hour.checked}
                          onChange={() => handleCheckboxChange(i)}
                        />
                      }
                    />
                    <Chip
                      style={{
                        textTransform: "capitalize",
                        backgroundColor: getMedicationColor(hour.medicacion),
                      }}
                      label={`${hour.proximoHorario} - ${hour.medicacion} ${
                        hour.notas && "( " + hour.notas + " )"
                      } `}
                      variant="outlined"
                      onDelete={() => handleDeleteToma(i)}
                    />
                  </Box>
                ))}
              </Grid>
            </Grid>
          </CardContent>
        </Card>

        {showPDF && (
          <div style={{ height: "100vh", marginTop: 30 }}>
            <PDFViewer width="100%" height="100%">
              <PDFDocument hours={hours} />
            </PDFViewer>
          </div>
        )}
      </div>
    </ThemeProvider>
  );
};

export default App;
