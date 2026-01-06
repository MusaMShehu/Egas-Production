// import React from "react";
// import { FaUser } from "react-icons/fa";
// import { useAuth } from "../../contexts/AuthContext";
// import "../../styles/AccountSection.css";

// const AccountSection = ({ onLoginClick }) => {
//   const { user, logout } = useAuth();

//   return (
//     <div className="account-section">
//       {user ? (
//         <div className="account-info">
//           {user.profileImage && user.profileImage !== "default.jpg" ? (
//             <img src={user.profileImage} alt="profile" className="profile-pic" />
//           ) : (
//             <div className="profile-placeholder">
//               <FaUser className="user-icon" />
//             </div>
//           )}

//           <span className="user-name">{user.firstName || user.email}</span>

//           <button className="acc-sec-logout-btn" onClick={logout}>
//             Logout
//           </button>
//         </div>
//       ) : (
//         <button className="login-btn" onClick={onLoginClick}>
//           Sign in
//         </button>
//       )}
//     </div>
//   );
// };

// export default AccountSection;



import React from "react";
import { FaUser } from "react-icons/fa";
import { useAuth } from "../../contexts/AuthContext";
import "../../styles/AccountSection.css";

const AccountSection = ({ onLoginClick }) => {
  const { user, logout } = useAuth(); // Your context uses 'user' not 'currentUser'

  // Get profile image URL from Cloudinary structure
  const getProfileImageUrl = () => {
    if (!user || !user.profileImage) {
      return null;
    }
    
    // Check if profileImage is already a string URL
    if (typeof user.profileImage === 'string') {
      // If it's a Cloudinary URL or any URL
      if (user.profileImage.startsWith('http')) {
        return user.profileImage;
      }
      // If it's a filename like "default.jpg"
      return user.profileImage === "default.jpg" ? null : user.profileImage;
    }
    
    // Cloudinary object structure - check multiple possible formats
    if (user.profileImage.secure_url) {
      return user.profileImage.secure_url;
    }
    
    if (user.profileImage.url) {
      return user.profileImage.url;
    }
    
    return null;
  };

  // Get user display name
  const getUserDisplayName = () => {
    if (!user) return "";
    
    // Check your user structure - based on your code, it might have firstName/lastName or name
    if (user.firstName && user.lastName) {
      return `${user.firstName} ${user.lastName}`;
    }
    
    if (user.firstName) {
      return user.firstName;
    }
    
    if (user.name) {
      return user.name;
    }
    
    // Fallback to email
    return user.email ? user.email.split('@')[0] : "User";
  };

  return (
    <div className="account-section">
      {user ? (
        <div className="account-info">
          {getProfileImageUrl() ? (
            <img 
              src={getProfileImageUrl()} 
              alt="profile" 
              className="profile-pic"
              onError={(e) => {
                console.error("Profile image failed to load:", getProfileImageUrl());
                // Hide the image and let placeholder show
                e.target.style.display = 'none';
                // Show fallback placeholder
                const placeholder = e.target.parentNode.querySelector('.profile-placeholder');
                if (placeholder) {
                  placeholder.style.display = 'flex';
                }
              }}
            />
          ) : null}
          
          {/* Always render placeholder but hide if image loads successfully */}
          <div 
            className="profile-placeholder" 
            style={{ display: getProfileImageUrl() ? 'none' : 'flex' }}
          >
            <FaUser className="user-icon" />
          </div>

          <span className="user-name">{getUserDisplayName()}</span>

          <button className="acc-sec-logout-btn" onClick={logout}>
            Logout
          </button>
        </div>
      ) : (
        <button className="login-btn" onClick={onLoginClick}>
          Sign in
        </button>
      )}
    </div>
  );
};

export default AccountSection;