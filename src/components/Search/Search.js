import { Grid, Hidden } from '@material-ui/core'
import React from 'react'
import Sidebar from '../Sidebar/Sidebar'
import './Search.css'
function Search() {
    return (
        <Grid container>
            <Grid item xs={2}>
                <Sidebar active='search' />
            </Grid>

            <Grid className='search' item sm={8} md={8} lg={8} xs={10}>
                <h5>This is search page</h5>
            </Grid>

            <Hidden xsDown>
                <Grid className='home__right' item sm >
                    <h5>This is right end</h5>
                </Grid>
            </Hidden>
        </Grid>
    )
}

export default Search
