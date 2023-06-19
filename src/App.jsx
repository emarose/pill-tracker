import { useState } from "react";
import { useForm } from "react-hook-form";
import {
  TextField,
  Button /*  FormControlLabel,Checkbox  */,
} from "@mui/material";
import moment from "moment";

const DataPage = () => {
  const [data, setData] = useState([]);
  const [hours, setHours] = useState([]);
  const { register, handleSubmit, reset } = useForm();

  const onSubmit = (formData) => {
    setData((prevData) => [...prevData, { ...formData }]);
    setHours(
      calculateHours(
        formData.tomaInicial,
        formData.intervalo,
        formData.medicacion
      )
    );
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

  /*  const handleCheckboxChange = (index) => {
    setData((prevData) =>
      prevData.map((row, i) =>
        i === index ? { ...row, checked: !row.checked } : row
      )
    );
  }; */

  return (
    <div
      style={{
        width: "100vw",
        minHeight: "100vh",
        display: "grid",
        placeItems: "center",
      }}
    >
      <form
        onSubmit={handleSubmit(onSubmit)}
        style={{ display: "flex", flexDirection: "column", gap: 15 }}
      >
        <TextField label="Medicacion" {...register("medicacion")} />
        <TextField
          label="Toma inicial"
          type="time"
          {...register("tomaInicial")}
        />
        <TextField label="Intervalo" type="number" {...register("intervalo")} />
        <TextField label="Notas" {...register("notas")} />
        <Button type="submit" variant="contained">
          Add
        </Button>
      </form>

      <div>
        {data.map((row, index) => (
          <div key={index}>
            {hours.map((hour, i) => (
              <div key={i}>
                {JSON.stringify(hour)}
                {/*  <FormControlLabel
                    control={
                      <Checkbox
                        checked={row.checked}
                        onChange={() => handleCheckboxChange(index)}
                      />
                    }
                  /> */}
              </div>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
};

export default DataPage;
