class Ahorcado {
    constructor() {
        this.palabras = ["JAVASCRIPT", "PROGRAMACION", "JUEGO", "AHORCADO", "DESARROLLO", "CODIGO","GATO","PERRO","ASADO","MANO","COMANDO"];//pongo un array con palabras
        this.intentosRestantes = 6;
        this.letraCorrecta = [];
        this.letraIncorrecta = [];
        this.palabra = this.getPalabraAleatoria(); // Selecciona una palabra aleatoria del array
        this.displayPalabra(); 
        this.updateIntentos();
    }
    // genero una palabra aleatoria del array
    getPalabraAleatoria() {
        const randomIndex = Math.floor(Math.random() * this.palabras.length);
        return this.palabras[randomIndex];
    }
    
    displayPalabra() {
        const display = this.palabra
            .split('')
            .map(letra => (this.letraCorrecta.includes(letra) ? letra : '_'))
            .join(' ');
        document.getElementById('palabra-display').textContent = display;
    }
  
    updateIntentos() {//actualizo los intentos que quedan 
        document.getElementById('intentos').textContent = this.intentosRestantes;
        this.updatePersonaAhorcada();
    }

    checkletra(letra) {
        if (this.letraCorrecta.includes(letra) || this.letraIncorrecta.includes(letra)) {
            document.getElementById('message').textContent = "Ya has probado esa letra.";
            return;
        }
// verifico con un if si la letra esta en la palabra, si esta en la palabra saldra un mensaje diciendo correcto.
        if (this.palabra.includes(letra)) {
            this.letraCorrecta.push(letra);
            document.getElementById('message').textContent = "¡Correcto!";
            this.displayPalabra();
            this.checkGanar();
        } else { //de lo contrario si la letra no esta en la palabra te resto un intento, 
            this.letraIncorrecta.push(letra);
            this.intentosRestantes--; //te resto un intento.
            document.getElementById('message').textContent = "Incorrecto."; //lanzo un mensage diciendo que esa letra es incorrecta.
            this.updateIntentos(); //actualizo los intentos llamando a la funcion updateIntentos.
            this.checkPerder(); //llamo a la funcion checkPerder.
        }
    }

    checkGanar() {//verifico que la palabra este correcta completamente y si esta termina el juego.
        if (this.palabra.split('').every(letra => this.letraCorrecta.includes(letra))) {
            document.getElementById('message').textContent = "¡Ganaste!";
        }
    }

    checkPerder() {//verifico si quedan intentos y si los intentos es menor,igual a 0 automaticamente salta el texto de q perdiste 
        if (this.intentosRestantes <= 0) {
            document.getElementById('message').textContent = `Perdiste. La palabra era: ${this.palabra}`;
        }
    }

    updatePersonaAhorcada() {
        const AhorcadoStages = [
            '',
            'O',
            'O\n|',
            'O\n/|',
            'O\n/|\\',
            'O\n/|\\\n/',
            'O\n/|\\\n/ \\'
        ];
        document.getElementById('PersonAhorcado').textContent = AhorcadoStages[6 - this.intentosRestantes];
    }
}

const game = new Ahorcado();

function checkletra() {
    const letraInput = document.getElementById('letra-input');
    const letra = letraInput.value.toUpperCase();
    letraInput.value = '';
    if (letra && letra.length === 1) {
        game.checkletra(letra);
    } else {
        document.getElementById('message').textContent = "Por favor, ingresa una sola letra.";
    }
}

async function saveScore(tiempo, puntos, nombre) {
    const fecha = new Date().toISOString();
    try {
        const response = await fetch('http://localhost/ahorcado_api/insert_score.php', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ tiempo, puntos, fecha, nombre })
        });
        const result = await response.json();
        console.log(result.message);
    } catch (error) {
        console.error('Error al guardar el puntaje:', error);
    }
}
async function showScoreTable() {
    try {
        const response = await fetch('http://localhost/ahorcado_api/get_scores.php');
        const scores = await response.json();
        const scoreTable = document.getElementById('score-table');
        scoreTable.innerHTML = '';
        scores.forEach(score => {
            const row = `<tr>
                <td>${score.nombre}</td>
                <td>${score.puntos}</td>
                <td>${score.tiempo}</td>
                <td>${new Date(score.fecha).toLocaleString()}</td>
            </tr>`;
            scoreTable.innerHTML += row;
        });
    } catch (error) {
        console.error('Error al obtener la tabla de posiciones:', error);
    }
}
