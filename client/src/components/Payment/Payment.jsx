import { Box, FormControlLabel, makeStyles, Modal, Radio, RadioGroup, Tab, Tabs, TextField } from '@material-ui/core';
import React, { useEffect, useRef, useState } from 'react';
import {fetchAddress,postAddress,sessionAddress} from '../../store/reducers/address.reducer'
import {resetCartSession} from '../../store/reducers/sessionUser.reducer'
import {resetCart} from '../../store/reducers/user.reducer'
import {postHistory} from '../../store/reducers/history.reducer'
import {connect, useDispatch} from 'react-redux'
import ContactMailIcon from '@material-ui/icons/ContactMail';
import { Link } from 'react-router-dom';


const useStyles= makeStyles(theme=>({
    root:{
        display:'flex',
        justifyContent:'center',
        overflowY:'auto',
        overflowX:'hidden',
        paddingTop: 40,
    },
    header:{
      border:'5px solid rgba(255,255,255,.24) ',
      borderRadius:5,
      position: 'absolute',
      left: '50%',
      transform: 'translateX(-50%)',
      [theme.breakpoints.up('sm')]:{
          width: '600px'
      },
      [theme.breakpoints.down('sm')]:{
          width:'90%',
      }
    },
    tab:{
      flexGrow:'1',
    },
    textField:{
        marginTop: 20,
    },
    inputSubmit:{
      marginTop: 25,
      border:'none',
      marginLeft:'auto',
      padding: '8px 20px',
      borderRadius: 6,
      background: '#1da1f2',
      color: '#fff',
      cursor:'pointer',
      fontSize: 16,
    },
    inputFinal:{
      marginTop: 25,
      border:'none',
      padding: '8px 20px',
      borderRadius: 6,
      background: '#1da1f2',
      color: '#fff',
      cursor:'pointer',
    },
}))
function TabPanel(props) {
    const { children, value, index, ...other } = props;
  
    return (
      <div
        role="TabPanel"
        hidden={value !== index}
        {...other}
      >
        {value === index && (
          <Box p={3}>
            {children}
          </Box>
        )}
      </div>
    );
  }
