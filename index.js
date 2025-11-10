document.addEventListener("DOMContentLoaded", function () {
  const landingForm = document.getElementById("ebook-form");
  if (landingForm) {
    landingForm.addEventListener("submit", async function (e) {
      e.preventDefault();

      const nombre = landingForm.nombre.value.trim();
      const correo = landingForm.correo.value.trim();
      const celular = landingForm.celular.value.trim();
      const pais = landingForm.pais.value.trim();

      // 🔹 Validaciones básicas
      const errores = [];
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!nombre) errores.push("⚠️ El nombre es obligatorio.");
      if (!emailRegex.test(correo)) errores.push("⚠️ El correo no es válido.");
      if (celular && !/^[0-9\s\-\+]+$/.test(celular)) {
        errores.push("⚠️ El celular solo debe contener números o símbolos válidos.");
      }
      if (errores.length > 0) {
        alert(errores.join("\n"));
        return;
      }

      // 🔹 Cambia el estado del botón
      const boton = landingForm.querySelector("button[type='submit']");
      boton.disabled = true;
      boton.textContent = "Enviando...";

      // 🔹 Estructura correcta para SheetDB
      const data = {
        nombre,
        correo,
        celular,
        pais,
        fecha: new Date().toLocaleString("es-CO", { hour12: false }),
      };

      try {
        const res = await fetch("https://sheetdb.io/api/v1/hogcxrbni5pxo", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ data: [data] }), // ✅ obligatorio que sea un array
        });

        const result = await res.json();
        console.log("✅ Respuesta de SheetDB:", result);

        // 🔹 SheetDB responde algo como { "created": 1 } si fue exitoso
        if (result.created === 1) {
          alert("✅ Datos enviados correctamente a Google Sheets");

          // Mensaje visual en la landing
          let successMsg = document.getElementById("landing-success-msg");
          if (!successMsg) {
            successMsg = document.createElement("div");
            successMsg.id = "landing-success-msg";
            successMsg.style.marginTop = "18px";
            successMsg.style.color = "#7ade4b";
            successMsg.style.fontWeight = "bold";
            landingForm.parentNode.insertBefore(successMsg, landingForm.nextSibling);
          }
          successMsg.textContent = "¡Formulario enviado correctamente!";

          landingForm.reset();
          boton.textContent = "Quiero mi Ebook GRATIS";

          // Redirección
          setTimeout(() => {
            window.location.href = "https://chat.whatsapp.com/GImlKSKE9JRC0ZrKafNA8p";
          }, 1000);
        } else {
          throw new Error("Error al registrar en SheetDB");
        }
      } catch (err) {
        console.error("❌ Error al enviar:", err);
        alert("❌ Error al registrar los datos. Intenta de nuevo.");
      } finally {
        boton.disabled = false;
      }
    });
  }

  // 🔹 Scroll suave hacia el formulario
  document.querySelectorAll(".scroll-to-form").forEach(function (btn) {
    btn.addEventListener("click", function () {
      const form = document.getElementById("ebook-form");
      if (form) {
        form.scrollIntoView({ behavior: "smooth", block: "center" });
        form.querySelector('input[name="nombre"]').focus();
      }
    });
  });
});
