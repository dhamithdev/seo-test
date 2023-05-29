import React, { useEffect } from "react";
import "./passwordFScreen.css";

import { Link } from "react-router-dom";

import LogoIcon from "../../assets/Logo.svg";
// import Checkbox from "@atlaskit/checkbox";

function PasswordFScreen() {
  useEffect(() => {
    document.title = "Password Reset - SEO Checklist";
  }, []);

  return (
    <div className="PasswordFScreen">
      <div className="pfs-container">
        <img src={LogoIcon} alt="Logo" />

        <div className="pfs-box">
          <p>
            Forgot your password? No problem. Just let us know your email
            address and we will email you a password reset link that will allow
            you to choose a new one.
          </p>

          <div className="pfs-txt-input-container">
            <label htmlFor="email">Email</label>
            <input type="email" name="email" id="email" />
          </div>

          <div className="pfs-sendWrapper">
            <Link to="/" className="NoLink mybtn pfs-send">
              EMAIL PASSWORD RESET LINK
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

export default PasswordFScreen;
