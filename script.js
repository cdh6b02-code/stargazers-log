const eventsList = document.querySelector("#events");

function isValidEvent(event) {
  if (
    event === null ||
    typeof event !== "object" ||
    typeof event.repository !== "string" ||
    event.repository.trim() === "" ||
    typeof event.description !== "string" ||
    typeof event.starredAt !== "string" ||
    !/^\d{4}-\d{2}-\d{2}$/.test(event.starredAt)
  ) {
    return false;
  }

  const date = new Date(`${event.starredAt}T00:00:00Z`);
  if (
    Number.isNaN(date.getTime()) ||
    date.toISOString().slice(0, 10) !== event.starredAt
  ) {
    return false;
  }

  try {
    const url = new URL(event.url);
    return url.protocol === "http:" || url.protocol === "https:";
  } catch {
    return false;
  }
}

async function loadStarredRepositories() {
  try {
    const response = await fetch("events.json");
    if (!response.ok) {
      throw new Error(`Request failed with status ${response.status}`);
    }

    const events = await response.json();
    if (!Array.isArray(events)) {
      throw new Error("Repository data must be a list");
    }

    if (!events.every(isValidEvent)) {
      throw new Error("Repository data contains an invalid entry");
    }

    eventsList.replaceChildren();

    if (events.length === 0) {
      const message = document.createElement("li");
      message.textContent = "No starred repositories yet.";
      eventsList.append(message);
      return;
    }

    for (const event of events) {
      const item = document.createElement("li");
      const link = document.createElement("a");
      const date = document.createElement("time");
      const description = document.createElement("span");

      link.href = event.url;
      link.textContent = event.repository;
      date.className = "repository-date";
      date.dateTime = event.starredAt;
      date.textContent = `Starred on ${event.starredAt}`;
      description.className = "repository-description";
      description.textContent = event.description;

      item.append(link, date, description);
      eventsList.append(item);
    }
  } catch (error) {
    console.error("Could not load starred repositories:", error);
    eventsList.replaceChildren();
    const message = document.createElement("li");
    message.textContent = "Could not load repositories. Please try again later.";
    eventsList.append(message);
  }
}

loadStarredRepositories();
