import { trpc } from "@utils/trpc";
import { useState } from "react";

const Home = () => {
  const [name, setName] = useState("");
  const test = trpc.addon.all.useQuery({
    limit: 50,
    search: name,
    // inFavorites: false,
    // officialOnly: false,
    // orderBy: {
    //   onlineSize: "asc",
    //   created_at: "desc",
    // },
  });
  console.log({ data: test.data, error: test.error });

  const sessionMut = trpc.session.add.useMutation();

  const onClick = async () => {
    const result = await sessionMut.mutateAsync({
      game_id: "63964fd8ff9e2d8649857828",
      settings: { use_images: true, use_nsfw: true, backlog_percentage: 0.85, timer_multiplier: 1, turn_multiplier: 1 },
    });

    console.info(result);
  };

  return (
    <>
      <input value={name} onChange={x => setName(x.target.value)}></input>
      <button onClick={onClick}>balls</button>
      {test.data && test.data.items.map(x => <div key={x.id}>{x.id} - {x.title}</div>)}
    </>
  );
};

export default Home;
