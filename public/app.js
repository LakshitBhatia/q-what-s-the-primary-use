const headingText = "Find your palace\non Dwarka Expressway.";

const units = [
  {
    title: "3 BHK + SPR",
    size: "2,833 sqft",
    carpet: "Approx. 1,446 sqft carpet in Tower D/E typical plan",
    fit: "Best for families wanting luxury scale without moving to the highest ticket size."
  },
  {
    title: "4 BHK + SPR",
    size: "3,457 sqft",
    carpet: "Approx. 1,808 sqft carpet in Tower A/B typical plan",
    fit: "Best for larger families, privacy seekers, and buyers comparing ultra-luxury projects."
  },
  {
    title: "Refuge Unit",
    size: "2,549-3,088 sqft",
    carpet: "Approx. 1,271-1,575 sqft carpet",
    fit: "Useful when buyer wants a lower ticket size within the same address."
  },
  {
    title: "Penthouse",
    size: "Approx. 6,994 sqft lower penthouse; larger options mentioned up to 13,500 sqft",
    carpet: "Approx. 3,389 sqft carpet for Tower B lower penthouse plan",
    fit: "For trophy-home buyers who want exclusivity, views, and maximum statement value."
  }
];

const amenities = [
  "60,000 sqft G+4 clubhouse",
  "Temperature-controlled rooftop/infinity swimming pool",
  "Gymnasium in collaboration with Cult",
  "Spa, sauna, jacuzzi, and wellness areas",
  "Ballrooms, restaurant/cafe, rooftop restaurant",
  "Lawn tennis, badminton courts, multipurpose hall",
  "Vehicle-free surface zone and multi-tier digital security",
  "Wrap-around balconies and fully fitted apartments"
];

const techFeatures = [
  {
    title: "App-based automation",
    copy: "IoT smart switches for lights, fans, ACs, TVs, geyser timing, and living-room curtain control."
  },
  {
    title: "Smart AQI management",
    copy: "Energy Recovery Ventilation, Nanoe X purification, and VRF systems support the wellness narrative."
  },
  {
    title: "Security layer",
    copy: "IP video door phones, digital locks, CCTV, and video surveillance strengthen the family-safety pitch."
  },
  {
    title: "Premium fitted home",
    copy: "Fully fitted apartments with modular kitchen, wardrobes, VRV/VRF air conditioning, and premium finish positioning."
  }
];

const competitors = [
  "Godrej Vrikshya, Sector 103",
  "Krisumi Waterside / Waterfall Residences",
  "Sobha Altus / Sobha City",
  "ATS Triumph, Sector 104",
  "Puri Emerald Bay, Sector 104",
  "Indiabulls Estate & Club, Sector 104",
  "M3M Crown / M3M Capital",
  "Smartworld One DXP",
  "Elan The Presidential",
  "Max Estate 360"
];

const advisorMap = {
  payment: {
    title: "Lead with the 30:70 story",
    copy: "This buyer needs payment comfort. Explain the first 30% schedule, then highlight the tentative gap before later construction-linked payments.",
    next: "Offer a payment-plan walkthrough before discussing price per sqft."
  },
  location: {
    title: "Anchor the Dwarka Expressway advantage",
    copy: "Focus on Sector 104, direct expressway positioning, airport-side access, Yashobhoomi, Cyber City, and future corridor growth.",
    next: "Show the location map and compare travel-time anchors."
  },
  price: {
    title: "Justify premium through scarcity",
    copy: "Frame price around low density, tower height, clubhouse scale, fully fitted apartments, Panasonic smart-home technology, wrap-around balconies, and Hero brand trust.",
    next: "Compare value against similar luxury projects before negotiating."
  },
  smart: {
    title: "Lead with Panasonic wellness tech",
    copy: "Explain app-based controls, AQI management, ERV, Nanoe X, VRF systems, smart toilets, video door phones, digital locks, and surveillance as a comfort-plus-safety package.",
    next: "Show the buyer how smart-home features reduce daily friction and strengthen family wellness."
  },
  resale: {
    title: "Position around branded corridor demand",
    copy: "Emphasize expressway visibility, low-density supply, large formats, and the limited 50-unit plan mentioned in the sales brief.",
    next: "Discuss exit horizon, rental profile, and comparable projects."
  },
  builder: {
    title: "Use Hero Enterprise credibility",
    copy: "Talk about Hero Realty under Hero Enterprise, 5700+ happy customers, 6.02 million sqft delivered, and long-term brand legacy.",
    next: "Share corporate presentation credibility points before the site visit."
  }
};

const unitGrid = document.querySelector("#unitGrid");
const amenityGrid = document.querySelector("#amenityGrid");
const techGrid = document.querySelector("#techGrid");
const competitorList = document.querySelector("#competitorList");
const advisorForm = document.querySelector("#advisorForm");
const advisorResult = document.querySelector("#advisorResult");
const queryForm = document.querySelector("#queryForm");
const queryInput = document.querySelector("#queryInput");
const queryButton = document.querySelector("#queryButton");
const queryAnswer = document.querySelector("#queryAnswer");

