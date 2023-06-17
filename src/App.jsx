import { useState } from "react";
import { useForm } from "react-hook-form";
import { TextField, Button, Checkbox, FormControlLabel } from "@mui/material";
import moment from "moment";

const DataPage = () => {
  const [data, setData] = useState([]);
  const { register, handleSubmit, reset } = useForm();

  const onSubmit = (formData) => {
    setData((prevData) => [...prevData, { ...formData, checked: false }]);
    reset();
  };

  /*  const handleEdit = (index) => {
    console.log("Edit row at index:", index);
  };

  const handleDelete = (index) => {
    setData((prevData) => prevData.filter((_, i) => i !== index));
  }; */

  const calculateHours = (initialTime, interval) => {
    const hours = [initialTime];
    let currentTime = moment(initialTime, "HH:mm");

    const endOfDay = moment("23:59", "HH:mm");

    while (currentTime.isBefore(endOfDay)) {
      const nextTime = currentTime.clone().add(interval, "hours");
      if (nextTime.isAfter(endOfDay)) {
        break;
      }
      hours.push(nextTime.format("HH:mm"));
      currentTime = nextTime;
    }

    return hours.map((hour) => moment(hour, "HH:mm").toDate());
  };

  const sortedData = [...data].sort((a, b) =>
    moment(calculateHours(a.tomaInicial, parseInt(a.intervalo))[0]).diff(
      moment(calculateHours(b.tomaInicial, parseInt(b.intervalo))[0])
    )
  );

  const handleCheckboxChange = (index) => {
    setData((prevData) =>
      prevData.map((row, i) =>
        i === index ? { ...row, checked: !row.checked } : row
      )
    );
    console.log(data);
  };

  return (
    <div>
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
        {sortedData.map((row, index) => (
          <div key={index}>
            {/*        <Button onClick={() => handleEdit(index)}>Edit</Button>
            <Button onClick={() => handleDelete(index)}>Delete</Button> */}
            {calculateHours(row.tomaInicial, parseInt(row.intervalo)).map(
              (hour, i) => (
                <div key={i}>
                  {hour} - {row.medicacion}
                  <FormControlLabel
                    control={
                      <Checkbox
                        checked={row.checked}
                        onChange={() => handleCheckboxChange(index)}
                      />
                    }
                  />
                </div>
              )
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default DataPage;
