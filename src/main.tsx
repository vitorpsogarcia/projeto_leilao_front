import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter, Route, Routes } from "react-router";
import "./index.css";
import App from "./layouts/App.tsx";
import { Auth } from "./layouts/Auth.tsx";
import ROUTES from "./config/routes.config.ts";
import Login from "./screens/auth/login.tsx";
import Home from "./screens/app/home.tsx";
import SignUp from "./screens/auth/sign-up.tsx";
import ForgotPassword from "./screens/auth/forgot-password.tsx";
import ResetPassword from "./screens/auth/reset-password.tsx";
import { Toaster } from "sonner";
import { Profile } from "./screens/app/profile.tsx";
import { ProtectedRoute } from "./components/protected-route.tsx";
import CategoriaForm from "./screens/app/categoria-form.tsx";
import CategoriaList from "./screens/app/categoria-list.tsx";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<App />}>
          <Route path={ROUTES.HOME} element={<Home />} />
          <Route
            path={ROUTES.PROFILE}
            element={
              <ProtectedRoute>
                <Profile />
              </ProtectedRoute>
            }
          />
          <Route
            path={ROUTES.CATEGORIA_LIST}
            element={
              <ProtectedRoute>
                <CategoriaList />
              </ProtectedRoute>
            }
          />
          <Route
            path={ROUTES.CATEGORIA_FORM}
            element={
              <ProtectedRoute>
                <CategoriaForm />
              </ProtectedRoute>
            }
          />
          <Route
            path={`${ROUTES.CATEGORIA_FORM}/:id`}
            element={
              <ProtectedRoute>
                <CategoriaForm />
              </ProtectedRoute>
            }
          />
        </Route>
        <Route path={"/" + ROUTES.AUTH} element={<Auth />}>
          <Route path="login" element={<Login />} />
          <Route path="sign-up" element={<SignUp />} />
          <Route path={ROUTES.FORGOT_PASSWORD} element={<ForgotPassword />} />
          <Route path={ROUTES.RESET_PASSWORD} element={<ResetPassword />} />
        </Route>
      </Routes>
    </BrowserRouter>
    <Toaster position="bottom-right" richColors />
  </StrictMode>
);