function Payment(props) {
    const classes= useStyles()
    const dispatch= useDispatch()
    const {open,onClose,address,user,startStep,session}=props
    const [formAddress,setFormAddress]=useState('new')
    const form_1= useRef()
    const [typePayment,setTypePayment]=useState('direct payment')
    const [step,setStep]=useState(startStep)
    function handleSubmit(e){
      e.preventDefault()
      const {name, phone, address}=e.target
      let data={
        name: name.value,
        phone: phone.value,
        address: address.value,
      }
      if(user.name) {
        data.user=user.name
        dispatch(postAddress(data))
      }else{
        dispatch(sessionAddress(data))
      }
      setStep(1)
      e.target.reset()
    }
    function handlePayment(){
      let data={
        user: user.name ,
        paymentBy: typePayment,
        sessionId: session.sessionId,
        name: address.name,
      }
      if(user.name) data.cart=user.cart
      else data.cart= session.cart
      dispatch(postHistory(data))
      dispatch(resetCart())
      dispatch(resetCartSession())
      onClose()
    }
    useEffect(()=>{
      setStep(0)
    },[])
    return (
        <Modal 
          disableAutoFocus={true}
          disableEnforceFocus={true}
          open={open} onClose={onClose} className={classes.root} >
            <Box className={classes.header}>
                {/* Header */}
                <Box display='flex' justifyContent='space-between' 
                    padding='10px 20px' bgcolor='#1da1f2' color='#fff' >
                    <Box>?????t h??ng</Box>
                    <Box color='#f5101a' style={{cursor: 'pointer'}}
                      onClick={onClose}
                    >x</Box>
                </Box>
                <Box bgcolor='#fff'>
                    {/* Step */}
                    <Tabs 
                      value={step} onChange={(e,newValue)=>setStep(newValue)}
                      indicatorColor="primary"
                      textColor="primary"
                    >
                        <Tab icon={<ContactMailIcon/>} label='B?????c 1' className={classes.tab} />
                        <Tab icon={<ContactMailIcon/>} label='B?????c 2' className={classes.tab}/>
                        <Tab icon={<ContactMailIcon/>} label='B?????c 3' className={classes.tab}/>
                    </Tabs>
                    {/* Body */}
                    <TabPanel value={step} index={0}>
                        <Box>
                            <RadioGroup value={formAddress} onChange={(e)=>setFormAddress(e.target.value)}>
                              {address && address.name && (
                                <FormControlLabel value={'old'} label="S??? d???ng ?????a ch??? c??"
                                control={<Radio color='primary'/>}/>
                              )}
                              <FormControlLabel value={'new'} 
                                label={address && address.name ? 'S??? d???ng ?????a ch??? m???i': 'Nh???p ?????a ch??? m???i'} 
                                control={<Radio color='primary'/>}/>
                            </RadioGroup>
                        </Box>
                        {formAddress==='new' ? (
                          <form ref={form_1} onSubmit={handleSubmit}>
                              <TextField className={classes.textField}  variant='outlined' required
                                label='T??n' name='name' fullWidth  />
                              <TextField className={classes.textField}  variant='outlined' required
                                label='S??? ??i???n tho???i' name='phone' fullWidth  />
                              <TextField className={classes.textField}  variant='outlined' required
                                label='?????a ch???: ' name='address'  fullWidth />
                              <Box display='flex' marginTop='30px' borderTop='1px solid #ccc'>
                                <input className={classes.inputSubmit} type="submit" value='Ti???p theo'/>  
                              </Box>  
                          </form>
                        ) : (
                          <React.Fragment>
                            <div>{address.name}</div>
                            <div>{address.phone}</div>
                            <div>{address.address}</div>
                            <Box display='flex' marginTop='30px' borderTop='1px solid #ccc'>
                              <div className={classes.inputSubmit} onClick={()=>setStep(1)} >
                                 Ti???p theo
                              </div>  
                            </Box>  
                          </React.Fragment>
                        )
                        }
                    </TabPanel>
                    <TabPanel value={step} index={1}>
                        <RadioGroup value={typePayment} onChange={(e,newValue)=>setTypePayment(newValue)}>
                          <FormControlLabel
                            value='credit card'
                            label='Thanh to??n b???ng th???'
                            control={<Radio color='primary'/>}
                          />
                          <FormControlLabel
                            value='direct payment'
                            label='Thanh to??n tr???c ti???p'
                            control={<Radio color='primary'/>}
                          />
                        </RadioGroup>
                        <Box display='flex' justifyContent='space-between' 
                            marginTop='30px' borderTop='1px solid #ccc'>
                          <div className={classes.inputFinal} onClick={()=>setStep(0)} >
                             Quay l???i
                          </div>      
                          <div className={classes.inputFinal} onClick={()=>setStep(2)} >
                             Ti???p theo
                          </div>  
                        </Box>
                    </TabPanel>
                    <TabPanel value={step} index={2}>
                      <Box>
                        <div>{address ? address.name:''}</div>
                        <div>{address.phone}</div>
                        <div>{address.address}</div>
                        <div>
                          {typePayment=='direct payment' ? 
                              'Ph????ng th???c thanh to??n: Thanh to??n khi giao h??ng ':
                              'Ph????ng th???c thanh to??n: Thanh to??n b???ng th???'
                          }
                        </div>
                      </Box>
                      <Box display='flex' justifyContent='space-between' 
                          marginTop='30px' borderTop='1px solid #ccc'>
                        <div className={classes.inputFinal} onClick={()=>setStep(1)} >
                           Quay l???i
                        </div>      
                        <div className={classes.inputFinal} onClick={handlePayment } >
                           Ho??n th??nh
                        </div>  
                      </Box>
                    </TabPanel>
                </Box>
                
            </Box>
        </Modal>
    );
}

const mapStateToProps= state=>({
    address: state.address,
    user: state.user,
    session: state.session
})
export default connect(mapStateToProps,null)(Payment)