import logo from './logo.svg';
import './App.css';
import { useState, useEffect } from 'react';
import axios from 'axios';
import Swal from 'sweetalert2';



function App() {


  const [vehicleData, setVehicles] = useState([])
  const [vehicleNumberPlate, setVehicleNumberPlate] = useState("")
  const [vehicleId, setVehicleID] = useState("")
  const [updateVehicle, setUpdateVehicle] = useState(false)



  const checkValidate = () => {
    let check = document.getElementById("check");
    let number = document.getElementById("number");
    let text = document.getElementById("text");


    let regex = /^[\w,\s,\@]/;
    let regex2 = /^[\d]/
    let regex3 = /[@]/;

    if (number.value == "") {
      text.innerText = "Please Enter Your Vehicle Number";
      text.style.color = "#fff";
    } else if (number.value.length > 9) {
      text.innerText = "Invalid Length";
      text.style.color = "#da3400";
    } else if (number.value.match(regex)) {

      if (number.value.match(regex2)) {
        text.innerText = "Old";

        registerVehicle(number.value, "Old")
        text.style.color = "rgba(4,125,9,1)";
      } else if (number.value.match(regex3)) {
        text.innerText = "Vintage";
        registerVehicle(number.value, "Vintage")
        text.style.color = "rgba(4,125,9,1)";
      } else {
        text.innerText = "Modern";
        registerVehicle(number.value, "Modern")
        text.style.color = "rgba(4,125,9,1)";
      }
    } else {
      text.innerText = "Oops! Your Vehicle Number Is Invalid";
      text.style.color = "#da3400";
    }
  }

  const resetForm = () => {
    document.getElementById("number").value = ""
    setUpdateVehicle(false)
  }


  const registerVehicle = (vehicleNumber, vehicleType) => {
    if (updateVehicle == false) {
      const vehicleData = {
        vehiclenumberplate: vehicleNumber,
        vehicletype: vehicleType
      }
      axios.post('http://127.0.0.1:8000/api/vehicles/registerVehicle', vehicleData).then(res => {

        if (res.data.status === 200) {
          console.log(vehicleData)
          getVehicles()
          resetForm()
          console.log("Done Added")
        }

        else {
          console.log(res.data.validator_errors);
          console.log(res.data.status)
        }

      });
    }
    else {

      const vehicleData = {
        vehicleid: vehicleId,
        vehiclenumberplate: vehicleNumber,
        vehicletype: vehicleType
      }


      Swal.fire({
        title: 'Are you sure?',
        text: "Are you sure you want to update this vehicle?",
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: 'red',
        cancelButtonColor: 'black',
        confirmButtonText: 'Yes, update it!'
      }).then((result) => {
        if (result.isConfirmed) {

          axios.post('http://127.0.0.1:8000/api/vehicles/updateVehicle', vehicleData).then(res => {

            if (res.data.status === 200) {
              getVehicles()
              resetForm()
              console.log("Done Updated")

              Swal.fire(
                'Updated!',
                'Vehicle has been updated.',
                'success'
              )

              setTimeout(
                function () {
                  window.location.reload()
                }
                  .bind(this),
                2000
              );

            }

            else {
              console.log(res.data.validator_errors);
              console.log(res.data.status)
            }

          });

        }
      })

    }

  }


  const getVehicles = () => {
    axios.get(`http://127.0.0.1:8000/api/vehicles/getVehicles`).then(res => {

      if (res.data.status == 200) {
        setVehicles(res.data.vehicles)
        console.log(res.data.vehicles)
      }
      else {
        console.log("NoData")
      }
    })
  }


  const onDelete = (e) => {

    console.log(e.target.value)

    Swal.fire({
      title: 'Are you sure?',
      text: "Are you sure you want to delete this vehicle?",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: 'red',
      cancelButtonColor: 'black',
      confirmButtonText: 'Yes, delete it!'
    }).then((result) => {
      if (result.isConfirmed) {

        axios.post('http://127.0.0.1:8000/api/vehicles/deletevehicle', { vehicleid: e.target.value }).then(res => {
          if (res.data.status === 200) {
            getVehicles()
            Swal.fire(
              'Deleted!',
              'Vehicle has been deleted.',
              'success'
            )

          }
        });

      }
    })
  }


  const onUpdateButtonClick = (e) => {
    setVehicleID(e.target.value)
    axios.get(`http://127.0.0.1:8000/api/vehicles/getVehicleByID/${e.target.value}`).then(res => {

      if (res.data.status == 200) {
        // setVehicleNumberPlate(res.data.vehicle[0]['vehiclenumberplate'])
        document.getElementById("number").value = res.data.vehicle[0]['vehiclenumberplate']
        setUpdateVehicle(true)

        console.log(res.data.vehicle[0]['vehiclenumberplate'])
      }
      else {
        console.log("NoData")
      }
    })
  }


  useEffect(() => {
    getVehicles()
  }, []);


  return (
    <>
      <div className="containerMain">
        <h3>Number Validation Check</h3>
        <input type="text" name="Phone-Number" placeholder="Enter Your Vehicle Number" id='number' className="number" />
        <h5 className="text" id='text'>Please Enter Your Vehicle Number</h5>

        {updateVehicle == false ? <input type="submit" defaultValue="Check" className="check" onClick={checkValidate} id='check' />

          : <input type="submit" defaultValue="Check" className="check" onClick={checkValidate} value="Update" id='check' />}

      </div>


      <div className='containerTable'>
        <h3>Registered Vehicles</h3>
        <table className="table table-dark">
          <thead>
            <tr>
              <th scope="col">Vehicle Plate</th>
              <th scope="col">Vehicle Type</th>
              <th scope="col" colSpan={2}>Action</th>
            </tr>
          </thead>
          <tbody>

            {
              vehicleData.map((vehicle) => {
                return (
                  <tr>
                    <td>{vehicle.vehiclenumberplate}</td>
                    <td>{vehicle.vehicletype}</td>
                    <td><button type="button" class="btn btn-primary" value={vehicle.vehicleid} onClick={onUpdateButtonClick}>Update</button></td>
                    <td><button type="button" class="btn btn-danger" value={vehicle.vehicleid} onClick={onDelete}>Delete</button></td>
                  </tr>
                )
              })
            }

          </tbody>
        </table>
      </div>


    </>


  );
}

export default App;
