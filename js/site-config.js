window.SITE = {
  phone: {
    display: "+34 614 00 50 53",
    raw: "34614005053",
  },

  whatsapp: {
    defaultText: "Hola, tengo una consulta sobre el afilado de herramientas.",
  },

  instagram: "https://www.instagram.com/filofino.es",

  address: {
    text: "Calle Maestro Guerrero, 4, Valencia",
    maps: "https://maps.app.goo.gl/Z4WQeCUKKeDbx8Qt7",
  },

  schedule: {
    weekdays: "Lunes a viernes: 10:00 – 17:30",
    lunch: "Descanso: 14:00 – 15:00",
    saturday: "Sábados: con cita previa",
    sunday: "Domingos: cerrado",
  },

  copyright: {
    brand: "Filo Fino",
    description: "Afilado profesional en Valencia",
  },
};

document.addEventListener("DOMContentLoaded", () => {
  const s = window.SITE;

  /* Телефон */
  document.querySelectorAll("[data-phone]").forEach((el) => {
    el.textContent = s.phone.display;
    el.href = `tel:+${s.phone.raw}`;
  });

  /* WhatsApp */
  document.querySelectorAll("[data-whatsapp]").forEach((el) => {
    el.textContent = `WhatsApp: ${s.phone.display}`;
    el.href = `https://wa.me/${s.phone.raw}`;
  });

  /* Instagram */
  document.querySelectorAll("[data-instagram]").forEach((el) => {
    el.href = s.instagram;
  });

  /* Адрес */
  document.querySelectorAll("[data-address]").forEach((el) => {
    el.textContent = s.address.text;
    el.href = s.address.maps;
  });

  /* Расписание */
  document.querySelectorAll("[data-schedule]").forEach((el) => {
    el.innerHTML = `
      ${s.schedule.weekdays}<br />
      <small>${s.schedule.lunch}</small><br />
      ${s.schedule.saturday}<br />
      ${s.schedule.sunday}
    `;
  });

  /* © Год */
  const year = new Date().getFullYear();
  document.querySelectorAll("[data-copyright]").forEach((el) => {
    el.innerHTML = `&copy; ${year} ${s.copyright.brand} · ${s.copyright.description}`;
  });
});
