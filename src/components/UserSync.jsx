import { useUser } from "@clerk/clerk-react";
import { useEffect } from "react";

export default function UserSync() {

  const { user } = useUser();

  useEffect(() => {

    if (user) {

      console.log("User detected:", user);

      fetch("http://localhost:5000/api/save-user", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          clerkId: user.id,
          email: user.primaryEmailAddress?.emailAddress,
          name: user.fullName
        })
      })
      .then(res => res.json())
      .then(data => console.log("Saved:", data))
      .catch(err => console.error(err));

    }

  }, [user]);

  return null;
}