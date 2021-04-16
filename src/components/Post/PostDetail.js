import { Grid, Hidden } from '@material-ui/core'
import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { getPostAsync, getPostRepliesAsync } from '../../features/post/postSlice'
import Sidebar from '../Sidebar/Sidebar'
import Post from './Post'
import './PostDetail.css'
function PostDetail(props) {
    const id = props.match.params.id
    const dispatch = useDispatch()
    const post = useSelector(state => state.post.post)
    const replies = useSelector(state => state.post.postReplies)
    useEffect(() => {
        dispatch(getPostAsync({ id }))
        dispatch(getPostRepliesAsync({ id }))
    }, [dispatch, id])
    return (

        <Grid container>
            <Grid item xs={2}>
                <Sidebar active='home' />
            </Grid>

            <Grid className='postDetail' item sm={8} md={8} lg={8} xs={10}>
                <div className="postDetail__header">
                    <h4 >View post</h4>
                </div>
                <div className="postDetail__content">
                    {post && <Post post={post} />}
                </div>
                <div className="postDetail__replies">
                    {replies.map(reply => <Post key={reply._id} post={reply} />)}
                </div>
            </Grid>

            <Hidden xsDown>
                <Grid className='home__right' item sm >
                    <h5>This is right end</h5>
                </Grid>
            </Hidden>
        </Grid>
    )
}

export default PostDetail
