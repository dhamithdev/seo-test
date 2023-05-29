import { useContext } from "react";
import { AuthContext } from "../context/auth/AuthContext";
import { supabase } from "../supabaseClient";

export default function useCreateActivity() {
  const { session } = useContext(AuthContext);

  const createActivity = async ({ activity, project_id, type }) => {
    const response = await supabase
      .from("activity")
      .insert([{ activity, user_id: session.user.id, project_id, type }]);

    if (response.error) {
      console.log({
        from: `Error Creating activity: ${activity}`,
        error: response.error,
      });
    } else {
      console.log(response.data);
    }

    return response;
  };

  return [createActivity];
}

// console.log(session); // get Session from auth context
// session.user_metadata.name // name
// session.user.email // email
// session.user.id // id

// createActivity({ activity: "", project_id: "", user_id: "" });
