import { Avatar, Grid, Hidden, IconButton } from "@material-ui/core";
import React from "react";
import Sidebar from "../Sidebar/Sidebar";
import AddCommentOutlinedIcon from "@material-ui/icons/AddCommentOutlined";
import "./Messages.css";
import { Link } from "react-router-dom";

function Messages() {
  return (
    <Grid container>
      <Grid item xs={2} sm={2} md={2} lg={2}>
        <Sidebar active="messages" />
      </Grid>

      <Grid className="messages" item sm={10} md={7} lg={6} xs={10}>
        <div className="messages__header">
          <h4>Inbox</h4>
          <IconButton>
            <Link to="/messages/new">
              <AddCommentOutlinedIcon />
            </Link>
          </IconButton>
        </div>

        <div className="messages__body">
          <div className="message_container">
            <Avatar src={`http://localhost:8080`} />
            <div className="messages__content">
              <h5 className="messages__chatName">The boys</h5>
              <p className="messages__lastChat">
                <span>Liam Payne:</span>
                <span>True</span>
              </p>
            </div>
          </div>
        </div>
      </Grid>

      <Hidden smDown>
        <Grid className="home__right" item md={3} lg={4}>
          hi
        </Grid>
      </Hidden>
    </Grid>
  );
}

export default Messages;
