import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { RouterProvider, createBrowserRouter, Navigate } from 'react-router-dom';
import Home from './Pages/Home/Home.jsx';
import './index.css';
import App from './App.jsx';
import TextReader from "./pages/TextReader/TextReader.jsx"
import QnA from "./pages/Q&A/Q&A.jsx"
import StudyNotes from "./pages/StudyNotes/StudyNotes.jsx"
import TakeATest from "./pages/Take A Test/TakeATest.jsx"
import Summarization from "./pages/Summarization/Summarization.jsx"

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
        path: '/textreader',
        element: <TextReader />,
      },
      {
        path: '/queandans',
        element: <QnA />,
      },
      {
        path: '/studynotes',
        element: <StudyNotes />,
      },
      {
        path: '/takeatest',
        element: <TakeATest />,
      },
      {
        path: '/summarization',
        element: <Summarization />,
      },
      
    ],
  },
]);

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <RouterProvider router={router} />
  </StrictMode>
);
