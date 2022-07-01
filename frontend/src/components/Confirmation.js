import { useEffect, useState } from "react";
import styled from "styled-components";
import tombstoneSrc from "../assets/tombstone.png";

const Confirmation = () => {
  const [status, setStatus] = useState("loading");
  const [reservationInfo, setReservationInfo] = useState(null);
  // ${reservation}
  const reservationNum = localStorage.getItem("_id");
  // console.log(reservationNum);
  useEffect(() => {
    setStatus("loading");
    fetch(`/api/get-reservation/${reservationNum}`)
      .then((res) => res.json())
      .then((response) => {
        setReservationInfo(response.reservation);
        // console.log(response.reservation);
        setStatus("idle");
      });
  }, [reservationNum]);

  console.log(reservationInfo);
  return (
    <Wrapper>
      {status === "idle" && (
        <Div>
          <Form>
            <Message>Your flight is confirmed!</Message>
            <div>
              <Ul>
                <Li>
                  <Bold>Reservation #: </Bold>
                  {reservationInfo._id}
                </Li>
                <Li>
                  <Bold>Flight #: </Bold>
                  {reservationInfo.flight}
                </Li>
                <Li>
                  <Bold>Seat #: </Bold>
                  {reservationInfo.seat}
                </Li>
                <Li>
                  <Bold>Name: </Bold>
                  {reservationInfo.givenName} {reservationInfo.surname}
                </Li>
                <Li>
                  <Bold>Email: </Bold>
                  {reservationInfo.email}
                </Li>
              </Ul>
            </div>
          </Form>
          <Img src={tombstoneSrc} />
        </Div>
      )}
    </Wrapper>
  );
};

const Wrapper = styled.div``;
const Div = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: calc(100vh - 200px);
`;
const Form = styled.form`
  display: flex;
  flex-direction: column;
  /* justify-content: center; */
  /* align-items: center; */
  border: 5px solid var(--color-alabama-crimson);
  border-radius: 5px;
  min-width: 400px;
  max-height: 300px;
  padding: 30px;
`;
const Message = styled.h2`
  border-bottom: 5px solid var(--color-alabama-crimson);
  color: var(--color-cadmium-red);
  font-family: var(--font-body);
  font-size: 22px;
  padding-bottom: 15px;
  margin-bottom: 15px;
`;
const Ul = styled.ul`
  /* padding: 10px; */
`;
const Li = styled.li`
  padding: 5px;
`;
const Bold = styled.span`
  font-weight: bold;
`;
const Img = styled.img`
  margin-top: 20px;
  width: 110px;
  height: 110px;
`;
export default Confirmation;
