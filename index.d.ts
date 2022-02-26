export function rega({
   name,
   initialState,
   actions,
}: {
   name: any;
   initialState: any;
   actions: any;
}): {
   [x: string]: any;
};
export { createRouterSaga } from "./src/createRouterSaga";
