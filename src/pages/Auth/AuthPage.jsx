import { useState } from "react";
import { useAuth } from "../context/AuthContext";
import SignInForm from "../components/SignInForm";
import SignUpForm from "../components/SignUpForm";
import ProfilePage from "../components/ProfilePage";
import LeftPanel from "../components/LeftPanel";

const AuthPage = () => {
  const { currentUser, logout } = useAuth();
  const [activeTab, setActiveTab] = useState("signin");

  if (currentUser) return <ProfilePage user={currentUser} onLogout={logout} />;

  return (
    <div className="split-container">
      <LeftPanel />
      <div className="right-panel">
        <h1>Auth <span>System</span></h1>
        <div className="tabs">
          <button onClick={() => setActiveTab("signin")} className={activeTab === "signin" ? "active" : ""}>Sign In</button>
          <button onClick={() => setActiveTab("signup")} className={activeTab === "signup" ? "active" : ""}>Sign Up</button>
        </div>
        {activeTab === "signin" ? <SignInForm switchToSignUp={() => setActiveTab("signup")} /> : <SignUpForm switchToSignIn={() => setActiveTab("signin")} />}
      </div>
    </div>
  );
};

export default AuthPage;
