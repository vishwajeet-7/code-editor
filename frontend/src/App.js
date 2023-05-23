import './App.css';
import {BrowserRouter,Routes,Route} from 'react-router-dom'
import Home from './components/Home';
import EditorPage from './components/EditorPage';
import { Toaster } from 'react-hot-toast';

function App() {
  return (
    <>
    <Toaster position='top-right' toastOptions={{
      success:{
        theme:{
          primary:"#4aed88",
        }
      }
    }}>

    </Toaster>
    <BrowserRouter>
    <Routes>
      <Route path='/' element={<Home/>}></Route>
      <Route path='/editor/:roomID' element={<EditorPage/>}></Route>
      <Route path='*' element={""}/>
    </Routes>
    </BrowserRouter>
    </>
  );
}

export default App;
