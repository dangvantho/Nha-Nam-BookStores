import React, { useState } from 'react';
import PropTypes from 'prop-types';
import {connect,useDispatch} from 'react-redux'
import {updateCart} from '../../store/reducers/user.reducer'
import {updateCartSession} from '../../store/reducers/sessionUser.reducer'
import { Box } from '@material-ui/core';
import useStyles from './styleItemCart'
import {Link} from 'react-router-dom'

ItemCart.propTypes = {
    
};


function ItemCart(props) {
    const classes=useStyles()
    let {book,user,session,onClose,books}=props
    let image
    if(books.book._id===book.idBook){
        image=books.book.image
    } else {
        let tam=[]
        for(let key in books.type){
            tam=tam.concat(books.type[key])
        }
        image= tam.find(value=>value._id===book.idBook).image
    }
    const [count,setCount]=useState(book.count)
    const handleSubstractCount=()=>{
        if(count<1) {
            console.log(count)
            handleAddToCart(1)
            setCount(1)
        }
        else {
            setCount(count-1) 
            handleAddToCart(count-1)
        }
    }
    const handleAddCount=()=>{
        setCount(count+1)
        handleAddToCart(count+1)
    }
    const dispatch=useDispatch()
    function handleAddToCart(count){
        let data
        let cart
        if(user.name){
            cart= user.cart.filter(value=>value.idBook!==book.idBook)
            data={
                user: user.name,
                cart: [...cart, 
                    {
                        idBook: book.idBook, 
                        count: count,
                        updateAt: new Date(),
                        bookName: book.name,
                        price: book.price,
                        bookName: book.bookName,
                        createAt: book.createAt,
                    }]
            }
            dispatch(updateCart(data))
        } else {
            cart= session.cart.filter(value=>value.idBook!==book.idBook)
            data={
                sessionId: session.sessionId,
                cart: [...cart, 
                    {
                        idBook: book.idBook, 
                        count: count,
                        updateAt: new Date(),
                        bookName: book.name,
                        price: book.price,
                        createAt: book.createAt,
                        bookName: book.bookName,
                    }]
            }
            dispatch(updateCartSession(data))
        }
    }
    function handleDeleteBookFromCart(){
        let cart= user.name? user.cart : session.cart
        cart= cart.filter(value=>value.idBook!==book.idBook)
        if(user.name) dispatch(updateCart({ user: user.name, cart}))
        else dispatch(updateCartSession({sessionId: session.sessionId, cart}))
    }
    function changePrice(book){
        let price= book.price.split(',')[0]-0
        return price*(book.count-0)+',000'
    }
    return (
        <div className={classes.root}>
            {/* Image book */}
            <img src={`data:image/png;base64,`+image} className={classes.imgBook}/>
            {/* Content item */}
            <Box flexGrow={1} >
                <Box display='flex' flexGrow={1} paddingBottom={1}>
                    <div className={classes.bookName}>{book.bookName}</div>
                    <Box className={classes.btnHiddenSmall}>
                      <button className={classes.btn} disabled={count==1}
                        onClick={handleSubstractCount}>-</button>
                      <span className={classes.count}>{count}</span>
                      <button className={classes.btn} 
                        onClick={handleAddCount}>+</button>
                    </Box>
                    <div className={classes.price}>{changePrice(book)}đ</div>
                </Box>
                <Box display='flex' justifyContent='space-between'>
                    <Box className={classes.btnHiddenLarge}>
                      <button className={classes.btn} disabled={count==1}
                        onClick={handleSubstractCount}>-</button>
                      <span className={classes.count}>{count}</span>
                      <button className={classes.btn} 
                        onClick={handleAddCount}>+</button>
                    </Box>
                    <div className={classes.deleteCart} onClick={handleDeleteBookFromCart}>Xóa</div>
                    
                </Box>
            </Box>
        </div>
    );
}
const mapStateToProps= state=>({
    user: state.user,
    session: state.session,
    books: state.books

})
export default connect(mapStateToProps,null)(ItemCart)