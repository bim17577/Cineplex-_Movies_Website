// HALL & SEAT PICKER (book ticket page)

const HALLS = {
  B1: { label: "Hall B1 · 4K Digital Projection", rows: "ABCDEFGH", seatsPerRow: 12, aisleAfter: [3, 9] },
  B2: { label: "Hall B2 · 2K Laser Projection", rows: "ABCDEFG", seatsPerRow: 10, aisleAfter: [5] }
};
const MAX_SEATS = 10;

const bookingForm = document.getElementById("booking-form");
const seatPicker = document.getElementById("seat-picker");
const seatMap = document.getElementById("seat-map");
const seatPickerHall = document.getElementById("seat-picker-hall");
const seatSummary = document.getElementById("seat-summary");
const seatError = document.getElementById("seat-error");
const seatsInput = document.getElementById("seats-input");

let selectedSeats = [];

const currentHall = () => bookingForm.querySelector('input[name="hall"]:checked')?.value;

const showKey = () =>
  ["movie", "date", "showtime"].map((name) => bookingForm.elements[name].value).join("|") + "|" + currentHall();

// When the page is not served by PHP (e.g. opened as a file) we can't ask the
// database, so a repeatable set of demo "sold" seats is shown instead.
function demoSoldSeats(hall) {
  let hash = 0;
  for (const ch of showKey()) hash = (hash * 31 + ch.charCodeAt(0)) >>> 0;

  const sold = [];
  for (const row of hall.rows) {
    for (let n = 1; n <= hall.seatsPerRow; n++) {
      hash = (hash * 1103515245 + 12345) >>> 0;
      if (hash % 100 < 22) sold.push(row + n);
    }
  }
  return sold;
}

async function loadSoldSeats(hall) {
  const params = new URLSearchParams({
    movie: bookingForm.elements.movie.value,
    date: bookingForm.elements.date.value,
    showtime: bookingForm.elements.showtime.value,
    hall: currentHall()
  });

  try {
    const response = await fetch(`booked_seats.php?${params}`);
    if (!response.ok) throw new Error(response.statusText);
    const data = await response.json();
    return data.seats;
  } catch {
    return demoSoldSeats(hall);
  }
}

function updateSummary() {
  seatsInput.value = selectedSeats.join(",");
  seatError.textContent = "";

  if (!selectedSeats.length) {
    seatSummary.textContent = "No seats selected yet.";
    return;
  }
  const count = selectedSeats.length;
  seatSummary.innerHTML = `<strong>${count} seat${count > 1 ? "s" : ""}:</strong> ${selectedSeats.join(", ")}`;
}

function toggleSeat(button) {
  const seat = button.dataset.seat;

  if (selectedSeats.includes(seat)) {
    selectedSeats = selectedSeats.filter((s) => s !== seat);
    button.classList.remove("is-selected");
    button.setAttribute("aria-pressed", "false");
  } else {
    if (selectedSeats.length >= MAX_SEATS) {
      seatError.textContent = `You can book up to ${MAX_SEATS} seats at a time.`;
      return;
    }
    selectedSeats.push(seat);
    button.classList.add("is-selected");
    button.setAttribute("aria-pressed", "true");
  }

  updateSummary();
}

async function renderSeatMap() {
  const hallId = currentHall();
  if (!hallId) return;

  const hall = HALLS[hallId];
  seatPicker.hidden = false;
  seatPickerHall.textContent = hall.label;
  seatMap.classList.add("is-loading");

  const sold = new Set(await loadSoldSeats(hall));

  // Keep any seats the customer picked that are still free
  selectedSeats = selectedSeats.filter((seat) => !sold.has(seat) && hall.rows.includes(seat[0]) && Number(seat.slice(1)) <= hall.seatsPerRow);

  seatMap.innerHTML = "";
  for (const row of hall.rows) {
    const rowEl = document.createElement("div");
    rowEl.className = "seat-row";
    rowEl.innerHTML = `<span class="seat-row-label">${row}</span>`;

    for (let n = 1; n <= hall.seatsPerRow; n++) {
      const seat = row + n;
      const isSold = sold.has(seat);
      const isSelected = selectedSeats.includes(seat);
      const button = document.createElement("button");

      button.type = "button";
      button.className = "seat" + (isSold ? " is-sold" : "") + (isSelected ? " is-selected" : "");
      if (hall.aisleAfter.includes(n)) button.classList.add("aisle");
      button.dataset.seat = seat;
      button.textContent = n;
      button.title = isSold ? `${seat} – sold` : seat;
      button.setAttribute("aria-label", isSold ? `Seat ${seat}, sold` : `Seat ${seat}`);
      button.setAttribute("aria-pressed", String(isSelected));
      button.disabled = isSold;
      button.addEventListener("click", () => toggleSeat(button));
      rowEl.appendChild(button);
    }

    rowEl.insertAdjacentHTML("beforeend", `<span class="seat-row-label">${row}</span>`);
    seatMap.appendChild(rowEl);
  }

  seatMap.classList.remove("is-loading");
  updateSummary();
}

if (bookingForm && seatMap) {
  bookingForm.querySelectorAll('input[name="hall"]').forEach((radio) =>
    radio.addEventListener("change", () => {
      selectedSeats = [];
      renderSeatMap();
    })
  );

  // A different movie, date or show time has different sold seats
  ["movie", "date", "showtime"].forEach((name) =>
    bookingForm.elements[name].addEventListener("change", renderSeatMap)
  );

  bookingForm.addEventListener("submit", (e) => {
    if (!selectedSeats.length) {
      e.preventDefault();
      seatPicker.hidden = !currentHall();
      seatError.textContent = currentHall() ? "Please pick at least one seat." : "";
      (currentHall() ? seatPicker : bookingForm.querySelector(".hall-picker")).scrollIntoView({ behavior: "smooth", block: "center" });
    }
  });
}
