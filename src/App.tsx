import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Layout from './layout/layout';
import MainView from './views/MainView';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<MainView />} />
          
          {/* <Route path="tickets" element={<TicketPage />} /> */}
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
