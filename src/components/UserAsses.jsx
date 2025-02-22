// import React, { useState } from 'react';

// function UserAccess() {
//   const [isSignup, setIsSignup] = useState(false);

//   return (
//     <div style={styles.appContainer}>
//       {isSignup ? (
//         <NewUserSignup onBack={() => setIsSignup(false)} />
//       ) : (
//         <Login onSignup={() => setIsSignup(true)} />
//       )}
//     </div>
//   );
// }

// // Login Component
// function Login({ onSignup }) {
//   const [userType, setUserType] = useState('');
//   const [userId, setUserId] = useState('');
//   const [password, setPassword] = useState('');
//   const [captchaInput, setCaptchaInput] = useState('');
//   const [captcha, setCaptcha] = useState(generateCaptcha());

//   const userTypes = [
//     "INSTITUTE ADMIN",
//     "INSTITUTE EXAMINER",
//     "INSTITUTE CHIEF EXAMINER",
//     "INSTITUTE USER",
//     "STUDENT",
//     "PORTAL ADMIN"
//   ];

//   function generateCaptcha() {
//     return Math.floor(1000 + Math.random() * 9000).toString();
//   }

//   const handleSubmit = (e) => {
//     e.preventDefault();
//     if (captchaInput !== captcha) {
//       alert('Incorrect Captcha');
//       setCaptcha(generateCaptcha());
//       setCaptchaInput('');
//       return;
//     }
//     alert(`Logging in as ${userType}`);
//   };

//   return (
//     <div style={styles.formContainer}>
//       <h2 style={styles.header}>Login</h2>
//       <form onSubmit={handleSubmit} style={styles.form}>
//         <label style={styles.label}>User Type</label>
//         <select
//           style={styles.input}
//           value={userType}
//           onChange={(e) => setUserType(e.target.value)}
//           required
//         >
//           <option value="">Select User Type</option>
//           {userTypes.map((type) => (
//             <option key={type} value={type}>
//               {type}
//             </option>
//           ))}
//         </select>
        
//         <label style={styles.label}>User ID*</label>
//         <input
//           type="text"
//           style={styles.input}
//           value={userId}
//           onChange={(e) => setUserId(e.target.value)}
//           required
//         />

//         <label style={styles.label}>Password</label>
//         <input
//           type="password"
//           style={styles.input}
//           value={password}
//           onChange={(e) => setPassword(e.target.value)}
//           required
//         />

//         <label style={styles.label}>Captcha: {captcha}</label>
//         <input
//           type="text"
//           style={styles.input}
//           value={captchaInput}
//           onChange={(e) => setCaptchaInput(e.target.value)}
//           required
//         />

//         <button type="submit" style={styles.submitButton}>Submit</button>
//         <button type="button" onClick={() => alert('Forgot Password clicked')} style={styles.linkButton}>Forgot Password</button>
//         <button type="button" onClick={onSignup} style={styles.linkButton}>New User Signup</button>
//       </form>
//     </div>
//   );
// }

// // NewUserSignup Component
// function NewUserSignup({ onBack }) {
//   const [userType, setUserType] = useState('');
//   const [captchaInput, setCaptchaInput] = useState('');
//   const [captcha, setCaptcha] = useState(generateCaptcha());

//   const userTypes = [
//     "INSTITUTE ADMIN",
//     "INSTITUTE EXAMINER",
//     "INSTITUTE CHIEF EXAMINER",
//     "INSTITUTE USER",
//     "STUDENT",
//     "PORTAL ADMIN"
//   ];

//   function generateCaptcha() {
//     return Math.floor(1000 + Math.random() * 9000).toString();
//   }

//   const handleSubmit = (e) => {
//     e.preventDefault();
//     if (captchaInput !== captcha) {
//       alert('Incorrect Captcha');
//       setCaptcha(generateCaptcha());
//       setCaptchaInput('');
//       return;
//     }
//     alert(`User account created as ${userType}`);
//   };

