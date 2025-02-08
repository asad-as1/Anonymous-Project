import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { RouterProvider, createBrowserRouter } from 'react-router-dom';
import Home from './Pages/Home/Home.jsx';
import './index.css';
import App from './App.jsx';
import TextReader from "./pages/TextReader/TextReader.jsx";
import QnA from "./pages/Q&A/Q&A.jsx";
import StudyNotes from "./pages/StudyNotes/StudyNotes.jsx";
import SignUp from "./pages/SignUp/SignUp.jsx";
import TakeATest from "./pages/Take A Test/TakeATest.jsx";
import Summarization from "./pages/Summarization/Summarization.jsx";
import Login from "./pages/Login/Login.jsx";
import ProtectedRoute from './components/ProtectedRoute.jsx';  

const router = createBrowserRouter([
  {
    path: '/',
    element: <App />,
    children: [
      {
        path: '/',
        element: <Home />,
      },
      {
        path: '/login',
        element: <Login />, 
      },
      {
        path: '/signup',
        element: <SignUp />, 
      },
      {
        path: '/textreader',
        element: <ProtectedRoute element={<TextReader />} />, 
      },
      {
        path: '/queandans',
        element: <ProtectedRoute element={<QnA />} />, 
      },
      {
        path: '/studynotes',
        element: <ProtectedRoute element={<StudyNotes />} />,
      },
      {
        path: '/takeatest',
        element: <ProtectedRoute element={<TakeATest />} />,
      },
      {
        path: '/summarization',
        element: <ProtectedRoute element={<Summarization />} />,
      },
    ],
  },
]);


createRoot(document.getElementById('root')).render(
  <StrictMode>
    <RouterProvider router={router} />
  </StrictMode>
);
