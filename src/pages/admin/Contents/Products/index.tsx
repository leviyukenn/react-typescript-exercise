import { Redirect, Route, Switch } from "react-router-dom";
import { RouteItem, routeList } from "../../../../config/routeConfig";

export default function Products() {
  const routeDescendant = collectAllRoutes(
    routeList.find((item) => item.key === "products")!.children!
  );
  console.log(routeDescendant);
  return (
    <Switch>
      {routeDescendant.map((item) => {
        return (
          <Route key={item.key} path={item.path} exact={item.exact}>
            {item.component}
          </Route>
        );
      })}

      <Redirect to={routeDescendant[0].path}></Redirect>
    </Switch>
  );
}

function collectAllRoutes(children: RouteItem[]): RouteItem[] {
  const collectedRoutes: RouteItem[] = [];
  const walkOverRoutes = (routes: RouteItem[]) => {
    routes.forEach((item) => {
      if (item.children) {
        collectedRoutes.push(item);
        walkOverRoutes(item.children);
      } else {
        collectedRoutes.push(item);
      }
    });
  };
  walkOverRoutes(children);
  return collectedRoutes;
}
