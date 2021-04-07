import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import {Grid,List, ListItem,Hidden,Box,Modal} from '@material-ui/core'
import {makeStyles} from '@material-ui/core/styles'
import {connect,useDispatch} from 'react-redux'
import {Link} from 'react-router-dom'
import RegisterForm from '../RegisterForm';
import LoginForm from '../LoginForm';
import {logOut} from '../../store/reducers/user.reducer'

HeaderTop.propTypes = {
    
};
const useStyles=makeStyles(theme=>({
    listItems:{
        width:'auto',
        lineHeight:'22px',
        padding:0,
    },
    link:{
        color: theme.palette.success.dark,
        textDecoration: 'none',
    },
    modal:{
        display:'flex',
        justifyContent:'center',
        alignItems:'center',
    },
}))

function HeaderTop(props) {
    const {user}=props
    const dispatch=useDispatch()
    const [login,setLogin]=useState(false)
    const [register,setRegister]=useState(false)
    function handleToggleLoginForm(){
        setRegister(false)
        setLogin(!login)
    }
    function handleToggleRegister(){
        setLogin(false)
        setRegister(!register)
    }
    // Close Modal when have user
    useEffect(()=>{
        setLogin(false)
        setRegister(false)
    },[user.name])
    // Logout
    function handleLogout(){
        dispatch(logOut())
    }
    const classes=useStyles()
    return (
        <Hidden xsDown>
            <Grid container spacing={0}>
                <Grid item xs={6}>
                    <List disablePadding={true} >
                        <Box display='flex' justifyContent='flex-start' fontSize={12} color='green'>
                          <ListItem className={classes.listItems}>
                              <Link className={classes.link} to="/">Giới thiệu</Link>
                          </ListItem>
                          <Box display='flex' justifyContent='center' paddingLeft={2} paddingRight={2} alignContent='center'>|</Box>
                          <ListItem className={classes.listItems}>
                              <Link className={classes.link} to="">Lịch sử giao dịch</Link>
                          </ListItem>
                          <Box display='flex' justifyContent='center' paddingLeft={2} paddingRight={2} alignContent='center'>|</Box>
                          <ListItem className={classes.listItems}>
                              <Link className={classes.link} to="">Tra cứu đơn hàng</Link>
                          </ListItem>
                        </Box>
                    </List>
                </Grid>
                <Grid item xs={6} >
                    <Box display='flex' justifyContent='flex-end'>
                        <List disablePadding={true} >
                            <Box display='flex' justifyContent='flex-start' fontSize={12} color='green'>
                              <ListItem className={classes.listItems}>
                                  <Link 
                                    className={classes.link} 
                                    to={user.name ? '/user': '/register'}
                                    onClick={user.name? null: handleToggleRegister}
                                  >
                                      {user.name|| 'Đăng ký'}
                                  </Link>
                              </ListItem>
                              <Box display='flex' justifyContent='center' paddingLeft={2} paddingRight={2} alignContent='center'>|</Box>
                              <ListItem className={classes.listItems}>
                                  <Link 
                                    className={classes.link} 
                                    to={user.name ? '/': '/login'}
                                    onClick={user.name? handleLogout: handleToggleLoginForm}
                                  >
                                      {user.name ? 'Thoát': 'Đăng nhập'}
                                  </Link>
                              </ListItem>
                            </Box>
                        </List>
                    </Box>
                </Grid>
            </Grid>
            <Modal
              open={register}
              onClose={handleToggleRegister}
              className={classes.modal}
              disableAutoFocus={true}
              disableEnforceFocus={true}
            >
                <Box 
                  display='flex' justifyContent='center'
                  alignItems='center' bgcolor='white' 
                  height={500} pl={4} pr={4}
                  borderRadius={4}
                >
                    <RegisterForm/>
                </Box>
            </Modal>
            <Modal
              open={login}
              onClose={handleToggleLoginForm}
              className={classes.modal}
              disableAutoFocus={true}
              disableEnforceFocus={true}
            >
                <Box 
                  display='flex' justifyContent='center'
                  alignItems='center' bgcolor='white' 
                  height={500} pl={4} pr={4}
                  borderRadius={4}
                >
                    <LoginForm/>
                </Box>
            </Modal>
        </Hidden>
    );
}

const mapStateToProps=state=>({
    user: state.user,
})

export default connect(mapStateToProps,null)(HeaderTop)