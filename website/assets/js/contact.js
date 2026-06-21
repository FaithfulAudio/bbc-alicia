/**
 * Contact form submission handler — Bible Baptist Church Alicia.
 * Posts the /visit/ contact form to Formspree (no backend to host/maintain).
 *
 * SETUP (one-time, ~1 minute):
 *   1. Create a free form at https://formspree.io with the delivery email
 *      debogz4ever@gmail.com  (the church's inbox).
 *   2. Copy the form's endpoint (looks like https://formspree.io/f/abcdwxyz).
 *   3. Paste it into ENDPOINT below, replacing REPLACE_WITH_FORM_ID.
 * Until that is done, the form will politely ask visitors to email instead.
 */
(function () {
  var ENDPOINT = "https://formspree.io/f/REPLACE_WITH_FORM_ID";
  var FALLBACK_EMAIL = "debogz4ever@gmail.com";

  var form = document.getElementById("contact-form");
  if (!form) return;

  var statusEl = form.querySelector(".form-status");
  var button   = form.querySelector("button[type='submit']");
  var configured = ENDPOINT.indexOf("REPLACE_WITH_FORM_ID") === -1;

  form.addEventListener("submit", async function (e) {
    e.preventDefault();

    // Honeypot — if filled, silently "succeed" (likely a bot)
    if (form.elements.website && form.elements.website.value) {
      statusEl.className = "form-status ok";
      statusEl.textContent = "Thank you — your message has been sent.";
      form.reset();
      return;
    }

    if (!configured) {
      statusEl.className = "form-status error";
      statusEl.innerHTML = "Our message form is being set up. Please email us directly at " +
        "<a href='mailto:" + FALLBACK_EMAIL + "'>" + FALLBACK_EMAIL + "</a> — thank you!";
      return;
    }

    statusEl.className = "form-status";
    statusEl.textContent = "Sending…";
    button.disabled = true;

    var data = {
      name:    form.elements.name.value,
      email:   form.elements.email.value,
      subject: form.elements.subject.value,
      message: form.elements.message.value,
    };

    try {
      var r = await fetch(ENDPOINT, {
        method: "POST",
        headers: { "Content-Type": "application/json", "Accept": "application/json" },
        body: JSON.stringify(data),
      });
      var body = await r.json().catch(function () { return {}; });

      if (r.ok && !body.errors) {
        statusEl.className = "form-status ok";
        statusEl.textContent = "Thank you — your message has been sent. We will reply as soon as we are able.";
        form.reset();
      } else {
        var msg = (body.errors && body.errors[0] && body.errors[0].message) || null;
        statusEl.className = "form-status error";
        statusEl.innerHTML = (msg ? msg + " " : "Sorry — something went wrong. ") +
          "Please email us at <a href='mailto:" + FALLBACK_EMAIL + "'>" + FALLBACK_EMAIL + "</a>.";
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
