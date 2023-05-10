import React, { useState } from "react";
import './index.css'
import WelcomePage from "./Components/WelcomePage";


function App() {
  const [userIsSignedIn, setUserIsSignedIn] = useState(false)

  return (
    <div className="app min-h-screen bg-yellow-50 flex justify-center items-center">
      {userIsSignedIn 
      ?
        null
      :
      <WelcomePage /> 
      }
    </div>
  );
}

export default App;
