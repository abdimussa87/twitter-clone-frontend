import React, { useEffect, useState } from 'react'
import './Home.css'
import { Grid, Hidden } from '@material-ui/core'
import Sidebar from '../Sidebar/Sidebar';
import { useDispatch, useSelector } from 'react-redux';
import { createPostAsync, getPostsAsync } from '../../features/post/postSlice';
import Post from '../Post/Post';

function Home() {
    const user = useSelector(state => state.auth.user)
    const [postMessage, setpostMessage] = useState('');
    const post = useSelector(state => state.post)
    //    const [posts, setposts] = useState([])
    const dispatch = useDispatch()
    const handleAddPostClick = () => {
        console.log('clicked')
        dispatch(createPostAsync({ postMessage }))
    }

    useEffect(() => {
        dispatch(getPostsAsync({}))
    }, [dispatch])

    return (
        <Grid container>
            <Grid item xs={2}>
                <Sidebar active='home' />
            </Grid>

            <Grid className='home' item sm={8} md={8} lg={8} xs={10}>
                <div className="home__header">
                    <h4 >Home</h4>
                </div>
                <div className="home__createPostContainer">
                    <img src={`http://localhost:8080/${user?.profilePic}`} alt="User's profile " />

                    <div className="home__createPostContainer__right">
                        <textarea value={postMessage} onChange={(e) => setpostMessage(e.target.value)} placeholder="What's happening?" />

                        <button disabled={postMessage.trim().length > 0 ? false : true} onClick={handleAddPostClick}>Post</button>
                    </div>
                </div>

                <div className="home__posts">
                    {post.posts.map((post, index) => <Post key={index} post={post} />)}
                </div>
            </Grid>

            <Hidden xsDown>
                <Grid className='home__right' item sm >

                </Grid>
            </Hidden>
        </Grid>
    )
}

export default Home
