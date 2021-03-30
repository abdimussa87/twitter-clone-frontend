import { Avatar } from '@material-ui/core'
import React from 'react'
import { Link } from 'react-router-dom';
import FavoriteIcon from '@material-ui/icons/Favorite';
import RepeatIcon from '@material-ui/icons/Repeat';
import ChatBubbleOutlineRoundedIcon from '@material-ui/icons/ChatBubbleOutlineRounded';
import './Post.css'

function Post({ post }) {
    const { content, pinned, postedBy, createdAt } = post;
    const { firstName, lastName, username, profilePic } = postedBy
    return (
        <div className='post'>
            <Avatar src={`http://localhost:8080/${profilePic}`} />
            <div className="post__right">
                {pinned && <h6>Pinned Post</h6>}
                <span>
                    <Link to={`/profile/${postedBy.username}`}>
                        {`${firstName} ${lastName} `}
                    </Link>
                    <span className='post__right__username'>{`@${username} `}</span>
                    <span className='post__right__createdAt'>{createdAt}</span>
                </span>
                <p>{content}</p>
                <div className="post__right__footer">
                    <ChatBubbleOutlineRoundedIcon />
                    <RepeatIcon />
                    <FavoriteIcon />
                </div>
            </div>
        </div>
    )
}

export default Post
