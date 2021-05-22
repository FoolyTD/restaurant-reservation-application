import React, { useState, useEffect } from "react";
import CreateReservation from "../reservations/CreateReservation";
import CreateTable from "../tables/createTable";
import { Redirect, Route, Switch } from "react-router-dom";
import Dashboard from "../dashboard/Dashboard";
import NotFound from "./NotFound";
import { today } from "../utils/date-time";
import useQuery from "../utils/useQuery";
import SeatReservation from "../reservations/SeatReservation";
import { listTables } from "../utils/apiCalls";

/**
 * Defines all the routes for the application.
 *
 * You will need to make changes to this file.
 *
 * @returns {JSX.Element}
 */
function Routes() {
  const [tables, setTables] = useState([]);
  useEffect(loadTables, [])

  function loadTables() {
    const abortController = new AbortController();

    listTables()
    .then(setTables)
    .catch();
    return () => abortController.abort();
  }

  const query = useQuery();
	const date = query.get("date");
  return (
    <Switch>
      <Route exact={true} path="/">
        <Redirect to={"/dashboard"} />
      </Route>
      <Route exact={true} path="/reservations">
        <Redirect to={"/dashboard"} />
      </Route>
      <Route exact={true} path="/reservations/:reservationId/seat">
        <SeatReservation tables={tables} loadTables={loadTables} />
      </Route>
      <Route exact={true} path="/reservations/new">
        <CreateReservation />
      </Route>
      <Route path="/dashboard">
        <Dashboard date={date ? date : today()} />
      </Route>
      <Route path="/tables/new">
      <CreateTable />
      </Route>
      <Route>
        <NotFound />
      </Route>
    </Switch>
  );
}

export default Routes;
