// import React from "react";

// const page = () => {
//   return (
//     <div>
//       <h1>Nandha</h1>
//     </div>
//   );
// };

// export default page;

"use client";
import { useEffect } from "react";
import styles from "./page.module.css";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";

export default function Home() {
  const router = useRouter();
  const { data: session } = useSession();

  useEffect(() => {
    if (typeof window !== "undefined") {
      if (session?.user?.message === "Login successful") {
        window.location.href = "/admin";
      } else {
        window.location.href = "/login";
      }
    }
  }, [router, session]);

  return (
    <main className={styles.main}>
      <p></p>
    </main>
  );
}
