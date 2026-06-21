/**
 * Contact form submission handler — Bible Baptist Church Alicia.
 * Submits the /visit/ form to API Gateway → Lambda → Amazon SES, which emails
 * the church inbox. Mirrors the reachthephilippines pipeline.
 */
(function () {
  var ENDPOINT = "https://tdf5nyjj6g.execute-api.us-east-1.amazonaws.com/contact";
  var FALLBACK_EMAIL = "debogz4ever@gmail.com";

  var form = document.getElementById("contact-form");
  if (!form) return;

  var statusEl = form.querySelector(".form-status");
  var button   = form.querySelector("button[type='submit']");

  form.addEventListener("submit", async function (e) {
    e.preventDefault();
    statusEl.className = "form-status";
    statusEl.textContent = "Sending…";
    button.disabled = true;

    var data = {
      name:    form.elements.name.value,
      email:   form.elements.email.value,
      subject: form.elements.subject.value,
      message: form.elements.message.value,
      website: form.elements.website.value, // honeypot
    };

    try {
      var r = await fetch(ENDPOINT, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      var body = await r.json().catch(function () { return {}; });

      if (r.ok && body.ok) {
        statusEl.className = "form-status ok";
        statusEl.textContent = "Thank you — your message has been sent. We will reply to your email as soon as we are able.";
        form.reset();
      } else {
        statusEl.className = "form-status error";
        statusEl.innerHTML = (body.error || "Sorry — something went wrong.") +
          " Please email us at <a href='mailto:" + FALLBACK_EMAIL + "'>" + FALLBACK_EMAIL + "</a>.";
      }
    } catch (err) {
      statusEl.className = "form-status error";
      statusEl.innerHTML = "Network error. Please try again, or email us at " +
        "<a href='mailto:" + FALLBACK_EMAIL + "'>" + FALLBACK_EMAIL + "</a>.";
    } finally {
      button.disabled = false;
    }
  });
})();
