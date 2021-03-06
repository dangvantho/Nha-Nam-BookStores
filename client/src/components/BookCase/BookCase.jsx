import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import {connect, useDispatch} from 'react-redux'
import {Link} from 'react-router-dom'
import {makeStyles} from '@material-ui/core/styles'
import useStyles from './StyleBookCase'
import {Box,Button,Paper} from '@material-ui/core'
// import loading from '../../assets/images/loading.gif'
import loading2 from '../../assets/images/spiner.gif'
import {fetchBook} from '../../store/reducers/book.reducer'
import {updateCart} from '../../store/reducers/user.reducer'
import {updateCartSession} from '../../store/reducers/sessionUser.reducer'
import Store from '../Store/Store';

BookCase.propTypes = {
    
};


function BookCase(props) {
    const classes=useStyles()
    const {books,type,user,session} = props
    const [openStore,setOpenStore]=useState(false)
    const [notify,setNotify]=useState(false)
    let listBooks=books.type[type.type]
    const dispatch=useDispatch()
    useEffect(()=>{
        if(books.type[type.type].length==0){
            dispatch(fetchBook({...type}))
        }
        // dispatch(fetchImageBook({list: listBooks, type: type.type}))
    },[type])
    // Tranform data image to string image
    function transformDataToImage(book){
        let image= book.image
        let str=loading2
        if(image) str='data:image/png;base64,'+image
        return str
    }
    // Add to cart
    function handleAddToCart(book){
        window.scrollTo({
            top:0,
            left:0,
            behavior:'smooth',
        })
        setNotify(true)
        setTimeout(()=>setNotify(false),3000)
        let cart= user.name ? user.cart : session.cart
        cart= cart.filter(value=>value.idBook!==book._id)
        let data
        if(user.name){
            data={
                user: user.name,
                cart: [...cart, 
                    {
                        idBook: book._id, 
                        count: 1,
                        createAt: new Date(),
                        bookName: book.title,
                        price: changePrice(book.money),
                    }]
            }
            dispatch(updateCart(data))
        } else {
            data={
                sessionId: session.sessionId,
                cart: [...cart, 
                    {
                        idBook: book._id, 
                        count: 1,
                        createAt: new Date(),
                        bookName: book.title,
                        price: changePrice(book.money),
                    }]
            }
            dispatch(updateCartSession(data))
        }
    }
    function changePrice(price){
        price=price.split(',')[0]-0
        return Math.ceil(price*0.8)+',000'
    }
    // Toggle store
    return (
        <React.Fragment>
            <div className={classes.pageTitle}>
                <Link to={`/the-loai/${type.link}`} className={classes.link} >
                    <div className={classes.imageTitle}>{type.title}</div>
                </Link>
            </div>
            <div className={classes.root}>
              <ul className={classes.bookList}>
                  {listBooks? listBooks.map(book=>(
                      <li className={classes.listItem} key={book._id}>
                            <Link to={`/book/${book._id}`} className={classes.book}>
                                <img src={transformDataToImage(book)} className={classes.imgBook} alt=""/>
                                
                            </Link>
                            <div className={classes.boxInfor}>
                                   <Box className={classes.headerBoxInfor}>
                                       {book.title}
                                   </Box>
                                   <ul className={classes.bookInfor}>
                                       <li>S??? trang: {book.pages}</li>
                                       <li>K??ch th?????c: {book.size} cm</li>
                                       <li>N??m ph??t h??nh: {book.time}</li>
                                   </ul>
                                   <span className={classes.bookPrice} >{changePrice(book.money)}??</span>
                                   <Box textAlign='center' marginBottom={1.5}>
                                      <Button variant='contained' onClick={()=>handleAddToCart(book)}
                                        className={classes.btn} >Th??m v??o gi??? h??ng</Button>
                                      <Button variant='contained' onClick={()=>setOpenStore(!openStore)}
                                        className={classes.btn}>Mua h??ng</Button>
                                   </Box>
                                </div>
                      </li>
                  )) 
                  : <img src={loading2} className={classes.imgBook} />
                }
                </ul>
            </div>   
            {notify && (
                <div className={classes.notify}>
                    B???n ???? th??m s???n ph???m v??o gi??? h??ng
                </div>
            )} 
            <Store open={openStore} onClose={()=>setOpenStore(!openStore)} />
        </React.Fragment>
        
    );
}
const mapStateToProps=state=>({
    books: state.books,
    user: state.user,
    session: state.session,
})
export default connect(mapStateToProps,null)(BookCase)