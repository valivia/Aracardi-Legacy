import { Button } from "@components/input/button";
import { Select } from "@components/input/select";
import { SelectGroup, SelectItem } from "@radix-ui/react-select";
import { NextPage } from "next";
import React from "react";

const Demo: NextPage = () => {
  const [value, setValue] = React.useState("foo");

  return (
    <>
      <Button>nuts</Button>
      <Select
        defaultValue={value}
        value={value}
        items={[
          { label: "foo", value: "foo", disabled: false },
          { label: "bar", value: "bar", disabled: true },
          { label: "baz", value: "baz", disabled: false },
          { label: "qux", value: "qux", disabled: false },
          { label: "kuux", value: "kuux", disabled: false },
        ]}
        onValueChange={setValue}
      />

      <Button>nuts</Button>
    </>
  );
};

export default Demo;
