import { Route, Routes, Navigate } from 'react-router-dom';
import Auth from './pages/Auth';
import Subadmincustomer from './pages/Subadmincustomer';
import Subadminleads from './pages/Subadminleads';
import Subadminfollowups from './pages/Subadminfollowups';
import Subadminreports from './pages/Subadminreports';
import Admindashboard from './pages/Admindashboard';
import Admintasks from './pages/Admintasks';
import Subadminstafflist from './pages/Subadminstafflist';
import Subadmintask from './pages/Subadmintask';
import Agenttask from './pages/Agenttask';
import Settings from './pages/Settings';
import Protectedroute from './pages/Protectedroute';
import Paymentreports from './pages/Paymentreports';

import PaymentAddModel from './components/payments/PaymentAddModel';
import ProductPaymentDetails from './components/payments/ProductPaymentDetails';
import PaymentReportSide from './pages/PaymentReportSide';
import PaymentDetails from './components/payments/PaymentDetails.jsx';
import Stafflist from './pages/Stafflist.jsx';





function App() {
  return (
    <Routes>
      {/* Public Route */}
      <Route path='/' element={<Auth />} />

      {/* Protected Routes */}
      <Route path='/admindashboard' element={<Protectedroute><Admindashboard /></Protectedroute>} />
      <Route path='/subadminhome' element={<Protectedroute><Admindashboard /></Protectedroute>} />
      <Route path='/agents' element={<Protectedroute><Stafflist/></Protectedroute>} />
      <Route path='/staffs' element={<Protectedroute><Subadminstafflist /></Protectedroute>} />
      <Route path='/leads' element={<Protectedroute><Subadminleads /></Protectedroute>} />
      <Route path='/customers' element={<Protectedroute><Subadmincustomer /></Protectedroute>} />
      <Route path='/tasks' element={<Protectedroute><Admintasks /></Protectedroute>} />
      <Route path='/subadmintasks' element={<Protectedroute><Subadmintask /></Protectedroute>} />
      <Route path='/agenttasks' element={<Protectedroute><Agenttask /></Protectedroute>} />
      <Route path='/followups' element={<Protectedroute><Subadminfollowups /></Protectedroute>} />
      <Route path='/payments' element={<Protectedroute><Paymentreports /></Protectedroute>} />
      <Route path='/subadminreports' element={<Protectedroute><Subadminreports /></Protectedroute>} />
      <Route path='/settings' element={<Protectedroute><Settings /></Protectedroute>} />
      
      {/* <Route path="/payment-details" element={<PaymentDetails />} /> */}
      <Route path="/payment-details/:productId" element={<PaymentDetails />} />
      <Route path="/addPayment" element={<PaymentAddModel/>} />
      <Route path='/paymentDetails' element={<PaymentDetails />} />
      <Route path='/productPaymentDetails' element={<ProductPaymentDetails />} />
      <Route path='paymentReports' element={<PaymentReportSide/>}/>
      <Route path='*' element={<Navigate to='/' />} />
    </Routes>
  );
}

export default App;
