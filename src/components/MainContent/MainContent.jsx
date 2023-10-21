import React, { useState } from "react";

import store from "../state_actual.json";

// import Card from "./Card/Card";
import CardTest from "./CardTest/CardTest";
import styles from "./MainContent.module.css";
export default function MainContent() {
  const [state] = useState(store.products);
 
  return (
    <main>
      {state.map((item) => {
        return <CardTest item={item}/>;
        
        
      })}
    </main>
  );
}
