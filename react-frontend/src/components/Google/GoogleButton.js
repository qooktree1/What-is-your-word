// GoogleButton.js

// import React from 'react';
// import GoogleLogin from 'react-google-login';

// const clientId = "157138898765-4qga3391tbfafpd56v6pi0bksnc6q1hv.apps.googleusercontent.com"

// export default function GoogleButton({ onSocial }){
//     const onSuccess = async(response) => {
//     	console.log(response);
    
//         const { googleId, profileObj : { email, name } } = response;
        
//         await onSocial({
//             socialId : googleId,
//             socialType : 'google',
//             email,
//             nickname : name
//         });
//     }

//     const onFailure = (error) => {
//         console.log(error);
//     }

//     return(
//         <div>
//             <GoogleLogin
//                 clientId={clientId}
//                 responseType={"id_token"}
//                 onSuccess={onSuccess}
//                 onFailure={onFailure}/>
//         </div>
//     )
// }