import React from "react";
import ReactLoading from "react-loading";
import { Section, Title, Article, Prop, list1 } from "./generic";
import "./loading.css";

const Loading = () => (
  <Section>
    <Title></Title>
    {list1.map(l => (
      <Article key={l.prop}>

        <ReactLoading type={l.prop} color="#fff" />

        <Prop></Prop>
      </Article>
    ))}
  </Section>
);

export default Loading;