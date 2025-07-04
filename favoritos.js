const container = document.getElementById("favoritos-container");

function getFavoritos() {
  return JSON.parse(localStorage.getItem("favoritosPerros") || "[]");
}

function setFavoritos(arr) {
  localStorage.setItem("favoritosPerros", JSON.stringify(arr));
}

async function mostrarFavoritos() {
  const favoritos = getFavoritos();
  if (favoritos.length === 0) {
    container.innerHTML =
      '<p class="error">No tienes perros favoritos aún.</p>';
    return;
  }
  try {
    const res = await fetch("https://api.thedogapi.com/v1/breeds");
    const data = await res.json();
    const dogs = data.filter((d) => favoritos.includes(d.id));
    container.innerHTML = "";
    dogs.forEach((dog) => {
      const imageUrl = dog.reference_image_id
        ? `https://cdn2.thedogapi.com/images/${dog.reference_image_id}.jpg`
        : "./src/images/placeholder.jpg";
      const card = document.createElement("div");
      card.className = "card";
      card.innerHTML = `
        <img src="${imageUrl}" alt="${
        dog.name
      }" onerror="this.onerror=null;this.src='/placeholder.jpg';">
        <h3>${dog.name}</h3>
        <p><strong>Grupo:</strong> ${dog.breed_group || "Sin grupo"}</p>
        <p><strong>Origen:</strong> ${dog.origin || "Desconocido"}</p>
        <p><strong>Esperanza de vida:</strong> ${dog.life_span || "-"}</p>
        <p><strong>Altura:</strong> ${
          dog.height?.metric ? dog.height.metric + " cm" : "-"
        }</p>
        <p><strong>Peso:</strong> ${
          dog.weight?.metric ? dog.weight.metric + " kg" : "-"
        }</p>
        <p><strong>Temperamento:</strong> ${
          dog.temperament || "No especificado"
        }</p>
        <button class="btn-fav" data-id="${dog.id}">Quitar de favoritos</button>
      `;
      container.appendChild(card);
    });
    container.querySelectorAll(".btn-fav").forEach((btn) => {
      btn.addEventListener("click", (e) => {
        const id = Number(e.target.getAttribute("data-id"));
        const nuevos = getFavoritos().filter((fid) => fid !== id);
        setFavoritos(nuevos);
        mostrarFavoritos();
      });
    });
  } catch (error) {
    container.innerHTML = '<p class="error">Error al cargar favoritos.</p>';
  }
}

mostrarFavoritos();
