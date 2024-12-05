/**
 * Este script implementa un sistema de reconocimiento de voz usando la API Web SpeechRecognition.
 * Proporciona funcionalidades como iniciar, detener, cambiar el idioma y reiniciar automáticamente
 * cuando se detecta una pausa en el habla.
 */

// Verifica si el navegador soporta la API de reconocimiento de voz
const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;

if (!SpeechRecognition) {
  alert('Tu navegador no soporta Speech Recognition.');
} else {
  // Inicialización de variables
  const recognition = new SpeechRecognition(); // Instancia de SpeechRecognition
  const transcriptElement = document.getElementById('transcript'); // Área de texto donde se mostrará el texto capturado
  const startBtn = document.getElementById('startBtn'); // Botón para iniciar el reconocimiento
  const stopBtn = document.getElementById('stopBtn'); // Botón para detener el reconocimiento
  const statusElement = document.getElementById('status'); // Elemento para mostrar el estado actual
  const languageSelector = document.getElementById('languageSelector'); // Selector de idioma

  let isListening = false; // Indica si el reconocimiento está activo
  let accumulatedText = ''; // Almacena el texto acumulado

  // Configuración inicial del reconocimiento
  recognition.continuous = false; // No escucha de manera continua, se reinicia manualmente después de una pausa
  recognition.interimResults = false; // Solo muestra resultados finales, no intermedios
  recognition.lang = languageSelector.value; // Idioma inicial basado en la selección

  /**
   * Evento: `onresult`
   * Se dispara cada vez que el sistema reconoce una parte del habla.
   * Captura el texto detectado y lo acumula.
   */
  recognition.onresult = (event) => {
    const transcript = event.results[0][0].transcript.trim(); // Texto reconocido
    accumulatedText += ` ${transcript}`; // Acumula el texto reconocido
    transcriptElement.value = accumulatedText; // Muestra el texto en el área de texto
    console.log('Texto capturado:', transcript);
  };

  /**
   * Evento: `onend`
   * Se dispara cuando el reconocimiento de voz se detiene.
   * Esto puede ocurrir automáticamente después de una pausa en el habla.
   * Si `isListening` es verdadero, el reconocimiento se reinicia automáticamente.
   */
  recognition.onend = () => {
    console.log('Reconocimiento de voz detenido.');
    if (isListening) {
      statusElement.textContent = 'Estado: Reiniciando...'; // Actualiza el estado en pantalla
      console.log('Reiniciando el reconocimiento...');
      recognition.start(); // Reinicia el reconocimiento automáticamente
      statusElement.textContent = 'Estado: Escuchando...'; // Estado actualizado
    } else {
      statusElement.textContent = 'Estado: Detenido.'; // Indica que el reconocimiento fue detenido manualmente
    }
  };

  /**
   * Evento: `onerror`
   * Se dispara si ocurre un error durante el reconocimiento.
   * Los errores comunes incluyen falta de permisos para usar el micrófono o errores en el servicio.
   */
  recognition.onerror = (event) => {
    console.error('Error en reconocimiento de voz:', event.error);
    statusElement.textContent = `Error: ${event.error}`; // Muestra el error en pantalla
  };

  /**
   * Función: Iniciar el reconocimiento
   * Comienza a escuchar y procesar el habla.
   * Cambia el idioma dinámicamente según el selector antes de iniciar.
   */
  startBtn.addEventListener('click', () => {
    if (!isListening) {
      accumulatedText = transcriptElement.value; // Conserva el texto acumulado
      recognition.lang = languageSelector.value; // Cambia el idioma al seleccionado
      recognition.start(); // Inicia el reconocimiento
      isListening = true; // Actualiza el estado de escucha
      statusElement.textContent = 'Estado: Escuchando...'; // Muestra el estado en pantalla
      console.log('Reconocimiento de voz iniciado en idioma:', recognition.lang);
    }
  });

  /**
   * Función: Detener el reconocimiento
   * Finaliza la sesión de reconocimiento y detiene el reinicio automático.
   */
  stopBtn.addEventListener('click', () => {
    if (isListening) {
      recognition.stop(); // Detiene el reconocimiento
      isListening = false; // Actualiza el estado de escucha
      statusElement.textContent = 'Estado: Detenido.'; // Actualiza el estado en pantalla
      console.log('Reconocimiento de voz detenido manualmente.');
    }
  });
}
