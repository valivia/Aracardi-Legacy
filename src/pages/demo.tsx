import { trpc } from "@utils/trpc";
import { useState } from "react";

const Home = () => {
  const test = trpc.addon.all.useQuery({ limit: 50, game_id: "63964fd8ff9e2d8649857828" });
  console.log({ data: test.data, error: test.error });

  // const aa = trpc.addon.get.useQuery({ id: "6399fd1cd8ab85e0236be580" });
  // console.log(aa);

  const [name, setName] = useState("");

  const addonmut = trpc.addon.add.useMutation();

  const onClick = async () => {
    const result = await addonmut.mutateAsync({ title: name, description: "hoot hoot! :)", game_id: "63964fd8ff9e2d8649857828" });
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
