/**
 * Lightweight checks for booking-scheduler rules (no TypeScript runner required).
 * Keep in sync with src/lib/booking-scheduler.ts and booking-settings defaults.
 */

function timeToMinutes(time) {
  const [h, m] = time.split(":").map((x) => Number(x));
  return h * 60 + m;
}

function isSlotStartValid(startMinutes, durationMinutes, settings) {
  if (startMinutes < settings.dayStartMinutes || startMinutes > settings.lastStartMinutes) return false;
  return startMinutes + durationMinutes <= settings.hardCloseMinutes;
}

function listAvailableSlots(date, durationMinutes, settings, existing) {
  const slots = [];
  const { slotIntervalMinutes, dayStartMinutes, lastStartMinutes } = settings;
  for (let start = dayStartMinutes; start <= lastStartMinutes; start += slotIntervalMinutes) {
    if (!isSlotStartValid(start, durationMinutes, settings)) continue;
    let conflict = false;
    for (const booking of existing) {
      if (booking.appointmentDate !== date || booking.status === "rejected" || booking.status === "cancelled") continue;
      const bStart = timeToMinutes(booking.appointmentTime);
      const bEnd = bStart + booking.durationMinutes;
      if (start < bEnd && bStart < start + durationMinutes) conflict = true;
    }
    if (!conflict) slots.push(`${String(Math.floor(start / 60)).padStart(2, "0")}:${String(start % 60).padStart(2, "0")}`);
  }
  return slots;
}

const settings = {
  dayStartMinutes: 8 * 60,
  lastStartMinutes: 23 * 60 + 45,
  hardCloseMinutes: 24 * 60,
  slotIntervalMinutes: 15,
};

let failed = 0;
function assert(cond, msg) {
  if (!cond) {
    console.error("FAIL:", msg);
    failed++;
  }
}

const slots60 = listAvailableSlots("2030-06-01", 60, settings, []);
assert(slots60[0] === "08:00", "first slot 8:00");
assert(slots60.at(-1) === "23:00", "last 60m start must end by midnight");
assert(slots60.includes("23:45") === false, "60m cannot start 23:45");

const slots15 = listAvailableSlots("2030-06-01", 15, settings, []);
assert(slots15.at(-1) === "23:45", "15m sessions can start 23:45");

assert(!isSlotStartValid(23 * 60 + 45, 90, settings), "90m cannot start 23:45");
assert(isSlotStartValid(22 * 60 + 30, 90, settings), "90m can start 22:30");

const blocked = listAvailableSlots("2030-06-01", 60, settings, [
  { appointmentDate: "2030-06-01", appointmentTime: "10:00", durationMinutes: 60, status: "pending" },
]);
assert(!blocked.includes("10:00"), "overlap removed");
assert(blocked.includes("09:00"), "adjacent slot ok");

if (failed) {
  console.error(`\n${failed} assertion(s) failed.`);
  process.exit(1);
}
console.log("booking-scheduler-selftest: OK");
