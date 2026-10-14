const eventsList = document.querySelector("#events");

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

    eventsList.replaceChildren();

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
