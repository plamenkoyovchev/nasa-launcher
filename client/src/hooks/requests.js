const API_URL = process.env.REACT_APP_API_URL;

async function httpGetPlanets() {
  // Load planets and return as JSON.
  const response = await fetch(`${API_URL}/planets`);
  const data = await response.json();

  return data;
}

async function httpGetLaunches() {
  // TODO: Once API is ready.
  // Load launches, sort by flight number, and return as JSON.
}

async function httpSubmitLaunch(launch) {
  // TODO: Once API is ready.
  // Submit given launch data to launch system.
}

async function httpAbortLaunch(id) {
  // TODO: Once API is ready.
  // Delete launch with given ID.
}

export {
  httpGetPlanets,
  httpGetLaunches,
  httpSubmitLaunch,
  httpAbortLaunch,
};