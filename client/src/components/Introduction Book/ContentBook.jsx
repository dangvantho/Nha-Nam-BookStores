import { Box, Grid,TextField } from '@material-ui/core';
import useStyles from './styleContentBook'
import React, { useEffect, useState } from 'react';
import {connect, useDispatch} from 'react-redux'
import {updateCart} from '../../store/reducers/user.reducer'
import {updateCartSession} from '../../store/reducers/sessionUser.reducer'
import SameCategoryBooks from '../SameCategoryBooks/SameCategoryBooks'
import buyButton from '../../assets/images/buynow.png'
import addToCart from '../../assets/images/addtocart.png'
import Comment from '../Comments/Comment';
import Store from '../Store/Store';

function ContentBook(props) {
    const {book,user,session}=props
    let userCart = user.name ? user.cart : session.cart
    const dispatch=useDispatch()
    const [count,setCount]=useState(1)
    const [openStore,setOpenStore]=useState(false)
    const [notify,setNotify]=useState(false)
    let price=book.money
    price=Math.ceil((price.split(',')[0]-0)*0.8)+',000'
    function handleSubtractCount(){
        if(count>1) setCount(count-1) 
    }
    function handleAddToCart(){
        let data
        setNotify(true)
        setTimeout(() => {
            setNotify(false)
        }, 2000);
        if(user.name){
            userCart= userCart.filter(value=>value.idBook!==book._id)
            data={
                user: user.name,
                cart: [...userCart, 
                    {
                        idBook: book._id, 
                        count: count-0,
                        createAt: new Date(),
                        bookName: book.title,
                        price,
                    }]
            }
            dispatch(updateCart(data))
        } else {
            let cart=session.cart
            cart= cart.filter(value=>value.idBook!==book._id)
            data={
                sessionId: session.sessionId,
                cart: [...cart, 
                    {
                        idBook: book._id, 
                        count: count-0,
                        createAt: new Date(),
                        bookName: book.title,
                        price,
                    }]
            }
            dispatch(updateCartSession(data))
        }
    }
    useEffect(()=>{
        let currentBookInCart= userCart.find(value=>value.idBook===book._id)
        console.log(userCart,currentBookInCart)
        if(currentBookInCart) setCount(currentBookInCart.count)
        else setCount(1)
    },[book,session.cart,user.cart])
    const classes=useStyles()
    return (
        <Grid container spacing={0} justify='center'>
            <Grid item xs={9} sm={4} className={classes.boxTop}>
                <img className={classes.imgBook} src={'data:image/png;base64,'+book.image}/>
            </Grid>
            <Grid item xs={12} sm={8} className={classes.inforMain} >
                {/* Information about book */}
                <p className={classes.title}>{book.title}</p>
                <Grid container spacing={0}  >
                    <Grid item xs={12} sm={6}  >
                        <ul className={classes.infor}>
                            <li className={classes.peaceOfBook}>M?? s???n ph???m: <span>{book._id}</span></li>
                            <li className={classes.peaceOfBook}>T??c gi???: <span>{book.author}</span></li>
                            <li className={classes.peaceOfBook}>Nh?? xu???t b???n: <span>{book.publishCompany}</span></li>
                            <li className={classes.peaceOfBook}>S??? trang: <span>{book.pages}</span></li>
                            <li className={classes.peaceOfBook}>K??ch th?????c: <span>{book.size}</span></li>
                            <li className={classes.peaceOfBook}>N??m ph??t h??nh: <span>{book.time}</span></li>
                        </ul>
                    </Grid>
                    {/* Buy book ??? add to cart */}
                    <Grid item xs={12} sm={6} className={classes.buyBook}>
                        {/* Price */}
                        <div className={classes.oldPrice}> 
                           Gi?? b??a: <span>{book.money}??</span> 
                        </div>
                        {/* Sale of price */}
                        <div className={classes.salePrice}>Gi?? Nh?? Nam: <span>{price}??</span> (???? t??nh VAT)</div>
                        {/* count */}
                        <Box display='flex' fontSize='14px' color='#444' paddingTop='27px' alignItems='center' >
                            <Box  paddingRight='13px'>S??? L?????NG: </Box>
                            <Box display='flex'>
                                <Box onClick={handleSubtractCount} style={count==1 ? {cursor:'no-drop'} : {}}
                                   className={`${classes.countBtn} ${classes.countInput}`} >-</Box>
                                <Box className={classes.countInput}>{count}</Box>
                                <Box onClick={()=>setCount(count+1)} 
                                   className={`${classes.countBtn} ${classes.countInput}`}>+</Box>
                            </Box>
                        </Box>
                        {/* Buy */}
                        <Box padding='20px 0'  >
                            <img className={classes.imageButton} onClick={handleAddToCart} src={addToCart} alt="Buy now"/>
                            <img className={classes.imageButton} onClick={()=>setOpenStore(!openStore)} src={buyButton} alt="Buy now"/>
                        </Box>
                    </Grid>
                </Grid>
            </Grid>
            <Box paddingTop='18px' fontSize='24px' fontStyle='italic' color='#0f5731' >
                Gi???i thi???u s??ch
            </Box>
            <pre className={classes.intro}>{book.intro}</pre>
            {/* Th??m l???a ch???n s??ch */}
            <Grid item xs={12}>
                {/* Find book by category */}
               <SameCategoryBooks 
                  filter={{type: book.type}} title='S??ch c??ng th??? lo???i' type='type'
                  className={classes.sameKindOfBook} hiddenBook={book._id} />

               <SameCategoryBooks 
                  filter={{author: book.author}} title='S??ch c??ng t??c gi???' type='author'
                  className={classes.sameKindOfBook}  />

            </Grid>
            <Grid item xs={12}>
                <Comment idBook={book._id}/>
            </Grid>
            <Store open={openStore} onClose={()=>setOpenStore(!openStore)} />
            {/* Add amination when add to cart */}
            {notify && (
                <div className={classes.addToCart}>Th??m s??ch v??o gi??? h??ng th??nh c??ng</div>
            )}
        </Grid>
    );
}
const mapStateToProps=state=>({
    session: state.session,
    user: state.user,
})

export default connect(mapStateToProps,null)(ContentBook)