import AuthComponent from './component/AuthComponent';
 import UserComponent from './component/UserComponent';
 import { BrowserRouter, Route, Routes } from 'react-router-dom';

 function App() {
   return (
     <div className="min-h-screen mx-auto bg-stone-800 flex flex-col justify-center items-center gap-2">
     <div className='text-center'>
     <h1 className='text-3xl font-bold text-yellow-400'>Welcome!</h1>
     </div>
     <BrowserRouter>
     <Routes>
       <Route path='/' element={<AuthComponent/>}></Route>
       <Route path='/user/:tokenId/:email' element={<UserComponent/>}></Route>
     </Routes>
     </BrowserRouter>
     </div>
   );
 }

 export default App;