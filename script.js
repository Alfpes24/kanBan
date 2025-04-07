document.addEventListener("DOMContentLoaded", function () {
  const webAppUrl = "https://script.google.com/macros/s/AKfycbzsU1X9Q6SmO3UtMHsKk0dZKz3YFqi0S12_CKrW0MfKWF_ccan-3sdzG0MG8iFkSh8/exec"; // <-- tuo link Web App

  const esportaBtn = document.getElementById("export-btn");
  const importaBtn = document.getElementById("import-btn");

  esportaBtn.addEventListener("click", () => {
    try {
      const taskCards = document.querySelectorAll(".task-card");
      const tasks = [];

      taskCards.forEach(card => {
        const titolo = card.querySelector("h3")?.innerText || "";
        const paragrafi = card.querySelectorAll("p");
        const categoria = paragrafi[0]?.innerText || "";
        const scadenza = paragrafi[1]?.innerText || "";
        const priorita = paragrafi[2]?.innerText || "";
        const stato = card.closest(".kanban-column").dataset.status || "";
        const dataAttivita = new Date().toLocaleDateString("it-IT");

        tasks.push({
          titolo,
          categoria,
          scadenza,
          priorita,
          stato,
          dataAttivita
        });
      });

      // Evita i problemi di CORS: nessun headers personalizzato!
      fetch(webAppUrl, {
        method: "POST",
        body: JSON.stringify(tasks),
      })
      .then(response => response.text())
      .then(text => {
        alert("✅ Esportazione completata: " + text);
      })
      .catch(error => {
        console.error("Errore durante l'esportazione:", error);
        alert("Errore durante l'esportazione: " + error);
      });
    } catch (err) {
      alert("Errore inatteso: " + err.message);
    }
  });

  importaBtn.addEventListener("click", () => {
    fetch(webAppUrl)
      .then(response => response.json())
      .then(data => {
        console.log("Dati importati:", data);
        // Puoi gestire l'importazione visiva delle card se vuoi qui.
        alert("Dati importati correttamente! (vedi console)");
      })
      .catch(err => {
        console.error("Errore importazione:", err);
        alert("Errore durante l'importazione: " + err.message);
      });
  });
});
