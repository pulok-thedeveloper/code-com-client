import { RouterProvider } from 'react-router-dom';
import './App.css';
import {Toaster} from 'react-hot-toast';
import { routes } from './Routes/Routes';

function App() {
  return (
    <div className="App">
    <Toaster/>
    <RouterProvider router={routes}></RouterProvider>

    </div>
  );
}

export default App;
