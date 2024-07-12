/*!

=========================================================
* Argon Dashboard PRO React - v1.2.5
=========================================================

* Product Page: https://www.creative-tim.com/product/argon-dashboard-pro-react
* Copyright 2024 Creative Tim (https://www.creative-tim.com)

* Coded by Creative Tim

=========================================================

* The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

*/
import React from "react";
import ReactDOM from "react-dom/client";
// react library for routing
import { BrowserRouter, Route, Routes, Navigate } from "react-router-dom";

// plugins styles from node_modules
import "react-notification-alert/dist/animate.css";
import "react-perfect-scrollbar/dist/css/styles.css";
import "sweetalert2/dist/sweetalert2.min.css";
import "select2/dist/css/select2.min.css";
import "quill/dist/quill.core.css";
import "@fortawesome/fontawesome-free/css/all.min.css";
// plugins styles downloaded
import "template/assets/vendor/nucleo/css/nucleo.css";
// core styles
import "template/assets/scss/argon-dashboard-pro-react.scss?v1.2.1";

import AdminLayout from "template/layouts/Admin.js";
import RTLLayout from "template/layouts/RTL.js";
import AuthLayout from "template/layouts/Auth.js";
import IndexView from "template/views/Index.js";

const root = ReactDOM.createRoot(document.getElementById("root"));

root.render(
  <BrowserRouter>
    <Routes>
      <Route path="/admin/*" element={<AdminLayout />} />
      <Route path="/rtl/*" element={<RTLLayout />} />
      <Route path="/auth/*" element={<AuthLayout />} />
      <Route path="/" element={<IndexView />} />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  </BrowserRouter>
);
