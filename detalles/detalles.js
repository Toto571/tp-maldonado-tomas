const params = new URLSearchParams(window.location.search);
const id = params.get("id");
const container = document.getElementById("dog-detail");
let allDogs = [];

async function mostrarDetalle() {
  try {
    const res = await fetch("https://api.thedogapi.com/v1/breeds");
    const data = await res.json();
    const dog = data.find((d) => d.id === Number(id));
    console.log("ID buscado:", id, "Objeto dog encontrado:", dog);

    if (!dog) {
      container.innerHTML =
        '<p class="error">No se encontró información de esta raza. 😢</p>';
      return;
    }
    console.log("ID del perro encontrado:", dog.id, "Tipo:", typeof dog.id);
    console.log("Objeto dog completo:", dog);
    console.log("Propiedad dog.image:", dog.image);
    const imageUrl =
      `https://cdn2.thedogapi.com/images/${dog.reference_image_id}.jpg` ||
      `./images/placeholder.jpg`;

    container.innerHTML = `
          <div class="card">
            <img src="${imageUrl}" alt="${
      dog.name
    }" onerror="this.onerror=null;this.src='./images/placeholder.jpg';">
            <h2>${dog.name}</h2>
            <p><strong>Origen:</strong> ${dog.origin || "Desconocido"}</p>
            <p><strong>Esperanza de vida:</strong> ${dog.life_span}</p>
            <p><strong>Altura:</strong> ${dog.height.metric} cm</p>
            <p><strong>Peso:</strong> ${dog.weight.metric} kg</p>
            <p><strong>Temperamento:</strong> ${
              dog.temperament || "No especificado"
            }</p>
            <p style="font-size:12px;color:#888;">Ruta imagen: ${imageUrl}</p>
          </div>
        `;
  } catch (error) {
    container.innerHTML =
      '<p class="error">Error al cargar los datos. Intente más tarde. 🐕</p>';
    console.error("Error al obtener detalles:", error);
  }
}
mostrarDetalle();
