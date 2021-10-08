import { Grid, Hidden } from "@material-ui/core";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getUserAsync } from "../../features/user/userSlice";
import EmailIcon from "@material-ui/icons/Email";

import Sidebar from "../Sidebar/Sidebar";

import "./Profile.css";
import { Link, useHistory } from "react-router-dom";
import Post from "../Post/Post";

function Profile(props) {
  const username = props.match.params.username;

  const dispatch = useDispatch();
  const user = useSelector((state) => state.user.user);
  const [isPostsSelected,setIsPostsSelected] = useState(true);
  const posts = useSelector(state=>state.user.posts);
  const currentUser = useSelector((state) => state.auth.user.username);
  const history = useHistory();

  useEffect(() => {
    dispatch(getUserAsync({ username,hasReply:false }));
  }, [dispatch, username]);

  const getReplies=()=>{
    dispatch(getUserAsync({ username,hasReply:true }));
    history.push(`/profile/${user.username}/replies`);
    setIsPostsSelected(false);
  }
  const getPosts=()=>{
    dispatch(getUserAsync({ username,hasReply:false }));
    history.push(`/profile/${user.username}`);
    setIsPostsSelected(true);
  }
  return (
    <Grid container>
      <Grid item xs={2}>
        <Sidebar active={currentUser === username && "profile"} />
      </Grid>

      <Grid item sm={8} md={8} lg={8} xs={10}>
        {user !== null && (
          <div className="profile">
            <h5>{username}</h5>
            <div className="profile__headerContainer">
              <div className="profile__header">
                <img
                  className="profile__headerImage"
                  src={` https://twitter-clone-abdi.herokuapp.com/${user.profilePic}`}
                  alt="User profile"
                />
              </div>
              <div className="profile__buttonsContainer">
                {currentUser !== username && (
                  <div>
                    <p className="profile__headerButton">
                      <EmailIcon
                        onClick={() => history.push(`/messages/${user._id}`)}
                      />
                    </p>
                    <p
                      className={
                        false
                          ? "profile__headerButton  following"
                          : "profile__headerButton"
                      }
                    >
                      Follow
                    </p>
                  </div>
                )}
              </div>
              <div className="profile__detailsContainer">
                <p className="profile__name">
                  {user.firstName} {user.lastName}
                </p>
                <p className="profile__username">@{user.username}</p>
                <div className="followersContainer">
                  <Link to={`/profile/${user._id}/following`} >
                    <span className="profile__followCount">5</span>
                    <span>Following</span>
                  </Link>
                  <Link to={`/profile/${user._id}/followers`}>
                    <span className="profile__followCount">10</span>
                    <span>Followers</span>
                  </Link>
                </div>
              </div>
            </div>
            <div className="profile__body">
              <div className="profile__bodyTabs">
                <div className={isPostsSelected? "active":''} onClick={()=>getPosts()}>
                  <Link to={`/profile/${user.username}`} >Posts</Link>
                </div>
                <div className={isPostsSelected? "":'active'} onClick={()=>getReplies() }>
                  <Link to={`/profile/${user.username}/replies`} >Replies</Link>
                </div>
              </div>
              {posts.length === 0 ?
                        <center className='home__posts__nothingToShow'>Nothing to show</center>
                        :
                        posts.map(post => <Post key={post._id} post={post} />)
                    }
            </div>
          </div>
        )}
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
