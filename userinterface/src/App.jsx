import "./App.css";
import { Route, Routes } from "react-router";
import Indexlandingpage from "./components/pages/landingpage/Indexlandingpage";
import Loginpage from "./components/pages/auth/Loginpage";
import Signuppage from "./components/pages/auth/Signuppage";

function App() {
  return (
    <>
      <Routes>
        <Route index element={<Indexlandingpage />} />
        <Route path="auth">
          <Route path="signin" element={<Loginpage />} />
          {/* <Route path="forgot-password" element={<ForgotPasswordPage />} /> */}
          <Route path="signup" element={<Signuppage />} />
        </Route>
      </Routes>
    </>
  );
}

export default App;
