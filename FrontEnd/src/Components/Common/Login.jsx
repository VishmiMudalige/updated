import React, {useState, useContext, useEffect} from 'react'
import {makeStyles} from '@material-ui/core/styles'
import { Avatar, Button, Checkbox, Container, CssBaseline, FormControlLabel, Grid, Paper, TextField, Typography } from '@material-ui/core'
import LockOutlinedIcon from '@material-ui/icons/LockOutlined';
import { Link } from 'react-router-dom';
import Layout from '../Common/Layout'
import { AuthContext } from '../../util/Auth'
import './style.css'
import jwt_decode from 'jwt-decode'
import { LoginContext } from '../../context/loginContext';

const useStyles = makeStyles((theme) => ({
    paper: {
        marginTop: theme.spacing(8),
        display: 'flex',
        alignItems: 'center',
        flexDirection: 'column'
    },
    avatar: {
        margin: theme.spacing(1),
        backgroundColor: 'black',
      },
      form: {
        width: '100%', // Fix IE 11 issue.
        marginTop: theme.spacing(1),
      },
      submit: {
        margin: theme.spacing(3, 0, 2),
        background: 'black',
        color: 'white',
        '&:hover': {
            color: 'black'
        }
      },
      link: {
          textDecoration: 'none',
          color: 'black',
          '&:hover': {
              textDecoration: 'underline'
          }
      }
}))

const Login = (props) => {

    const [currentUser, setCurrentUser] = useContext(AuthContext);
    const [islLoggedIn, setIslLoggedIn] = useContext(LoginContext)

    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')

    const [loading, setLoading] = useState(false)

    const validateEmail = () => {
        if(email=='') {
            let emailErr = document.getElementById("errEmail")
            emailErr.classList.remove('hide')
            emailErr.innerHTML = "Please Enter Email"
            setTimeout(() => {
                emailErr.classList.add('hide')
            },2000)
            return false
        }else if(!/^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/.test(email)) {
            let emailErr = document.getElementById("errEmail")
            emailErr.classList.remove('hide')
            emailErr.innerHTML = "Please Enter Valid Email"
            setTimeout(() => {
                emailErr.classList.add('hide')
            },2000)
            return false
        }else {
            return true
        }
    }

    const validatePassword = () => {
        if(password=='') {
            let emailErr = document.getElementById("errPassword")
            emailErr.classList.remove('hide')
            emailErr.innerHTML = "Please Enter Password"
            setTimeout(() => {
                emailErr.classList.add('hide')
            },2000)
            return false
        }else {
            return true
        }
    }
    
    const validateInputs = () => {
        let isEmailValid = validateEmail()
        let isPasswordValid = validatePassword()
        return (isEmailValid&&isPasswordValid)
    }

    const handleLogin = (e) => {
        e.preventDefault()
        setLoading(true)
        if(validateInputs()) {
          let loginData = {
              email: email,
              password: password
          }
          postLogin(loginData).then((res) => {
            localStorage.setItem("token", res)
            localStorage.setItem("userId", decodeToken(res)._id)
            setLoading(false)
            setIslLoggedIn({
                status: true,
                role: decodeToken(res).role,
                id: decodeToken(res)._id
            })
            props.history.push('/')
          }).catch((err) => {
              console.log(err)
              setLoading(false)
              let emailErr = document.getElementById("errCommon")
              emailErr.classList.remove('hide')
              emailErr.innerHTML = `${err}`
              setTimeout(() => {
                emailErr.classList.add('hide')
              },2000)
          })
        }else {
            setLoading(false)
        }
    }

    const postLogin = (loginData) => {
        return new Promise((resolve,reject) => {
            fetch('https://salty-savannah-48438.herokuapp.com/api/auth/login', {
                headers: {
                    'Content-Type': 'application/json',
                },
                method: 'POST',
                body: JSON.stringify(loginData)
            }).then(res=> {
                return res.json()
            }).then(res=> {
                console.log(res)
                if(res.token!==undefined) {
                    resolve(res.token)
                }else {
                    reject(res.details)
                }
            }).catch(err=> {
                //console.log(err)
                reject(err)
            })
        })
    }

    const decodeToken = (token) => {
        return jwt_decode(token)
    }

    const classes = useStyles()

    return (
        <Layout>        
            <Container maxWidth="xs">
            <CssBaseline />
            <div className={classes.paper}>
                <Avatar className={classes.avatar}>
                    <LockOutlinedIcon />
                </Avatar>
                <Typography component="h1" variant="h5">
                    Sign In
                </Typography>
                <p className="err hide" id="errCommon"></p>
                <form className={classes.form}>
                    <TextField
                        variant="outlined"
                        type="email"
                        margin="normal"
                        required
                        fullWidth
                        label="Email"
                        id="email"
                        name="email"
                        autoComplete="email"
                        autoFocus
                        onChange={(e) => {setEmail(e.target.value)}}
                    />
                    <p className="err hide" id="errEmail"></p>
                    <TextField
                        variant="outlined"
                        type="password"
                        margin="normal"
                        required
                        fullWidth
                        label="Password"
                        id="password"
                        name="password"
                        autoComplete="password"
                        autoFocus
                        onChange={(e) => {setPassword(e.target.value)}}
                    />
                    <p className="err hide" id="errPassword"></p>
                    {/* <FormControlLabel control={<Checkbox value="remember" color="primary"/>}
                     label="Remember Me" /> */}
                     <Button 
                        type="submit"
                        fullWidth
                        variant="contained"
                        className={classes.submit}
                        onClick={handleLogin}
                     >
                         {loading ? (<>Loading...</>) : (<>Sign In</>)}
                     </Button>
                     <Grid container>
                        <Grid item xs>
                            <Link className={classes.link} href="#">Forgot Password</Link>
                        </Grid>
                        <Grid item>
                            <Link className={classes.link} to="/register">Don't have account? Sign Up Now</Link>
                        </Grid>
                     </Grid>
                </form>
            </div>
        </Container>
        </Layout>

    )
}

export default Login
