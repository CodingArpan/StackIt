import "./App.css";
import { Route, Routes } from "react-router";
import Indexlandingpage from "./components/pages/landingpage/Indexlandingpage";
import Loginpage from "./components/pages/auth/Loginpage";
import Signuppage from "./components/pages/auth/Signuppage";
import AsknewQuestion from "./components/pages/Asknewquestion.jsx/AsknewQuestion";
import Viewquestionanswer from "./components/pages/Viewquestionanswer/Viewquestionanswer";

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
        <Route path="ask-new-question" element={<AsknewQuestion />} />
        <Route path="view-question/:id" element={<Viewquestionanswer />} />
        {/* <Route path="profile" element={<ProfilePage />} /> */}
        {/* <Route path="settings" element={<SettingsPage />} /> */}
        {/* <Route path="notifications" element={<NotificationsPage />} /> */}
        {/* <Route path="search" element={<SearchPage />} /> */}
        {/* <Route path="*" element={<NotFoundPage />} /> */}
      </Routes>
    </>
  );
}

export default App;
