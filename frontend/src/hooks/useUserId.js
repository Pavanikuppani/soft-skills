import { useState, useEffect } from "react";
import { v4 as uuidv4 } from "uuid";

const USER_ID_KEY = "interview_coach_user_id";

/**
 * Returns a stable userId stored in sessionStorage.
 * Generates a new one if none exists.
 */
export function useUserId() {
  const [userId, setUserId] = useState(() => {
    const stored = sessionStorage.getItem(USER_ID_KEY);
    if (stored) return stored;
    const id = uuidv4();
    sessionStorage.setItem(USER_ID_KEY, id);
    return id;
  });

  return userId;
}
