import { trpc } from "@utils/trpc";
import { useState } from "react";

const Home = () => {
  const [name, setName] = useState("");

  const test = trpc.addon.all.useQuery({ limit: 50, game_id: "63964fd8ff9e2d8649857828" });
  // console.log({ data: test.data, error: test.error });

  const JOIN_CODE = name;

  const getByJoinCodeResult = trpc.session.getByJoinCode.useQuery({
    join_code: JOIN_CODE,
  });

  console.log(getByJoinCodeResult.data);

  // const aa = trpc.addon.get.useQuery({ id: "6399fd1cd8ab85e0236be580" });
  // console.log(aa);

  const sessionMut = trpc.session.add.useMutation();
  const joinMut = trpc.session.join.useMutation();

  const onClick = async () => {
    const sessionCreateResult = await sessionMut.mutateAsync({
      game_id: "63964fd8ff9e2d8649857828",
      settings: { use_images: true, use_nsfw: true, backlog_percentage: 0.85, timer_multiplier: 1, turn_multiplier: 1 },
    });

    console.info({ sessionCreateResult });
  };

  const joinDemoOnClick = async () => {
    const joinResult = await joinMut.mutateAsync({
      join_code: name,
      player: {
        name: "John",
        avatar: "some-avatar" + Math.random(),
      },
    });

    console.log({ joinResult, getByJoinCodeResult });
  };

  return (
    <>
      <input value={name} onChange={x => setName(x.target.value)}></input>
      <button onClick={onClick}> Create Session Mutation </button>
      <button onClick={joinDemoOnClick}> Join Player Mutation </button>

      {test.data && test.data.items.map(x => <div key={x.id}>{x.id} - {x.title}</div>)}
    </>
  );
};

export default Home;
