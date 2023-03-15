import { createBrowserRouter } from "react-router-dom";
import EditorPage from "../Pages/EditorPage/EditorPage";
import Home from "../Pages/Home/Home";

export const routes = createBrowserRouter([
    {
        path: '/',
        element: <Home></Home>
    },
    {
        path: '/editor/:roomid',
        element: <EditorPage></EditorPage>
    },
])