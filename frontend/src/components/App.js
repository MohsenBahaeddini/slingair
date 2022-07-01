import styled from "styled-components";
import { BrowserRouter, Switch, Route } from "react-router-dom";
import Header from "./Header";
import Footer from "./Footer";
import SeatSelect from "./SeatSelect";
import Confirmation from "./Confirmation";
import ReservationPage from "./ReservationPage";
import GlobalStyles from "./GlobalStyles";
import { useState } from "react";

const App = () => {
  const [resId, setResId] = useState(localStorage.getItem("_id"));
  return (
    <BrowserRouter>
      <GlobalStyles />
      <Header resId={resId} />
      <Main>
        <Switch>
          <Route exact path="/">
            <SeatSelect setResId={setResId} />
          </Route>
          <Route exact path="/confirmed">
            <Confirmation />
          </Route>
          <Route path="/view-reservation">
            <ReservationPage />
          </Route>
        </Switch>
        <Footer />
      </Main>
    </BrowserRouter>
  );
};

const Main = styled.div`
  background: var(--color-orange);
  display: flex;
  flex-direction: column;
  height: calc(100vh - 110px);
`;

export default App;
