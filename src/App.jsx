import styled from "@emotion/styled";
import ImagenCripto from "./img/imagen-criptos.png";
import { Formulario } from "./components/Formulario";
import { Spinner } from "./components/Spinner";
import { useState, useEffect } from "react";
import { Resultados } from "./components/Resultados";

const Contenedor = styled.div`
  max-width: 900px;
  margin: 0 auto;
  width: 90%;
  text-align: center;
`;

const Heading = styled.h1`
  font-family: "Lato", sans-serif;
  color: #fff;
  font-weight: 700;
  font-size: 34px;
  margin-top: 20px;
`;

const Imagen = styled.img`
  max-width: 400px;
  width: 80%;
  margin: 20px auto;
`;

function App() {
  const [monedas, setMonedas] = useState({});
  const [resultado, setResultado] = useState({});
  const [cargando, setCargando] = useState(false);

  useEffect(() => {
    const cotizarCripto = async () => {
      setCargando(true)
      setResultado({})
      if (!monedas.moneda || !monedas.criptoMoneda) {
        console.error(
          "Error: Moneda o criptomoneda no definidas. Moneda:",
          monedas.moneda,
          "Criptomoneda:",
          monedas.criptoMoneda
        );
        return;
      }

      const { moneda, criptoMoneda } = monedas;
      const url = `https://min-api.cryptocompare.com/data/pricemultifull?fsyms=${criptoMoneda}&tsyms=${moneda}`;

      try {
        const respuesta = await fetch(url);
        const resultado = await respuesta.json();

        console.log("Respuesta de la API:", resultado);

        if (
          resultado.DISPLAY &&
          resultado.DISPLAY[criptoMoneda] &&
          resultado.DISPLAY[criptoMoneda][moneda]
        ) {
          setResultado(resultado.DISPLAY[criptoMoneda][moneda]);
          setCargando(false)
        } else {
          console.error(
            "Error: Propiedades no encontradas en la respuesta de la API."
          );
        }
      } catch (error) {
        console.error("Error al obtener datos:", error);
      }
    };

    if (monedas.moneda && monedas.criptoMoneda) {
      cotizarCripto();
    }
  }, [monedas]);

  return (
    <Contenedor>
      <Heading>Cotiza Criptomonedas al Instante</Heading>
      <Imagen src={ImagenCripto} alt="Imagenes Criptomonedas" />
      <Formulario setMonedas={setMonedas} />
      {cargando && <Spinner />}
      {resultado.PRICE && <Resultados resultado={resultado} />}
    </Contenedor>
  );
}

export default App;