//   return (
//     <div style={styles.formContainer}>
      
//       <h2 style={styles.header}>New User Signup</h2>
//       <form onSubmit={handleSubmit} style={styles.form}>
//         <label style={styles.label}>Institute ID</label>
//         <input type="text" style={styles.input} required />

//         <label style={styles.label}>Institute Name</label>
//         <input type="text" style={styles.input} required />

//         <label style={styles.label}>Subscribed Module ID</label>
//         <input type="text" style={styles.input} required />

//         <label style={styles.label}>Module Name</label>
//         <input type="text" style={styles.input} required />

//         <label style={styles.label}>User Type</label>
//         <select
//           style={styles.input}
//           value={userType}
//           onChange={(e) => setUserType(e.target.value)}
//           required
//         >
//           <option value="">Select User Type</option>
//           {userTypes.map((type) => (
//             <option key={type} value={type}>
//               {type}
//             </option>
//           ))}
//         </select>

        
//         <label style={styles.label}>First Name</label>
//         <input type="text" style={styles.input} required />

//         <label style={styles.label}>Last Name</label>
//         <input type="text" style={styles.input} required />

//         <label style={styles.label}>DOB</label>
//         <input type="date" style={styles.input} required />
//         </form>
        

//         <form onSubmit={handleSubmit} style={styles.form}>

//         <label style={styles.label}>Email ID</label>
//         <input type="email" style={styles.input} required />

//         <label style={styles.label}>Mobile Number</label>
//         <input type="tel" style={styles.input} required />

//         <label style={styles.label}>Password</label>
//         <input type="password" style={styles.input} required />

//         <label style={styles.label}>Confirm Password</label>
//         <input type="password" style={styles.input} required />

//         <label style={styles.label}>Password Hint Question</label>
//         <input type="text" style={styles.input} required />

//         <label style={styles.label}>Password Hint Answer</label>
//         <input type="text" style={styles.input} required />

//         <label style={styles.label}>Captcha: {captcha}</label>
//         <input
//           type="text"
//           style={styles.input}
//           value={captchaInput}
//           onChange={(e) => setCaptchaInput(e.target.value)}
//           required
//         />

//         <button type="submit" style={styles.submitButton}>Submit</button>
//         <button type="button" onClick={onBack} style={styles.linkButton}>Back to Login</button>
//       </form>
//     </div>
//   );
// }

// // Styles
// const styles = {
//   appContainer: {
//     display: 'flex',
//     justifyContent: 'center',
//     alignItems: 'center',
//     minHeight: '100vh',
//     backgroundColor: '#f3f4f6',
//   },
//   formContainer: {
//     width: '400px',
//     padding: '20px',
//     borderRadius: '10px',
//     boxShadow: '0px 8px 16px rgba(0, 0, 0, 0.2)',
//     backgroundColor: '#fff',
//   },
//   header: {
//     textAlign: 'center',
//     fontSize: '1.5em',
//     color: '#333',
//     marginBottom: '20px',
//   },
//   form: {
//     display: 'flex',
//     flexDirection: 'column',
//   },
//   label: {
//     marginBottom: '5px',
//     color: '#333',
//     fontWeight: 'bold',
//   },
//   input: {
//     padding: '10px',
//     marginBottom: '15px',
//     borderRadius: '5px',
//     border: '1px solid #ddd',
//   },
//   submitButton: {
//     padding: '10px',
//     marginTop: '10px',
//     backgroundColor: '#28a745',
//     color: '#fff',
//     borderRadius: '5px',
//     border: 'none',
//     cursor: 'pointer',
//   },
//   linkButton: {
//     padding: '10px',
//     marginTop: '10px',
//     color: '#007bff',
//     backgroundColor: 'transparent',
//     border: 'none',
//     cursor: 'pointer',
//     textAlign: 'center',
//   },
// };

// export default UserAccess;
