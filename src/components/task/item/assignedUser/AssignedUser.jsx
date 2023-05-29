import React from "react";
import "./assignedUser.css";

import { UserDeleteOutlined } from "@ant-design/icons";
import { Avatar } from "antd";
import { supabase } from "../../../../supabaseClient";

// const data = [
//   {
//     id: 1,
//     name: "Rashmi Shehana",
//   },
//   {
//     id: 2,
//     name: "Sandun Karunasinghe",
//   },
//   {
//     id: 3,
//     name: "Thilina Guruge",
//   },
//   {
//     id: 4,
//     name: "Arosh Akalanka",
//   },
// ];

function AssignedUser({
  teamMembersData,
  taskId,
  setAssignedUser,
  assignedUser,
}) {
  const handleAssign = (id) => {
    async function updateDb() {
      const { data, error } = await supabase
        .from("task_project")
        .update({ assigned_user_id: id })
        .match({ id: taskId });

      if (error) {
        console.log(error);
      } else {
        console.log(data);
      }
    }

    setAssignedUser(id); // Update UI
    updateDb(); // Update database
  };

  return (
    <div className="AssignedUser">
      <div
        className="AssignedUser-item Unassigned"
        onClick={() => handleAssign(null)}
      >
        <UserDeleteOutlined />
        <div className="AssignedUser-itemName">Unassigned</div>
      </div>

      {teamMembersData.map((member) => {
        // console.log(member);
        const iAmAssigned = assignedUser === member.id;

        return (
          <li
            key={member.user_id.user_id}
            className={`AssignedUser-item ${iAmAssigned &&
              "AssignedUser-item-assigned"}`}
            onClick={() => handleAssign(member.id)}
          >
            <Avatar size={"small"}>{member.user_id.name[0]}</Avatar>
            <div className="AssignedUser-itemName">{member.user_id.name}</div>
          </li>
        );
      })}
    </div>
  );
}

export default AssignedUser;
