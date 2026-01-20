import { signUp, signIn, confirmSignIn, fetchAuthSession } from 'aws-amplify/auth';

// COGNITO FUNCTIONS
async function ensureUserExists(email) {
  try {
    await signUp({
      username: email,
      options: { userAttributes: { email } },
    });
  } catch (e) {
    if (e?.name !== 'UsernameExistsException') throw e;
  }
}

export async function startEmailOtpSignIn(email) {
  try {
    await ensureUserExists(email);
    const result = await signIn({
      username: email.trim().toLowerCase(),
      options: {
        authFlowType: 'USER_AUTH',
        preferredChallenge: 'EMAIL_OTP',
      }
    });

    return result;
  } catch (error) {
    console.error('Error starting Email OTP sign-in:', error);
    throw error;
  }
}

export async function confirmEmailCode(code) {
  try {
    const result = await confirmSignIn({ challengeResponse: code });
    return result;
  } catch (error) {
    console.error('Error confirming Email OTP code:', error);
    throw error;
  }
}

// API FUNCTIONS
const API_BASE = import.meta.env.VITE_API_BASE_URL

// GET ALL EVENTS
export async function getEvents() {
  try {
    const session = await fetchAuthSession();
    const idToken = session.tokens?.idToken?.toString();
    if (!idToken) throw new Error("User is not signed in.");
    const response = await fetch(`${API_BASE}/events`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${idToken}`,
      },
    });
    if (!response.ok) {
      const text = await response.text();
      throw new Error(`API Error (${response.status}): ${text}`);
    }
    const data = await response.json();
    return data.events || [];
  } catch (err) {
    console.error("Error fetching events:", err);
    throw err;
  }
}

// GET AN EVENT
export async function getEvent(eventId) {
  try {
    const session = await fetchAuthSession();
    const idToken = session.tokens?.idToken?.toString();
    if (!idToken) throw new Error("User is not signed in.");
    const response = await fetch(`${API_BASE}/events/${eventId}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${idToken}`,
      },
    });
    if (response.status === 404) return null;
    if (!response.ok) {
      const text = await response.text();
      throw new Error(`API Error (${response.status}): ${text}`);
    }
    const data = await response.json();
    
    return data || {};
  } catch (err) {
    console.error("Failed to load event:", err);
    throw err;
  }
}

// CREATE EVENT
export async function createEvent({ eventTitle, eventDate, location }) {
  const session = await fetchAuthSession();
  const idToken = session.tokens?.idToken?.toString();
  if (!idToken) throw new Error("Not signed in");
  const iso = typeof eventDate === "string" ? eventDate : new Date(eventDate).toISOString();
  const res = await fetch(`${API_BASE}/events`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${idToken}`,
    },
    body: JSON.stringify({ eventTitle, eventDate: iso, location }),
  });
  if (!res.ok) {
    let friendlyMsg = "Something went wrong while creating your event.";
    let errCode = "";
    try {
      const err = await res.json();
      // Map known API error codes to friendlier text
      switch (err.code) {
        case "EVENTS_LIMIT":
          friendlyMsg =
            "You’ve reached the event limit for your current plan. Please upgrade to create more events.";
          break;
        case "GUESTS_PER_EVENT_LIMIT":
          friendlyMsg =
            "This event already has the maximum number of guests allowed for your plan.";
          break;
        case "GUESTS_TOTAL_LIMIT":
          friendlyMsg =
            "You’ve reached the total guest limit across all events. Try deleting unused events or upgrade your plan.";
          break;
        case "Unauthorized":
          friendlyMsg = "Your session has expired. Please sign in again.";
          break;
        default:
          // fallback to API's message if available
          friendlyMsg = err.message || friendlyMsg;
      }
      errCode = err.code || "";
    } catch (e) {
      // fallback if response isn't valid JSON
      const text = await res.text();
      console.warn("Unparsed API error:", text);
    }
    // throw a structured error that UI can handle
    const error = new Error(friendlyMsg);
    error.code = errCode;
    error.status = res.status;
    throw error;
  }
  const data = await res.json();
  return data.event;
}