renderAnimatedHeading();
renderUnits();
renderAmenities();
renderTech();
renderCompetitors();
renderAdvisor();

advisorForm.addEventListener("change", renderAdvisor);
queryForm.addEventListener("submit", answerPropertyQuery);

function renderAnimatedHeading() {
  const target = document.querySelector("#animatedHeading");
  const charDelay = 30;
  const lines = headingText.split("\n");

  target.innerHTML = lines
    .map((line, lineIndex) => {
      const chars = [...line]
        .map((char, charIndex) => {
          const delay = 200 + lineIndex * line.length * charDelay + charIndex * charDelay;
          const value = char === " " ? "&nbsp;" : escapeHtml(char);
          return `<span class="char" style="transition-delay:${delay}ms">${value}</span>`;
        })
        .join("");
      return `<span class="line">${chars}</span>`;
    })
    .join("");

  requestAnimationFrame(() => target.classList.add("is-visible"));
}

function renderUnits() {
  unitGrid.innerHTML = units
    .map(
      (unit) => `
        <article class="unit-card">
          <span>${unit.size}</span>
          <h3>${unit.title}</h3>
          <p>${unit.carpet}</p>
          <small>${unit.fit}</small>
        </article>
      `
    )
    .join("");
}

function renderAmenities() {
  amenityGrid.innerHTML = amenities
    .map((amenity) => `<article><span></span>${amenity}</article>`)
    .join("");
}

function renderTech() {
  techGrid.innerHTML = techFeatures
    .map(
      (feature) => `
        <article>
          <h3>${feature.title}</h3>
          <p>${feature.copy}</p>
        </article>
      `
    )
    .join("");
}

function renderCompetitors() {
  competitorList.innerHTML = competitors
    .map((competitor) => `<article>${competitor}</article>`)
    .join("");
}

function renderAdvisor() {
  const data = new FormData(advisorForm);
  const purpose = data.get("purpose");
  const family = data.get("family");
  const configuration = data.get("configuration");
  const concern = data.get("concern");
  const advice = advisorMap[concern];

  const unit = pickUnit(configuration, family);
  const purposeLine = {
    family: "Best framed as a family upgrade with lifestyle, privacy, and long-term comfort.",
    investment: "Best framed around corridor growth, branded scarcity, and limited luxury supply.",
    nri: "Best framed around brand trust, managed lifestyle, and low day-to-day ownership friction.",
    luxury: "Best framed around the palace theme, clubhouse, tower height, and statement value."
  }[purpose];

  advisorResult.innerHTML = `
    <p class="eyebrow">Recommended Route</p>
    <h3>${unit.title}</h3>
    <p>${unit.reason}</p>
    <div class="advisor-point">
      <strong>${advice.title}</strong>
      <span>${advice.copy}</span>
    </div>
    <div class="advisor-point">
      <strong>Buyer angle</strong>
      <span>${purposeLine}</span>
    </div>
    <div class="advisor-point">
      <strong>Next move</strong>
      <span>${advice.next}</span>
    </div>
    <a class="button primary" href="#visit">Book guided site visit</a>
  `;
}

async function answerPropertyQuery(event) {
  event.preventDefault();

  const question = queryInput.value.trim();
  if (!question) return;

  queryButton.disabled = true;
  queryAnswer.hidden = false;
  queryAnswer.textContent = "Preparing advisor response...";

  try {
    const data = new FormData(advisorForm);
    const response = await fetch("/api/property-advisor", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({
        question,
        profile: {
          purpose: data.get("purpose"),
          family: data.get("family"),
          configuration: data.get("configuration"),
          concern: data.get("concern")
        }
      })
    });
    const result = await response.json();

    if (!response.ok) throw new Error(result.error || "Advisor response failed.");

    queryAnswer.textContent = result.answer;
  } catch (error) {
    queryAnswer.textContent = error.message;
  } finally {
    queryButton.disabled = false;
  }
}

function pickUnit(configuration, family) {
  if (configuration === "penthouse") {
    return {
      title: "Penthouse",
      reason: "Use this when the buyer wants a trophy residence, privacy, views, and a stronger status signal than a standard apartment."
    };
  }

  if (configuration === "3457" || family === "large") {
    return {
      title: "4 BHK + SPR, 3,457 sqft",
      reason: "This is the strongest fit for larger families and buyers comparing serious ultra-luxury options."
    };
  }

  if (configuration === "2550") {
    return {
      title: "2,549 sqft refuge-size option",
      reason: "This keeps the buyer inside the project while making the conversation more ticket-size sensitive."
    };
  }

  return {
    title: "3 BHK + SPR, 2,833 sqft",
    reason: "This is the balanced recommendation for a premium family upgrade with space, service room utility, and lower entry than the 4 BHK."
  };
}

function escapeHtml(value) {
  return value.replace(/[&<>"']/g, (char) => ({
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    '"': "&quot;",
    "'": "&#039;"
  })[char]);
}
