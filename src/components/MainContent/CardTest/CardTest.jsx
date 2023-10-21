import React from "react";
import style from "./CardTest.module.css";

import Products from "./Products/Products";
const CardTest = (props) => {
  const salads = props.item.salads;
  const pasta = props.item.pasta;
  const lightSnacks = props.item.lightSnacks;
  const poke = props.item.poke;
  const hotDish = props.item.hotDish;
  const soup = props.item.soup;
  const snacks = props.item.snacks;
  const desserts = props.item.desserts;
  const iceCream = props.item.iceCream;
  const milkshake = props.item.milkshake;
  const smoothie = props.item.smoothie;
  const coffee = props.item.coffee;
  const tea = props.item.tea;
  const lemonade = props.item.lemonade;
  const drink = props.item.drink;
  const alcohol = props.item.alcohol;

  return (
    <div className={style.wrapper}>
      {salads.map((item) => {
        return <Products item={item} />;
      })}
      {pasta.map((item) => {
        return <Products item={item} />;
      })}
      {lightSnacks.map((item) => {
        return <Products item={item} />;
      })}
      {poke.map((item) => {
        return <Products item={item} />;
      })}
      {hotDish.map((item) => {
        return <Products item={item} />;
      })}
      {soup.map((item) => {
        return <Products item={item} />;
      })}
      {desserts.map((item) => {
        return <Products item={item} />;
      })}
      {iceCream.map((item) => {
        return <Products item={item} />;
      })}
      {milkshake.map((item) => {
        return <Products item={item} />;
      })}
      {smoothie.map((item) => {
        return <Products item={item} />;
      })}
      {coffee.map((item) => {
        return <Products item={item} />;
      })}
      {tea.map((item) => {
        return <Products item={item} />;
      })}
      {lemonade.map((item) => {
        return <Products item={item} />;
      })}
      {drink.map((item) => {
        return <Products item={item} />;
      })}
      {alcohol.map((item) => {
        return <Products item={item} />;
      })}
    </div>
  );
};

export default CardTest;

// props.salads.map((item)=>console.log(item))
