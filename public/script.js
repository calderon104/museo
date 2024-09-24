//CONSTANTES
const $locali = document.getElementById("localizacion");
const $palabraClave = document.getElementById("palabraClave");
const $depto = document.getElementById("departamentos");
const $galeria = document.getElementById("galeria");
const $formulario = document.getElementById("formulario");
const $flechas = document.getElementById("paginacion");
const $prevButton = document.getElementById("prevPage");
const $nextButton = document.getElementById("nextPage");
const url = "https://collectionapi.metmuseum.org/public/collection/v1/";

// paginacion
let totalIds = [];
let currentPage = 1;
const pageSize = 20;

document.addEventListener("DOMContentLoaded", () => {
  cargarDepartamentos();
});

$formulario.addEventListener("submit", (event) => {
  event.preventDefault();
  $galeria.innerHTML = "";
  const palabra = $palabraClave.value;
  const ubi = $locali.value;
  const depto = $depto.value;
  const objFinal = {};

  if (palabra) objFinal.palabra = palabra;
  if (ubi) objFinal.ubi = ubi;
  if (depto) objFinal.depto = depto;

  cargarURL(objFinal);
   $flechas.style.display = "block"; // MOstrar flechas de paginación
});


function cargarURL({ palabra = "", ubi, depto }) {
  const params = new URLSearchParams();
  params.append("q", palabra || "");
  if (ubi) params.append("geoLocation", ubi);
  if (depto) params.append("departmentId", depto);
  const urlFinal = `${url}search?${params.toString()}`;
  obtenerObras(urlFinal);
}

function obtenerObras(urlFinal) {
  fetch(urlFinal)
    .then((res) => res.json())
    .then((data) => {
      totalIds = data.objectIDs || [];
      currentPage = 1;
      mostrarPagina();
      actualizarBotones();
    })
    .catch((error) => {
      console.error("Error al obtener las obras:", error);
    });
}

function mostrarPagina() {
  $galeria.innerHTML = "";
  const startIndex = (currentPage - 1) * pageSize;
  const endIndex = startIndex + pageSize;

  const pageIds = totalIds.slice(startIndex, endIndex);

  pageIds.forEach((id) => {
    fetch(url + `objects/${id}`)
      .then((res) => res.json())
      .then((obra) => {
        crearCard(obra);
      })
      .catch((error) => {
        console.error("Error al obtener el objeto:", error);
      });
  });
}

$prevButton.addEventListener("click", () => {
  if (currentPage > 1) {
    currentPage--;
    mostrarPagina();
    actualizarBotones();
  }
});

$nextButton.addEventListener("click", () => {
  if (currentPage * pageSize < totalIds.length) {
    currentPage++;
    mostrarPagina();
    actualizarBotones();
  }
});

function actualizarBotones() {
  $prevButton.disabled = currentPage === 1;
  $nextButton.disabled = currentPage * pageSize >= totalIds.length;
}

function cargarDepartamentos() {
  fetch(url + "departments")
    .then((res) => res.json())
    .then((data) => {
      $depto.innerHTML = "";
      const placeholder = document.createElement("option");
      placeholder.setAttribute("value", "0");
      placeholder.value = "";
      placeholder.textContent = "Selecciona un departamento";
      $depto.appendChild(placeholder);
      data.departments.forEach((departamento) => {
        const opcion = document.createElement("option");
        opcion.value = departamento.departmentId;
        opcion.textContent = departamento.displayName;
        $depto.appendChild(opcion);
      });
    })
    .catch((error) => {
      console.error("Error al obtener departamentos:", error);
    });
}

function crearCard(obj) {
  const card = document.createElement("div");
  const img = document.createElement("img");
  const tittle = document.createElement("h3");
  const dinastia = document.createElement("p");
  const cultura = document.createElement("p");
  const anio = document.createElement("p");

  card.setAttribute("class", "card");
  img.setAttribute("class", "foto");
  img.setAttribute("src", obj.primaryImage || "./no.imagen.png");

  anio.textContent ="Fecha: "+ obj.objectDate || "Sin año.";
  anio.style.display = "none";

  // Añadir los elementos a la tarjeta
  card.appendChild(img);
  card.appendChild(tittle);
  card.appendChild(dinastia);
  card.appendChild(cultura);
  card.appendChild(anio);

  // Mostrar año al pasar el ratón sobre la imagen
  img.addEventListener("mouseover", () => {
    anio.style.display = "block";
  });

  img.addEventListener("mouseout", () => {
    anio.style.display = "none";
  });

  // Verificar si hay imágenes adicionales
  if (obj.additionalImages && obj.additionalImages.length > 0) {
    const btnVerMas = document.createElement("button");
    btnVerMas.setAttribute("class", "btnVerMas");
    btnVerMas.textContent = "Ver imágenes adicionales";

    btnVerMas.onclick = () => {
      mostrarImgAdicionales(obj.additionalImages);
    };

    card.appendChild(btnVerMas);
  }

  // Llamar a la función de traducción y actualizar los textos
  traducirObjeto(
    obj.title,
    obj.culture || "Sin cultura.",
    obj.dynasty || "Sin dinastía.",
    "es"
  )
    .then((traduccion) => {
      tittle.textContent = traduccion.tituloTraducido || obj.title;
      cultura.textContent = traduccion.culturaTraducida || "Sin cultura.";
      dinastia.textContent = traduccion.dinastiaTraducida || "Sin dinastía.";
    })
    .catch((error) => {
      console.error("Error al traducir el objeto:", error);
    });

  $galeria.appendChild(card);
}

function mostrarImgAdicionales(imagenes) {
  const modal = document.getElementById("modal");
  const additionalImagesContainer = document.getElementById(
    "additionalImagesContainer"
  );
  additionalImagesContainer.innerHTML = "";

  imagenes.forEach((url) => {
    const img = document.createElement("img");
    img.setAttribute("src", url);
    additionalImagesContainer.appendChild(img);
  });
  modal.style.display = "block";
}

// Listener para cerrar modal
document.getElementById("cerrarModal").onclick = function () {
  const modal = document.getElementById("modal");
  modal.style.display = "none";
};

window.onclick = function (event) {
  const modal = document.getElementById("modal");
  if (event.target === modal) {
    modal.style.display = "none";
  }
};

function traducirObjeto(titulo, cultura, dinastia, idioma) {
  const url = `/traducir?titulo=${encodeURIComponent(
    titulo
  )}&cultura=${encodeURIComponent(cultura)}&dinastia=${encodeURIComponent(
    dinastia
  )}&idioma=${encodeURIComponent(idioma)}`;

  return fetch(url)
    .then((result) => result.json())
    .then((data) => {
      return data;
    })
    .catch((error) => console.error("ERROR EN LA TRADUCCION: " + error));
}
