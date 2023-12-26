import React, { useEffect, useState, useCallback } from "react";
import axios from "axios";
import Scanner from "./Scanner";
import '@fortawesome/fontawesome-free/css/all.min.css'; 
import 'bootstrap-css-only/css/bootstrap.min.css'; 
import 'mdbreact/dist/css/mdb.css';
import logotipo from './logo.jpeg';
import '@fortawesome/fontawesome-free/css/all.min.css';

function App() {
 
  const [email, setEmail] = useState("");
  const [pass, setPass] = useState("");
 // const [isValid, setIsValid] = useState(false);

 
  const handleSubmit = (e) => {
    e.preventDefault();

    axios
    .get(`https://api-scanner1.azurewebsites.net/api/scanner/ValidarUsuario/${email}/${pass}`)
    //.get(`https://localhost:44327/api/scanner/ValidarUsuario/${email}/${pass}`)
    .then((respuesta) => {
     // console.log(respuesta);

      if(respuesta.data != "NOT"){
        
        localStorage.setItem("user", respuesta.data);
        localStorage.setItem("usuario_logeado", 'true');
        //setIsValid(true);
        setUsuario_logeado('true');
      }
      else{

        //setIsValid(false);
        //localStorage.setItem("usuario_logeado", false);
        setUsuario_logeado(false);
      }
     
    })
    .catch((error) => {
      console.error("", error);
      //setIsValid(false);
     
      setUsuario_logeado(false);
    });


  };
 
  const [atraccion, setAtraccion] = useState(" ");
  const [usuario_logeado, setUsuario_logeado] = useState('false');

  useEffect(() => {

    console.log(localStorage.getItem('usuario_logeado'));
    console.log(localStorage.getItem('atraccion'));



    localStorage.getItem('usuario_logeado') === 'true' ? setUsuario_logeado('true') : setUsuario_logeado('false');
    setAtraccion(localStorage.getItem('atraccion'));

   
  
  }, []);


   return (
    <div className="App">
     <div style={{  position: "fixed", 
        top: 0, 
        width: "100%", 
        textAlign: "center", 
        backgroundColor: "#b0c4de", 
        lineHeight: '60px' }}>
        {
          usuario_logeado ==='true' ? (
            
            
              <i className="fas fa-sign-out-alt" style={{color:'red',float: "right",padding:'20px'}} onClick={() => { localStorage.clear(); setAtraccion('');  localStorage.setItem("usuario_logeado", 'false');  setUsuario_logeado('false');}}></i>
        
          ) : (<></>)
        }
          <h4 style={{ display: 'inline-block', margin: 0 }}> {usuario_logeado === 'false'? (<b>SAC CONTROL DE ACCESO</b>):(<>{atraccion}</>)} </h4>
      </div>
      <br></br>

      <br></br>
      <br></br>
     
      {usuario_logeado ==='true' ?(<Scanner/>):(<>
     
      <div className="container w-100" style={{ 
        display: 'flex', 
        flexDirection: 'column', 
        justifyContent: 'center', 
        height: '80vh'  }} >
          <img src={logotipo} style={{width:'50vh',height:'20vh',margin:'auto'}}/>
          <h3 style={{ textAlign: "center" }}>Iniciar sesión</h3>
          <form onSubmit={handleSubmit} style={{backgroundColor: "#b0c4de",padding:'30px'}} >
            <div className="form-group">
              <label >Correo</label>
              <input type="email" className="form-control" id="exampleInputEmail1" aria-describedby="emailHelp"  onChange={(e) => setEmail(e.target.value)}/>
            
            </div>
            <div className="form-group">
              <label >Contraseña</label>
              <input type="password" className="form-control" id="password"  onChange={(e) => setPass(e.target.value)}/>
            </div>
          
            <button type="submit" className="btn btn-primary">Iniciar sesión</button>
          </form>
      </div>
      
    </>
    )}
    </div>
  );
}

export default App;