// EDIT EVENT
export async function updateEvent({ eventId, eventTitle, eventDate, location }) {
  const session = await fetchAuthSession();
  const idToken = session.tokens?.idToken?.toString();
  if (!idToken) throw new Error("Not signed in");
  const iso = typeof eventDate === "string" ? eventDate : new Date(eventDate).toISOString();
  
  const res = await fetch(`${API_BASE}/events`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${idToken}`,
    },
    body: JSON.stringify({ eventId, eventTitle, eventDate: iso, location }),
  });
  if (!res.ok) {
    const text = await res.text();
    throw new Error(`Create failed (${res.status}): ${text}`);
  }
  const data = await res.json();
  return data.event;
}

// DELETE EVENT
export async function deleteEvent({ eventId }) {
  const session = await fetchAuthSession();
  const idToken = session.tokens?.idToken?.toString();
  if (!idToken) throw new Error("Not signed in");

  const res = await fetch(`${API_BASE}/events`, {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${idToken}`,
    },
    body: JSON.stringify({ eventId }),
  });
  if (!res.ok) {
    const text = await res.text();
    throw new Error(`Deletion failed (${res.status}): ${text}`);
  }
  const data = await res.json();
  return data.guests;
}

// GET GUESTS FOR EVENTID
export async function getGuests(eventId) {
  try {
    const session = await fetchAuthSession();
    const idToken = session.tokens?.idToken?.toString();
    if (!idToken) throw new Error("User is not signed in.");

    const response = await fetch(`${API_BASE}/guests?eventId=${eventId}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${idToken}`,
      },
    });
    if (!response.ok) {
      const text = await response.text();
      throw new Error(`API Error (${response.status}): ${text}`);
    }
    const data = await response.json();
    return data.guests || [];
  } catch (err) {
    console.error("Failed to load event:", err);
    throw err;
  }
}

// CREATE GUEST
export async function createGuest(guestsArray) {
  const session = await fetchAuthSession();
  const idToken = session.tokens?.idToken?.toString();
  if (!idToken) throw new Error("Not signed in");

  const res = await fetch(`${API_BASE}/guests`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${idToken}`,
    },
    body: JSON.stringify(guestsArray),
  });
  if (!res.ok) {
    let friendlyMsg = "Something went wrong while creating your event.";
    let errCode = "";
    try {
      const err = await res.json();
      // Map known API error codes to friendlier text
      switch (err.code) {
        case "GUESTS_PER_EVENT_LIMIT":
          friendlyMsg =
            "This event already has the maximum number of guests allowed for your plan. Please upgrade your plan to add more guests.";
          break;
        case "GUESTS_TOTAL_LIMIT":
          friendlyMsg =
            "You’ve reached the total guest limit across all events. Try deleting unused events or upgrade your plan.";
          break;
        case "Unauthorized":
          friendlyMsg = "Your session has expired. Please sign in again.";
          break;
        default:
          // fallback to API's message if available
          friendlyMsg = err.message || friendlyMsg;
      }
      errCode = err.code || "";
    } catch (e) {
      // fallback if response isn't valid JSON
      const text = await res.text();
      console.warn("Unparsed API error:", text);
    }
    // throw a structured error that UI can handle
    const error = new Error(friendlyMsg);
    error.code = errCode;
    error.status = res.status;
    throw error;
  }
  const data = await res.json();
  return Array.isArray(data.guests) ? data.guests : [];
}

// DELETE GUEST
export async function deleteGuest({ eventId, guestId }) {
  const session = await fetchAuthSession();
  const idToken = session.tokens?.idToken?.toString();
  if (!idToken) throw new Error("Not signed in");

  const res = await fetch(`${API_BASE}/guests`, {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${idToken}`,
    },
    body: JSON.stringify({ eventId, guestId }),
  });
  if (!res.ok) {
    const text = await res.text();
    throw new Error(`Deletion failed (${res.status}): ${text}`);
  }
  const data = await res.json();
  return data.guests;
}


// CANCEL SUBSCRIPTION
export async function cancelSubscription() {
  const session = await fetchAuthSession();
  const idToken = session.tokens?.idToken?.toString();

  const res = await fetch(`${API_BASE}/subscription/cancel`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${idToken}`,
    },
  });

  if (!res.ok) {
    const text = await res.text();
    throw new Error(`Cancel failed (${res.status}): ${text}`);
  }

  return res.json();
}
