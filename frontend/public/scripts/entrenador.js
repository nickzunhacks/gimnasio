// Funcion para almacenar todos los resultados dentro del cuadrado amarillo para mostrar en pantalla

function resultadosBuscador(resultados) {

    const resultadosContainer = document.getElementById("resultados-contenedor");
    const plantilla = document.getElementById("plantilla-resultados");

    const clon = plantilla.content.cloneNode(true);
    
    const boton = clon.querySelector("#boton-resultado");

  // Asigna el texto correcto
    boton.textContent = `${resultados.codigo} - ${resultados.nombre}`;
    boton.name = resultados.codigo;

    boton.addEventListener("click", () => {

        window.location.href = `/rutina_semanal?codigo=${resultados.codigo}`;

    });

    resultadosContainer.appendChild(clon);

}

/*  obtiene los resultados de la busqueda despues ser activador el boton de buscar y 
    los muestra en pantalla
 */

async function resultadosBusqueda(event) {
    
    event.preventDefault();

// Obtiene el contenedor y lo vacia para que no salgan los resultados anteriores

    const resultadosContainer = document.getElementById("resultados-contenedor");
    resultadosContainer.innerHTML = "";

// Del formulario se extrae el codigo que se inserta en el buscador y se almacena en "busqueda"

    const formulario = document.querySelector(".formulario-buscador");
    const busqueda = formulario.elements[0].value;
    const cantidad = Number(document.querySelector('#cantidad').value);

// Se apunta a los titulos de algoritmos para eventualmente editar el text content y poner su tiempo
    const mergesort = document.querySelector('#MergeSort');
    const sort = document.querySelector('#SortJavaScript');
    const quicksort = document.querySelector('#QuickSort');

    mergesort.textContent = "MergeSort: ";
    sort.textContent = "SortJavaScript: ";
    quicksort.textContent = "QuickSort: ";

    let tiempoStart = 0;
    let tiempoEnd = 0;

    var tiempoMergeSort;
    var tiempoSort;
    var tiempoQuickSort;

    try{

        const response = await fetch(`/crearUsuarios?busqueda=${busqueda}&cantidad=${cantidad}`, {

            method: "GET",
            headers: {'Content-Type': 'application/json'},

        });

        const resultados = await response.json();

        const listaDeportistas = resultados.resultados;

        //medimos tiempo antes y despues, se resta el despues - antes y con esto sabemos cuando se tarda cada algoritmo

        // MergeSort

        tiempoStart = performance.now();
        const mergeSortArreglo = mergeSort(listaDeportistas, "codigo");
        tiempoEnd = performance.now();
        tiempoMergeSort = tiempoEnd - tiempoStart;
        console.log("tiempo de MergeSort: ",tiempoMergeSort.toFixed(3));

        // funcion nativa de javaScipt

        tiempoStart = performance.now();
        const sortArreglo = listaDeportistas.sort( (a, b) => parseInt(a.codigo,10) - parseInt(b.codigo,10) )
        tiempoEnd = performance.now();
        tiempoSort = tiempoEnd - tiempoStart;
        console.log("tiempo de funcion nativa de javaScript: ", tiempoSort.toFixed(3));

        sortArreglo.forEach(resultadosBuscador);


        // QuickSort

        tiempoStart = performance.now();
        const quickSortArreglo = QuickSort(listaDeportistas, "codigo");
        tiempoEnd = performance.now();
        tiempoQuickSort = tiempoEnd - tiempoStart;
        console.log("tiempo QuickSort: ", tiempoQuickSort.toFixed(3));

        mergesort.textContent += `${tiempoMergeSort.toFixed(5)} milisegundos`;
        sort.textContent += `${tiempoSort.toFixed(5)} milisegundos`;
        quicksort.textContent += `${tiempoQuickSort.toFixed(5)} milisegundos`;

    } catch(err){

        console.log("error en crear los deporstistas ficticios: ",err.message);
        quicksort.textContent += `NaN`;
        mergesort.textContent += `${tiempoMergeSort.toFixed(5)} milisegundos`;
        sort.textContent += `${tiempoSort.toFixed(5)} milisegundos`;


    }

}

function mergeSort(arr, key) {

    if(arr.length <= 1) return arr;

    const mid = Math.floor(arr.length / 2);
    const left = mergeSort(arr.slice(0,mid), key);
    const right = mergeSort(arr.slice(mid), key);

    return merge(left, right, key);

} function merge(left, right, key) {

    const result = [];
    let i = 0, j = 0;

    while(i < left.length && j < right.length) {

        if( parseInt(left[i][key], 10) <= parseInt(right[j][key],10) ) {
            result.push(left[i]);
            i++
        } else {
            result.push(right[j]);
            j++;
        }

    }

    return result.concat(left.slice(i)).concat(right.slice(j));

}

function QuickSort(arr, key) {

    if (arr.length <= 1) return arr;

    const pivot = arr[arr.length-1];
    const left = [];
    const right = [];

    for(let i = 0; i < arr.length-1; i++) {

        if ( parseInt(arr[i][key],10) <= parseInt(pivot[key],10) ) {
            left.push(arr[i])
        } else {
            right.push(arr[i]);
        }

    }

    return [...QuickSort(left,key), pivot, ...QuickSort(right,key)]

}

document.addEventListener('DOMContentLoaded', () => {

    const formulario = document.querySelector(".formulario-buscador");   
    formulario.addEventListener('submit', resultadosBusqueda);

    const salir = document.querySelector('#salir');

    salir.addEventListener("click", () => {
        window.location.href = '/login';
    });

});