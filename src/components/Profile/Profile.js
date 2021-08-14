import { Grid, Hidden } from "@material-ui/core";
import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getUserAsync } from "../../features/user/userSlice";
import Sidebar from "../Sidebar/Sidebar";

import "./Profile.css";

function Profile(props) {
  const username = props.match.params.username;

  const dispatch = useDispatch();
  const user = useSelector((state) => state.user.user);
  const currentUser = useSelector((state) => state.auth.user.username);
  useEffect(() => {
    dispatch(getUserAsync({ username }));
  }, [dispatch, username]);
  return (
    <Grid container>
      <Grid item xs={2}>
        <Sidebar active={currentUser === username && "profile"} />
      </Grid>

      <Grid className="profile" item sm={8} md={8} lg={8} xs={10}>
        {user !== null && <h5>This is profile page</h5>}
        {user === null && (
          <center>
            <h5>User not found</h5>
          </center>
        )}
      </Grid>

      <Hidden xsDown>
        <Grid className="home__right" item sm>
          <h5>This is right end</h5>
        </Grid>
      </Hidden>
    </Grid>
  );
}

export default Profile;
