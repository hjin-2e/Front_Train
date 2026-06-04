import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Layout from './layout/layout';
import MainView from './views/MainView';
import Login from './views/Login';
import Signup from './views/Signup';
import TrainList from './views/TrainList';
import Confirm from './views/Confirm';
import Ticket from './views/Ticket';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<MainView />} />
          <Route path="login" element={<Login />} />
          <Route path="signup" element={<Signup />} />
          <Route path="trains" element={<TrainList />} />
          <Route path="confirm" element={<Confirm />} />
          <Route path="ticket" element={<Ticket />} />
          
          {/* <Route path="tickets" element={<TicketPage />} /> */}
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
