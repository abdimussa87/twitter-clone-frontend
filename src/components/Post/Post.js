import { Avatar } from '@material-ui/core'
import React, { useRef, useState } from 'react'
import { Link } from 'react-router-dom';
import FavoriteBorderIcon from '@material-ui/icons/FavoriteBorder';
import FavoriteIcon from '@material-ui/icons/Favorite';
import RepeatIcon from '@material-ui/icons/Repeat';
import ChatBubbleOutlineRoundedIcon from '@material-ui/icons/ChatBubbleOutlineRounded';
import './Post.css'
import { useDispatch } from 'react-redux';
import { createPostAsync, likeUnlikePostAsync, retweetPostAsync, unRetweetPostAsync } from '../../features/post/postSlice';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';

function Post({ post }) {
    let replyContent, pinned, replyCreatedAt, replyPostedBy, replyPostId;
    let content, createdAt, postedBy, _id;
    // if this post is a reply
    if (post.replyTo) {
        replyContent = post.content;
        pinned = post.pinned;
        replyCreatedAt = post.createdAt;
        replyPostedBy = post.postedBy;
        replyPostId = post._id;
        content = post.replyTo.content;
        createdAt = post.replyTo.createdAt;
        postedBy = post.replyTo.postedBy;
        _id = post.replyTo._id;
    } else {
        content = post.retweetData ? post.retweetData.content : post.content;
        pinned = post.retweetData ? post.retweetData.pinned : post.pinned;
        createdAt = post.retweetData ? post.retweetData.createdAt : post.createdAt;
        postedBy = post.retweetData ? post.retweetData.postedBy : post.postedBy;
        _id = post.retweetData ? post.retweetData._id : post._id;
    }
    const retweetedBy = post.retweetData ? post.postedBy : null;
    const replyTo = post.replyTo ? post.replyTo.postedBy : null;
    // make required chages to is liked, for retweets and replies
    const [isLiked, setIsLiked] = useState(post.isLiked)
    const [isReplyLiked, setIsReplyLiked] = useState(post.isLiked)

    const [likes, setLikes] = useState(post.likes.length)
    const [replyLikes, setReplyLikes] = useState(post.likes.length)

    const [isRetweeted, setIsRetweeted] = useState(post.isRetweeted)
    const [isReplyRetweeted, setIsReplyRetweeted] = useState(post.isRetweeted)

    const [retweets, setRetweets] = useState(post.retweetUsers.length)
    const [replyRetweets, setReplyRetweets] = useState(post.retweetUsers.length)

    const { firstName, lastName, username, profilePic } = postedBy
    const timestamp = timeDifference(new Date(), new Date(createdAt))
    const replyTimestamp = timeDifference(new Date(), new Date(replyCreatedAt))
    const [replyMessage, setReplyMessage] = useState('')
    const dispatch = useDispatch()
    const [open, setOpen] = React.useState(false);
    const textAreaRef = useRef(null);

    const handleClickOpen = () => {
        setOpen(true);
    };
    const handleReplyClick = () => {
        dispatch(createPostAsync({ postMessage: replyMessage, replyTo: _id }))
        setReplyMessage('')
        setOpen(false);

    }

    const handleClose = () => {
        setOpen(false);
    };
    const handleLikeClick = () => {
        dispatch(likeUnlikePostAsync({ postId: _id, isLiked }))
        isLiked ? setLikes(likes - 1) : setLikes(likes + 1)
        setIsLiked(!isLiked)
    }
    const handleReplyLikeClick = () => {
        dispatch(likeUnlikePostAsync({ postId: replyPostId, isReplyLiked }))
        isReplyLiked ? setReplyLikes(replyLikes - 1) : setReplyLikes(replyLikes + 1)
        setIsReplyLiked(!isReplyLiked)
    }
    const handleReplyRetweetClick = () => {
        isReplyRetweeted ? dispatch(unRetweetPostAsync({ postId: replyPostId })) : dispatch(retweetPostAsync({ postId: replyPostId }));
        isReplyRetweeted ? setReplyRetweets(replyRetweets - 1) : setReplyRetweets(replyRetweets + 1);
        setIsReplyRetweeted(!isReplyRetweeted);
    }
    const handleRetweetClick = () => {
        isRetweeted ? dispatch(unRetweetPostAsync({ postId: _id })) : dispatch(retweetPostAsync({ postId: _id }));
        isRetweeted ? setRetweets(retweets - 1) : setRetweets(retweets + 1);
        setIsRetweeted(!isRetweeted);
    }
    const renderReplyDialog = () => {
        return <Dialog open={open} onClose={handleClose} aria-labelledby="form-dialog-title" maxWidth='sm' fullWidth onEntered={() => textAreaRef.current.focus()}>
            <DialogTitle id="form-dialog-title">Reply</DialogTitle>
            <DialogContent className='reply'>
                <div className="reply__topContainer">
                    <Avatar src={`http://localhost:8080/${profilePic}`} />
                    <div className="post__right">
                        {pinned && <h6>Pinned Post</h6>}
                        <span>
                            <Link to={`/profile/${postedBy.username}`}>
                                {`${firstName} ${lastName} `}
                            </Link>
                            <span className='post__right__username'>{`@${username} `}</span>
                            <span className='post__right__createdAt'>{timestamp}</span>
                        </span>
                        <p>{content}</p>
                        <div className="post__right__footer">
                            <span className='post__right__comment'>
                                <ChatBubbleOutlineRoundedIcon className='post__right__commentBtn' onClick={handleClickOpen} />

                            </span>
                            <span style={{ color: isRetweeted ? '#23c26b' : 'inherit', display: 'flex', alignItems: 'center' }} className='post__right__retweet'>
                                <RepeatIcon className='post__right__retweetBtn' onClick={handleRetweetClick} />
                                <p style={{
                                    visibility: retweets > 0 ? 'inherit' : 'hidden'
                                }}>{retweets}</p>
                            </span>
                            <span style={{ color: isLiked ? 'red' : 'inherit', display: 'flex', alignItems: 'center' }
                            } className='post__right__like'>
                                {isLiked ?
                                    <FavoriteIcon className='post__right__likeBtn' onClick={handleLikeClick} /> :
                                    <FavoriteBorderIcon className='post__right__likeBtn' onClick={handleLikeClick} />
                                }
                                <p style={{
                                    visibility: likes > 0 ? 'inherit' : 'hidden'
                                }}>{likes}</p>
                            </span>
                        </div>
                    </div>
                </div>
                <div className="reply__bottomContainer">
                    <Avatar src={`http://localhost:8080/${profilePic}`} />

                    <textarea ref={textAreaRef} className="reply__textArea" value={replyMessage} onChange={(e) => setReplyMessage(e.target.value)} placeholder="Type your reply" />
                </div>


            </DialogContent>
            <DialogActions>
                <Button onClick={handleClose} variant="contained">
                    Cancel
                  </Button>
                <Button className='reply__button' onClick={handleReplyClick} disabled={replyMessage.trim().length > 0 ? false : true} variant="contained" >
                    Reply
                  </Button>
            </DialogActions>
        </Dialog>


    }



    return (
        <div className='post'>
            {retweetedBy && <span className='post__retweetedBy'>                            <RepeatIcon /> Retweeted by <a href={`/profile/${retweetedBy.username}`}> @{retweetedBy.username}</a> </span>}
            <div className={replyTo ? "post__mainContainer noBorderBottom" : "post__mainContainer"}>
                <Avatar src={`http://localhost:8080/${profilePic}`} />
                <div className="post__right">
                    {pinned && <h6>Pinned Post</h6>}
                    <span>
                        <Link to={`/profile/${postedBy.username}`}>
                            {`${firstName} ${lastName} `}
                        </Link>
                        <span className='post__right__username'>{`@${username} `}</span>
                        <span className='post__right__createdAt'>{timestamp}</span>
                    </span>
                    <p>{content}</p>
                    <div className="post__right__footer">
                        <span className='post__right__comment'>
                            <ChatBubbleOutlineRoundedIcon className='post__right__commentBtn' onClick={handleClickOpen} />

                        </span>
                        <span style={{ color: isRetweeted ? '#23c26b' : 'inherit', display: 'flex', alignItems: 'center' }} className='post__right__retweet'>
                            <RepeatIcon className='post__right__retweetBtn' onClick={handleRetweetClick} />
                            <p style={{
                                visibility: retweets > 0 ? 'inherit' : 'hidden'
                            }}>{retweets}</p>
                        </span>
                        <span style={{ color: isLiked ? 'red' : 'inherit', display: 'flex', alignItems: 'center' }
                        } className='post__right__like'>
                            {isLiked ?
                                <FavoriteIcon className='post__right__likeBtn' onClick={handleLikeClick} /> :
                                <FavoriteBorderIcon className='post__right__likeBtn' onClick={handleLikeClick} />
                            }
                            <p style={{
                                visibility: likes > 0 ? 'inherit' : 'hidden'
                            }}>{likes}</p>
                        </span>
                    </div>
                </div>
            </div>
            {replyTo && <div className='replyToContainer'>
                <Avatar src={`http://localhost:8080/${replyPostedBy.profilePic}`} />
                <div className="post__right">
                    {pinned && <h6>Pinned Post</h6>}
                    <span>
                        <Link to={`/profile/${replyPostedBy.username}`}>
                            {`${replyPostedBy.firstName} ${replyPostedBy.lastName} `}
                        </Link>
                        <span className='post__right__username'>{`@${replyPostedBy.username} `}</span>
                        <span className='post__right__createdAt'>{replyTimestamp}</span>
                    </span>
                    <p>{replyContent}</p>
                    <div className="post__right__footer">
                        <span className='post__right__comment'>
                            <ChatBubbleOutlineRoundedIcon className='post__right__commentBtn' onClick={handleClickOpen} />

                        </span>
                        <span style={{ color: isReplyRetweeted ? '#23c26b' : 'inherit', display: 'flex', alignItems: 'center' }} className='post__right__retweet'>
                            <RepeatIcon className='post__right__retweetBtn' onClick={handleReplyRetweetClick} />
                            <p style={{
                                visibility: replyRetweets > 0 ? 'inherit' : 'hidden'
                            }}>{replyRetweets}</p>
                        </span>
                        <span style={{ color: isReplyLiked ? 'red' : 'inherit', display: 'flex', alignItems: 'center' }
                        } className='post__right__like'>
                            {isReplyLiked ?
                                <FavoriteIcon className='post__right__likeBtn' onClick={handleReplyLikeClick} /> :
                                <FavoriteBorderIcon className='post__right__likeBtn' onClick={handleReplyLikeClick} />
                            }
                            <p style={{
                                visibility: replyLikes > 0 ? 'inherit' : 'hidden'
                            }}>{replyLikes}</p>
                        </span>
                    </div>
                </div>
            </div>}
            {renderReplyDialog()}
        </div>
    )
}
function timeDifference(current, previous) {

    var msPerMinute = 60 * 1000;
    var msPerHour = msPerMinute * 60;
    var msPerDay = msPerHour * 24;
    var msPerMonth = msPerDay * 30;
    var msPerYear = msPerDay * 365;

    var elapsed = current - previous;

    if (elapsed < msPerMinute) {
        if (elapsed / 1000 < 30) return "Just now"
        return Math.floor(elapsed / 1000) + ' seconds ago';
    }

    else if (elapsed < msPerHour) {
        return Math.floor(elapsed / msPerMinute) + ' minutes ago';
    }

    else if (elapsed < msPerDay) {
        return Math.floor(elapsed / msPerHour) + ' hours ago';
    }

    else if (elapsed < msPerMonth) {
        return Math.floor(elapsed / msPerDay) + ' days ago';
    }

    else if (elapsed < msPerYear) {
        return Math.floor(elapsed / msPerMonth) + ' months ago';
    }

    else {
        return Math.floor(elapsed / msPerYear) + ' years ago';
    }
}

export default Post
