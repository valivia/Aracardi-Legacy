import { useState } from "react";
import { trpc } from "@utils/trpc";
import type { GetServerSideProps } from "next";

export default function AboutPage() {
  const [code, setCode] = useState("");
  const join = trpc.mockJoin.get.useMutation();
  trpc.randomNumber.useSubscription(undefined, {
    onStarted() {
      console.log("started");
    },
    onData(n) {
      console.log(n);
    },
    onError(err) {
      console.error("Subscription error:", err);
    },
  });

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        join.mutate({ join_code: code });
      }}
    >
      <label>Room code</label>
      <input type="text" onChange={(e) => setCode(e.target.value)} />
      <button type="submit">Join room</button>
    </form>
  );
}

// TODO: Remove mockup cookie generation, replace with actual auth
export const getServerSideProps: GetServerSideProps = async ({ res }) => {
  res.setHeader("set-cookie", `sessionId=${Math.random().toString(36).substring(7)}; path=/; samesite=lax; httponly;`);

  return {
    props: {},
  };
};
