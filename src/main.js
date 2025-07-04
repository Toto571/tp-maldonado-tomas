const container = document.getElementById("dog-container");
const searchInput = document.getElementById("search");
const groupFilter = document.getElementById("breed-group-filter");
const sortSelect = document.getElementById("sort-order");
let allDogs = [];

async function obtenerPerros() {
  try {
    const res = await fetch("https://api.thedogapi.com/v1/breeds");
    const data = await res.json();
    allDogs = data;
    cargarOpcionesDeGrupo(data);
    renderDogs(data);
  } catch (error) {
    container.innerHTML = `<p class="error">Ocurrió un error al cargar los datos. 🐶</p>`;
    console.error("Error al obtener razas:", error);
  }
}

function cargarOpcionesDeGrupo(dogs) {
  const gruposUnicos = [
    ...new Set(dogs.map((d) => d.breed_group).filter(Boolean)),
  ];
  gruposUnicos.sort();
  gruposUnicos.forEach((grupo) => {
    const option = document.createElement("option");
    option.value = grupo;
    option.textContent = grupo;
    groupFilter.appendChild(option);
  });
}

function renderDogs(dogs) {
  container.innerHTML = "";

  if (dogs.length === 0) {
    container.innerHTML = `<p class="error">No se encontraron razas con ese nombre. 🐾</p>`;
    return;
  }

  const favoritos = JSON.parse(localStorage.getItem("favoritosPerros") || "[]");
  dogs.forEach((dog) => {
    const imageUrl = dog.reference_image_id
      ? `https://cdn2.thedogapi.com/images/${dog.reference_image_id}.jpg`
      : "/placeholder.jpg";
    const isFav = favoritos.includes(dog.id);
    const card = document.createElement("div");
    card.className = "card";
    card.innerHTML = `
      <img src="${imageUrl}" alt="${
      dog.name
    }" onerror="this.onerror=null;this.src='/placeholder.jpg';">
      <h3>${dog.name}</h3>
      <p>${dog.breed_group || "Sin grupo"}</p>
      <a class="ir_detalle" href="/detalles/detalles.html?id=${
        dog.id
      }">Características del perro</a>
      <button class="btn-fav" data-id="${dog.id}">${
      isFav ? "Quitar de favoritos" : "Agregar a favoritos"
    }</button>
    `;
    container.appendChild(card);
  });
  // Eventos para botones de favoritos
  container.querySelectorAll(".btn-fav").forEach((btn) => {
    btn.addEventListener("click", (e) => {
      const id = Number(e.target.getAttribute("data-id"));
      let favoritos = JSON.parse(
        localStorage.getItem("favoritosPerros") || "[]"
      );
      if (favoritos.includes(id)) {
        favoritos = favoritos.filter((fid) => fid !== id);
      } else {
        favoritos.push(id);
      }
      localStorage.setItem("favoritosPerros", JSON.stringify(favoritos));
      renderDogs(dogs);
    });
  });
}

function aplicarFiltrosYOrden() {
  let filtrados = allDogs;

  // Filtro por texto
  const texto = searchInput.value.toLowerCase();
  if (texto) {
    filtrados = filtrados.filter((d) => d.name.toLowerCase().includes(texto));
  }

  // Filtro por grupo
  const grupo = groupFilter.value;
  if (grupo) {
    filtrados = filtrados.filter((d) => d.breed_group === grupo);
  }

  // Ordenamiento
  const orden = sortSelect.value;
  filtrados.sort((a, b) => {
    if (!a.name || !b.name) return 0;
    return orden === "az"
      ? a.name.localeCompare(b.name)
      : b.name.localeCompare(a.name);
  });

  renderDogs(filtrados);
}

// Eventos
searchInput.addEventListener("input", aplicarFiltrosYOrden);
groupFilter.addEventListener("change", aplicarFiltrosYOrden);
sortSelect.addEventListener("change", aplicarFiltrosYOrden);

// Carga inicial
obtenerPerros();
