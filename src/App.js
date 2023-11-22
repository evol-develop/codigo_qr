import logo from './logo.svg';
import './App.css';
import {useEffect, useState } from 'react';
import {Html5QrcodeScanner} from 'html5-qrcode';
import axios, { AxiosResponse } from 'axios';

const Scanner = new Html5QrcodeScanner("reader",{
  qrbox: {
    width: 250,
    height: 250
  },
  fps: 10,
});


function App() {

  const [scanResult, setScanResult] = useState('');

  useEffect(() => {
  
    function sucess(result) {
      Scanner.clear();

      var resultado = result;

      axios
      .get(`https://localhost:44327/api/scanner/ValidarQR/${resultado}`)
      .then((respuesta) => {

         if (respuesta.status === 200) {
      
          setScanResult('QR VALIDO');
  
        } else {
          setScanResult('ESTE QR ES INVALIDO');
        } 
      }).catch((error) => {
        console.error('', error);
      });
    };
  
    function error(result) {
     
    };
  
    Scanner.render(sucess,error);

  }, []);

  return (
    <div className="App">
      SAC CONTROL DE ACCESO
      {
        scanResult
        ? <div> {scanResult} </div>
        : <div id="reader" style={{width: '20%', height: '20%'}}></div>
      }
    </div>
  );
}

export default App;
