import { atom } from 'recoil';

const LOGGEDIN = atom({
  key: 'loggedIn', // unique key to identify the atom
  default: false // the default value for the atom
});

const TOKEN = atom({
    key: 'token',
    default : localStorage.getItem("token") ? localStorage.getItem("token") : null
})

const USERDETAILS = atom({
    key : 'userDetails',
    default : {
      firstName : "John" , 
      lastName : "Doe"
    }
})

export {
  TOKEN , USERDETAILS , LOGGEDIN
}