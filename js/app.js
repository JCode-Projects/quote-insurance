// Constructores
function Seguro(marca, year, tipo) {
    this.marca = marca;
    this.year = year;
    this.tipo = tipo;
}
/* Calcula el valor del seguro */
Seguro.prototype.cotizarSeguro = function() {
    /* 
        1 = Americano 1.15 
        2 = Asiatico 1.05 
        3 = Europeo 1.35 
    */
    let cantidad;
    const base = 2000;

    switch(this.marca) {
        case "1":
            cantidad = base * 1.15;
            break;
        case "2":
            cantidad = base * 1.05;
            break;
        case "3":
            cantidad = base * 1.35;
            break;
        default:
            break
    }

    // Leer el año
    const diferencia = new Date().getFullYear() - parseInt(this.year);
    
    cantidad -= ((diferencia * 3) * cantidad) / 100;

    /*  
        basico += 30%
        completo += 50%
    */
    if(this.tipo == "basico") {
        cantidad += 1.30;
    } else {
        cantidad += 1.50;
    }

    return cantidad;
}

function UI() {}
/* Llenar las opciones de los años */
UI.prototype.llenarOpciones = function() {
    const max = new Date().getFullYear();
    const min = max - 20;
    const yearSelect = document.querySelector("#year");

    for(let i = max; i > min; i--) {
        const yearOption = document.createElement("option");
        yearOption.value = i;
        yearOption.textContent = i;

        yearSelect.appendChild(yearOption);
    }
}
/* Muestra alertas en pantalla */
UI.prototype.mostrarMensaje = function(mensaje, tipo) {
    const div = document.createElement('div');
    
    tipo === "error" ? div.classList.add("error") : div.classList.add("correcto");

    div.classList.add("mensaje", "mt-10");

    div.textContent = mensaje;

    if(!document.querySelector(".mensaje")) {
        const formulario = document.querySelector("#cotizar-seguro");
        formulario.insertBefore(div, document.querySelector("#resultado"));

        setTimeout(() => {
            div.remove();
        }, 3000);
    }
}
/* Muestra la cotización */
UI.prototype.mostrarResultado = function(seguro, total) {
    const div = document.createElement("div");
    const { marca, year, tipo } = seguro;
    let textoMarca;
    switch(marca) {
        case "1":
            textoMarca = "Americano";
            break;
        case "2":
            textoMarca = "Asiatico";
            break;
        case "3":
            textoMarca = "Europeo";
            break;
        default:
            break;
    }

    div.classList.add("mt-10");
    div.innerHTML = `
        <p class="header">Tu resumen:</p>
        <p class="font-bold">Marca: <span class="font-normal">${textoMarca}</span></p>
        <p class="font-bold">Año: <span class="font-normal">${year}</span></p>
        <p class="font-bold">Tipo: <span class="font-normal capitalize">${tipo}</span></p>
        <p class="font-bold">Total: <span class="font-normal">$${total}</span></p>
    `;

    const spinner = document.querySelector("#cargando");
    spinner.style.display = "block";
    
    setTimeout(() => {
        spinner.style.display = "none";
        const resumenDiv = document.querySelector("#resultado");
        resumenDiv.appendChild(div);
    }, 3000);
}

// Instanciar UI
const UserInterface = new UI();

document.addEventListener("DOMContentLoaded", () => {
    UserInterface.llenarOpciones();
});

// Inicializar eventos
eventListeners();
function eventListeners() {
    const formulario = document.querySelector("#cotizar-seguro");
    formulario.addEventListener("submit", cotizarSeguro);
}

function cotizarSeguro(e) {
    e.preventDefault();

    // Leer marca seleccionada
    const marca = document.querySelector("#marca").value;

    // Leer año seleccionado
    const year = document.querySelector("#year").value;

    // Leer el tipo seleccionado
    const tipo = document.querySelector("input[name='tipo']:checked").value;

    if(marca === "" || year === "" || tipo === "") {
        UserInterface.mostrarMensaje("Todos los campos son obligatorios.", "error");
        return;
    }

    UserInterface.mostrarMensaje("Cotizando...", "exito");

    const resultadosPrevios = document.querySelector("#resultado div");
    if(resultadosPrevios) {
        resultadosPrevios.remove();
    }

    // Instanciar el seguro
    const seguro = new Seguro(marca, year, tipo);
    const total = seguro.cotizarSeguro();

    // Mostrar la cotización
    UserInterface.mostrarResultado(seguro, total);
}