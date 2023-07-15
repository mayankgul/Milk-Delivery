import { useContext } from "react";
import { AlertDialog } from "./AlertDialog";
import { UserContext } from "../../context/userContext";
import { Typography } from "@mui/material";
import { useNavigate } from "react-router-dom";

export const SessionExpiredAlert = () => {
  const navigate = useNavigate();
  const { userDetails, fetchNewUserDetails } = useContext(UserContext);

  return (
    <AlertDialog
      open={userDetails === null}
      title="Login session expired"
      content={
        <Typography variant="body2">
          The login session has expired. Please log in again.
        </Typography>
      }
      showActions={true}
      actions={[
        {
          text: "OK",
          onclick: () => {
            fetchNewUserDetails({ logout: true });
            navigate("/login");
          },
        },
      ]}
    />
  );
};