import { message } from "antd";
import React, { useContext } from "react";
import { useState } from "react";
import { AuthContext } from "../../context/auth/AuthContext";
import { supabase } from "../../supabaseClient";
import "./notification.css";

// const data = [
//   {
//     id: 1,
//   },
//   {
//     id: 2,
//   },
//   // {
//   //   id: 3,
//   // },
//   // {
//   //   id: 4,
//   // },
//   // {
//   //   id: 5,
//   // },
//   // {
//   //   id: 6,
//   // },
// ];

function Notification({ inviationData }) {
  return (
    <div className="Notification">
      <div className="Notification-heading">Notification</div>

      <div className="Notification-hr" />
      {inviationData.map((item) => {
        return <InvitationItem key={item.id} item={item} />;
      })}
    </div>
  );
}
export default Notification;

const InvitationItem = ({ item }) => {
  const [invitationStatus, setInvitationStatus] = useState(null);
  const { session } = useContext(AuthContext);

  const handleAccept = async () => {
    setInvitationStatus(true);

    // Delete the invitation first.
    const { data: deleteInvitationData, error } = await supabase
      .from("team_users_pending")
      .delete()
      .match({ id: item.id });

    if (error) {
      message.error("Something Went Wrong!");
      console.log(error);
      setInvitationStatus(true);
    } else {
      console.log(deleteInvitationData);
      addToTheTeam();
    }

    // Then add to the team.
    // addToTheTeam();
  };

  const addToTheTeam = async () => {
    //
    const { data, error } = await supabase
      .from("team_users")
      .insert([
        { team_id: item.team_id, user_id: session.user.id, role: item.role },
      ]);

    if (error) {
      message.error("Something Went Wrong!");
      setInvitationStatus(true);
      console.log(error);
    } else {
      console.log(data);
      message.success("You joined the team successfully.");
    }
    //
  };

  const handleReject = async () => {
    setInvitationStatus(false);

    const { data, error } = await supabase
      .from("team_users_pending")
      .delete()
      .match({ id: item.id });

    if (error) {
      message.error("Something Went Wrong!");
      console.log(error);
      setInvitationStatus(true);
    } else {
      console.log(data);
    }
  };

  const NotificationDate = new Date(item.created_at);

  return (
    <div
      className={`Notification-item ${invitationStatus === true &&
        "Notification-Accepted"} ${invitationStatus === false &&
        "Notification-Rejected"}`}
    >
      <div className="Notification-invitation">
        <span className="Notification-emp">
          {item.inviter_email.toUpperCase()}
        </span>{" "}
        invited You to join the team
        <span className="Notification-emp"> “{item.team_name}”</span>
      </div>

      {/* <div className="Notification-date">{item.created_at}</div> */}
      <div className="Notification-date">{`${NotificationDate.toLocaleTimeString()} • ${NotificationDate.toLocaleDateString()}`}</div>

      <div>
        {invitationStatus !== null && (
          <>
            {invitationStatus === false && (
              <div
                className="Notification-status-message"
                style={{ color: "crimson", borderColor: "crimson" }}
              >
                Invitation Rejected!
              </div>
            )}
            {invitationStatus === true && (
              <div className="Notification-status-message">
                Invitation Accepted!
              </div>
            )}
          </>
        )}

        {invitationStatus === null && (
          <div className="Notification-btn-container">
            <div className="Notification-btn" onClick={handleAccept}>
              Accept
            </div>
            <div
              className="Notification-btn Notification-btn-decline"
              onClick={handleReject}
            >
              Decline
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
