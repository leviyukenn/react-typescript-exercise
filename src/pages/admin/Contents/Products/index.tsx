import { Route, Switch } from "react-router-dom";
import { routeList } from "../../../../config/routeConfig";

export default function Products() {
  return (
    <Switch>
      {routeList
        .find((item) => item.key === "products")
        ?.children!.map((item) => {
          return (
            <Route key={item.key} path={item.path}>
              {item.component}
            </Route>
          );
        })}
    </Switch>
  );
}
