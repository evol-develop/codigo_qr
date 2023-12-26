import React, { useEffect, useState, useCallback } from "react";
import { Html5QrcodeScanner } from "html5-qrcode";
import axios from "axios";
import { useNavigate } from "@reach/router"; 

function Scanner() {
  const [boleto, setBoleto] = useState(" ");
  const [atraccion, setAtraccion] = useState("");
  const [codigo, setCodigo] = useState("");
  const [atraccionValida,setAtraccionValida]= useState(null);

  const handleSuccess = useCallback(
    (result) => {

      var resultado = result;


      if (resultado === localStorage.getItem('codigo')) {

      }else{

      if (resultado.startsWith("A") && resultado.length === 4) {

        axios
          .get(`https://api-scanner1.azurewebsites.net/api/scanner/GetAtraccionByCodigo/${resultado}`)
          //.get(`https://localhost:44327/api/scanner/GetAtraccionByCodigo/${resultado}`)
          .then((respuesta) => {
          //  console.log(respuesta.data);
          //  console.log(resultado);
            if (respuesta.data) {

              console.log(respuesta.data);
              let atraccionLocal = respuesta.data.replace(/\s/g, "");
             
              localStorage.setItem('codigo_atraccion', resultado);
              localStorage.setItem('atraccion', atraccionLocal); // Guarda la atracción en localStorage
             
              setAtraccion(atraccionLocal);
              setAtraccionValida(true);

              setTimeout(() => {
                setAtraccionValida(null);
                window.location.reload();
              }, 1000);


            } else {

              localStorage.removeItem('codigo_atraccion');
              localStorage.removeItem('atraccion'); // Elimina la atracción de localStorage
              setAtraccionValida(false);

              setTimeout(() => {
                setAtraccionValida(null);
              }, 2000);

            }
          })
          .catch((error) => {
            console.error("", error);
          });

      } else {
        
        let codigo_atraccion = localStorage.getItem('codigo_atraccion');
        console.log(codigo_atraccion);
          if (codigo_atraccion) {

            
          axios
             .get(`https://api-scanner1.azurewebsites.net/api/scanner/ValidarQR/${resultado}`)
            //.get(`https://localhost:44327/api/scanner/ValidarQR/${resultado}`)
            .then((respuesta) => {
              if (respuesta.data) {
                console.log(respuesta.data);

                localStorage.setItem('codigo', resultado);

                let user = localStorage.getItem("user");

                setBoleto('QR VÁLIDO');
                setTimeout(() => {
                    setBoleto(" ");
                    }, 2000);

                axios
                .get(`https://api-scanner1.azurewebsites.net/api/scanner/RegistrarIngreso/${resultado}/${codigo_atraccion}/${user}`)
                   //  .get(`https://localhost:44327/api/scanner/RegistrarIngreso/${resultado}/${codigo_atraccion}/${user}`)
                  .then((respuesta) => {
                    console.log(respuesta);

                    if(respuesta.data){
                     
                        
                    }
                    else{

                        
                    }
                   
                  })
                  .catch((error) => {
                    console.error("", error);
                  });

              } else {
                setBoleto("QR INVÁLIDO");
              }


             
            })
            .catch((error) => {
              console.error("", error);
            });

        } else {
          console.log('NO ATRACCION');
          setBoleto("NOT ATRACCION");
          setTimeout(() => {
            setBoleto(" ");
          }, 5000);

        }
      }

     }

    },
    [atraccion, codigo]
  );

  const[isValid,setIsValid] = (useState(false));
  const[color,setColor] = (useState(''));



  useEffect(() => {

    const Scanner = new Html5QrcodeScanner("reader", {
      qrbox: {
        width: 250,
        height: 250,
      },
      fps: 10,
    });

 /*   if( boleto === "NOT ATRACCION"){
    setIsValid(false);
    setColor('red');
   }
   else 

    if(boleto === "QR VÁLIDO" ) {
      setIsValid(true);
      setColor('green');
  } else {
      setIsValid(false);
      setColor('red');
  } */

   

/*   
   atraccionValida === null ? setColor('') : setColor('red');
 */
   
   console.log(color);

    const readerElement = document.getElementById("reader");
    if (readerElement) {
      Scanner.render(handleSuccess, (error) => console.error("", error));
    }

    return () => {
     // Scanner.clear();
    };
    
  }, [handleSuccess]);

  return (
   
    <div className="App" style={{backgroundColor: boleto === " " ? ("white"):(  boleto === "QR VÁLIDO" ?("green"):("red") )}}>
   
    {/*  <h4 style={{ display: 'inline-block',marginTop:'-10px' }}  > {atraccion != ''? (<b>{atraccion}</b>):(<></>)} </h4>
 */}
      

      {boleto !== "NOT ATRACCION" && (
        
          <h6 style={{ color: "white",fontSize:"20px" }}>{boleto}</h6>
      )}

      {boleto === "NOT ATRACCION" && (
          
          <h6 style={{ color: "white",fontSize:"20px" }}>No hay ninguna atracción seleccionada</h6>
      )}

      <div id="reader" style={{ width: "100%", height: "100%" }}></div>

      {/* {atraccionValida ? (<h4 style={{ color: "white" ,textAlign:'center'}}>{'Atracción asignada'}</h4>):(<></>)} */}

    </div>

    
  );
}

export default Scanner;