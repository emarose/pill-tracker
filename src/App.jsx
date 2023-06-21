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
} from "@mui/material";
import moment from "moment";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { StaticTimePicker } from "@mui/x-date-pickers/StaticTimePicker";
import { esES } from "@mui/x-date-pickers/locales";

// Set the default locale

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
  const [regeneratePDF, setRegeneratePDF] = useState(false);

  const onSubmit = (formData) => {
    const time = new Date(selectedTime).toLocaleTimeString([], {
      hour: "numeric",
      minute: "numeric",
    });

    const newHours = calculateHours(
      time,
      formData.intervalo,
      formData.medicacion
    );
    const updatedHours = [...hours, ...newHours];

    const sortedHours = updatedHours.sort((a, b) => {
      const timeA = moment(a.proximoHorario, "HH:mm");
      const timeB = moment(b.proximoHorario, "HH:mm");
      return timeA.diff(timeB);
    });

    setHours(sortedHours);
    reset();
  };

  const calculateHours = (tomaInicial, intervalo, medicacion) => {
    const hours = [
      { medicacion: medicacion, proximoHorario: tomaInicial, checked: false },
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
        proximoHorario: nextTime.format("HH:mm"),
        checked: false,
      };

      hours.push(row);
      //hours.push(nextTime.format("HH:mm"));
      currentTime = nextTime;
    }

    return hours; /* .map((hour) => moment(hour, "HH:mm")); */
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
    const range = 75;

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
            <Grid container spacing={2}>
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
                      <Button type="submit" variant="contained">
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
                      label={`${hour.proximoHorario} - ${hour.medicacion} `}
                      variant="outlined"
                    />
                  </Box>
                ))}
              </Grid>
            </Grid>

            {hours.length > 0 && (
              <Button
                variant="contained"
                onClick={() => {
                  setShowPDF(true);
                  setRegeneratePDF(true);
                }}
              >
                Guardar como PDF
              </Button>
            )}
          </CardContent>
        </Card>

        {regeneratePDF && showPDF && (
          <div style={{ height: "100vh" }}>
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
