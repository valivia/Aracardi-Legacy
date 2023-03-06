import { AccordionItem } from "@components/dashboard/accordion";
import { Button } from "@components/input/button";
import { Select } from "@components/input/select";
import { Slider } from "@components/input/slider";
import { Switch } from "@components/input/switch";
import { TextInput } from "@components/input/text_input";
import { Root } from "@radix-ui/react-accordion";
import { NextPage } from "next";
import React from "react";

const Demo: NextPage = () => {
  const [selection, setSelection] = React.useState("foo");
  const [switchValue, setSwitchValue] = React.useState(false);
  const [sliderValue, setSliderValue] = React.useState([0, 100]);
  const [slider2Value, setSlider2Value] = React.useState([0]);

  return (
    <div style={{ padding: "20px" }}>
      <h1>Demo</h1>
      {/* Select */}
      <section>
        <h2>Select</h2>
        <div style={{ display: "flex" }}>
          <Button>Weewoo</Button>
          <Button variant="secondary">Button</Button>
          <Select
            defaultValue={selection}
            value={selection}
            items={[
              { label: "foo", value: "foo", disabled: false },
              { label: "bar", value: "bar", disabled: true },
              { label: "baz", value: "baz", disabled: false },
              { label: "qux", value: "qux", disabled: false },
              { label: "kuux", value: "kuux", disabled: false },
            ]}
            onValueChange={setSelection}
          />
          <TextInput placeholder="Weewoo" />
        </div>
        <div style={{ display: "flex", flexDirection: "column" }}>
          <div style={{ display: "inline-flex" }}>
            {sliderValue.map((v, i) => <p key={i}>{v}-</p>)}
          </div>

          <Slider
            max={100}
            min={0}
            step={1}
            value={sliderValue}
            onValueChange={setSliderValue}
          />

          <div style={{ display: "inline-flex" }}>
            {slider2Value.map((v, i) => <p key={i}>{v}-</p>)}
          </div>

          <Slider

            max={300}
            min={0}
            step={5}
            value={slider2Value}
            onValueChange={setSlider2Value}
          />

        </div>
      </section>
      {/* Switch */}
      <section>
        <h2>Switch</h2>
        <Switch
          value={switchValue}
          onChange={() => setSwitchValue(a => !a)}
          name="switch"
        />
      </section>
      {/* Accordion */}
      <section>
        <h2>Accordion</h2>

        <h3>Multiple</h3>
        <Root type="multiple">
          <AccordionItem title="Item 1">
            <p>Item 1 content</p>
          </AccordionItem>
          <AccordionItem title="Item 2">
            <p>Item 2 content</p>
          </AccordionItem>
          <AccordionItem title="Item 3">
            <p>Item 3 content</p>
          </AccordionItem>

        </Root>
        <h3>Single</h3>
        <Root type="single">
          <AccordionItem title="Item 1">
            <p>Item 1 content</p>
          </AccordionItem>
          <AccordionItem title="Item 2">
            <p>Item 2 content</p>
          </AccordionItem>
          <AccordionItem title="Item 3">
            <p>Item 3 content</p>
          </AccordionItem>

        </Root>
      </section>

    </div>
  );
};

export default Demo;
