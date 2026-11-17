// import React from "react";

// import { Routes, Route } from "react-router-dom";
// import HomePage from "./Pages/HomePage";
// import AboutUs from "./Pages/About";
// import NotFound from "./Pages/NotFound";
// import Signup from "./Pages/Signup";
// import Login from "./Pages/Login";
// import ChangePassword from "./Pages/Password/ChangePassword";
// import ForgotPassword from "./Pages/Password/ForgotPassword";
// import ResetPassword from "./Pages/Password/ResetPassword";
// import Contact from "./Pages/Contact";
// import Denied from "./Pages/Denied";
// // import Bike from "./Pages/Bike";

// import RequireAuth from "./Components/auth/RequireAuth";
// import Profile from "./Pages/User/Profile";
// import { useSelector } from "react-redux";
// import ScrollToTop from "./Components/ScrollToTop";

// function App() {
//   const { isLoggedIn, role, data } = useSelector((state) => state.auth);
//   return (
//     <>
//       <ScrollToTop />
//       <Routes>
//         {/* <Route path="/about" element={<AboutUs />} /> */}

//         <Route path="/denied" element={<Denied />} />

//         <Route path="/contact" element={<Contact />} />

//         {/* <Route path="/signup" element={<Signup />} /> */}
//         <Route path="/login" element={<Login />} />
//         {/* <Route path="/" element={<HomePage />} /> */}
//         <Route
//           path="/user/profile/reset-password"
//           element={<ForgotPassword />}
//         />
//         <Route
//           path="/user/profile/reset-password/:resetToken"
//           element={<ResetPassword />}
//         />

//         <Route element={<RequireAuth allowedRoles={["ADMIN"]} />}>
//           {/* <Route path="/bike" element={<Bike />} /> */}
//           <Route path="/" element={<HomePage />} />{" "}
//         </Route>

//         <Route
//           element={<RequireAuth allowedRoles={["ADMIN", "INSTRUCTOR"]} />}
//         ></Route>

//         <Route
//           element={
//             <RequireAuth allowedRoles={["USER", "ADMIN", "INSTRUCTOR"]} />
//           }
//         >
//           {" "}
//           <Route path="/" element={<HomePage />} />
//           <Route path="/user/profile" element={<Profile />} />
//           <Route
//             path="/user/profile/change-password"
//             element={<ChangePassword />}
//           />
//         </Route>

//         <Route path="*" element={<NotFound />} />
//       </Routes>
//     </>
//   );
// }

// export default App;




import React from "react";
import { Routes, Route } from "react-router-dom";
import { useSelector } from "react-redux";

import Login from "./Pages/Login";
import NotFound from "./Pages/NotFound";
import Contact from "./Pages/Contact";
import Denied from "./Pages/Denied";
import ForgotPassword from "./Pages/Password/ForgotPassword";
import ResetPassword from "./Pages/Password/ResetPassword";
import Profile from "./Pages/User/Profile";
import ChangePassword from "./Pages/Password/ChangePassword";

import RequireAuth from "./Components/auth/RequireAuth";
import ScrollToTop from "./Components/ScrollToTop";
import ShopLayout from "./Components/shop/ShopLayout";

import Dashboard from "./Pages/Dashboard/Dashboard.jsx";
import MobileList from "./Pages/Mobile/MobileList.jsx";

import PurchaseList from "./Pages/Purchase/PurchaseList.jsx";
import CreatePurchase from "./Pages/Purchase/CreatePurchase.jsx";

import SalesList from "./Pages/Sales/SalesList.jsx";
import CreateSale from "./Pages/Sales/CreateSale.jsx";
import SaleDetails from "./Pages/Sales/SaleDetails.jsx";

import ExpenseList from "./Pages/Expense/ExpenseList.jsx";

import ProfitLoss from "./Pages/Reports/ProfitLoss.jsx";
import Reports from "./Pages/Reports/Reports.jsx";
import SalesReport from "./Pages/Reports/SalesReport.jsx";
import InventoryReport from "./Pages/Reports/InventoryReport.jsx";

function App() {
  const { isLoggedIn, role } = useSelector((state) => state.auth);

  return (
    <>
      <ScrollToTop />

      <Routes>
        {/* Public Routes */}
        <Route path="/login" element={<Login />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/denied" element={<Denied />} />

        <Route
          path="/user/profile/reset-password"
          element={<ForgotPassword />}
        />

        <Route
          path="/user/profile/reset-password/:resetToken"
          element={<ResetPassword />}
        />

        {/* Protected Admin Routes */}
        <Route element={<RequireAuth allowedRoles={["ADMIN"]} />}>
          <Route element={<ShopLayout />}>
            <Route path="/" element={<Dashboard />} />

            <Route path="/mobiles" element={<MobileList />} />

            <Route path="/purchases" element={<PurchaseList />} />
            <Route path="/purchases/create" element={<CreatePurchase />} />

            <Route path="/sales" element={<SalesList />} />
            <Route path="/sales/create" element={<CreateSale />} />
            <Route path="/sales/:id" element={<SaleDetails />} />

            <Route path="/expenses" element={<ExpenseList />} />

            <Route path="/profit-loss" element={<ProfitLoss />} />

            <Route path="/reports" element={<Reports />} />
            <Route path="/reports/sales" element={<SalesReport />} />
            <Route path="/reports/inventory" element={<InventoryReport />} />

            <Route path="/user/profile" element={<Profile />} />
            <Route
              path="/user/profile/change-password"
              element={<ChangePassword />}
            />
          </Route>
        </Route>

        <Route path="*" element={<NotFound />} />
      </Routes>
    </>
  );
}

export default App;
