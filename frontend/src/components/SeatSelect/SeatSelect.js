import Plane from "./Plane";
import { useEffect, useState } from "react";
import { useHistory } from "react-router-dom";
import styled from "styled-components";

const SeatSelect = ({ setResId }) => {
  const [flightNumber, setFlightNumber] = useState("");

  const [cxFirstName, setCxFirstName] = useState("");
  const [cxLastName, setCxLastName] = useState("");
  const [cxEmail, setCxEmail] = useState("");

  const [selectedSeat, setSelectedSeat] = useState(null);
  const history = useHistory();

  const handleSubmit = (ev) => {
    ev.preventDefault();
    if (cxFirstName && cxLastName && cxEmail) {
      fetch(`/api/add-reservation`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify({
          firstName: cxFirstName,
          lastName: cxLastName,
          email: cxEmail,
          seatId: selectedSeat,
          flight: flightNumber,
        }),
      })
        .then((res) => res.json())
        .then((response) => {
          if (response.status === 200) {
            localStorage.setItem("_id", response._id);
            setResId(response._id);
            history.push("/confirmed");
          }
        });
    }
  };

  return (
    <>
      <Div>
        <DDMWrapper>
          <form>
            <Label for="flights">
              FLIGHT NUMBER :
              <Select onChange={(event) => setFlightNumber(event.target.value)}>
                <option value="">Select a Flight</option>
                <option value="SA231">SA231</option>
              </Select>
            </Label>
          </form>
        </DDMWrapper>
        <H2>Select your seat and Provide your information!</H2>
        <MainWrapper>
          <Plane
            flightNumber={flightNumber}
            selectedSeat={selectedSeat}
            setSelectedSeat={setSelectedSeat}
          />
          <CxForm onSubmit={handleSubmit}>
            <input
              type="text"
              placeholder="First Name"
              value={cxFirstName}
              onChange={(ev) => setCxFirstName(ev.target.value)}
            />
            <input
              type="text"
              placeholder="Last Name"
              value={cxLastName}
              onChange={(ev) => setCxLastName(ev.target.value)}
            />
            <input
              type="text"
              placeholder="Email"
              value={cxEmail}
              onChange={(ev) => setCxEmail(ev.target.value)}
            />
            <Button type="submit">Confirm</Button>
          </CxForm>
        </MainWrapper>
      </Div>
    </>
  );
};
const Div = styled.div`
  background-color: var(--color-orange);
`;
const DDMWrapper = styled.div`
  background-color: var(--color-cadmium-red);
  padding: 20px;
`;
const Select = styled.select`
  padding: 5px;
  margin-left: 20px;
  border-radius: 5px;
`;
const Label = styled.label`
  display: flex;
`;
const H2 = styled.h2`
  padding: 10px;
`;
const MainWrapper = styled.div`
  padding: 10px;
  display: flex;
  justify-content: center;
  /* min-height: 800px; */
`;
const CxForm = styled.form`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  border: 5px solid var(--color-cadmium-red);
  border-radius: 5px;
  min-width: 400px;
  max-height: 300px;
  margin-top: 150px;
`;
const Button = styled.button`
  cursor: pointer;
  background-color: #d66324;
  padding: 3px 85px;
  margin-top: 3px;
  border: none;
  border-radius: 2px;
  &:hover {
    background-color: var(--color-cadmium-red);
  }
  &:active {
    transform: scale(1.02);
    background-color: var(--color-cadmium-red);
  }
`;
export default SeatSelect;
