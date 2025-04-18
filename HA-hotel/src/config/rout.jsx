import Dashboard from "./Dashboard";
import Chambres from "./Chambres";
import Reservations from "./Reservations";
import Menus from "./Menus";
import Rapports from "./Rapports";
import Bar from "./Bar";

const routes = [
  { path: "/", element: <Dashboard /> },
  { path: "/chambres", element: <Chambres /> },
  { path: "/reservations", element: <Reservations /> },
  { path: "/menus", element: <Menus /> },
  { path: "/rapports", element: <Rapports /> },
  { path: "/bar", element: <Bar /> },
];

export default routes;
