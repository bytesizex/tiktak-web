/* "Contact us" buttons.
   The address never appears in the HTML: it is stored here as an XOR-masked,
   base64 payload, decoded only when a visitor clicks, and the click opens their
   mail client directly. Nothing is written to the page. */
(() => {
  const KEY = "TikTak-2026-contact";
  const PAYLOAD = "NhAfMRICV1ceR1FOSAwBGhUCFyApDDkAAkEcU11b";

  const address = () => {
    const bytes = atob(PAYLOAD);
    let out = "";
    for (let i = 0; i < bytes.length; i += 1) {
      out += String.fromCharCode(bytes.charCodeAt(i) ^ KEY.charCodeAt(i % KEY.length));
    }
    return out;
  };

  document.querySelectorAll("[data-contact-mail]").forEach((button) => {
    button.addEventListener("click", () => {
      window.location.href = "mailto:" + address();
    });
  });
})();
