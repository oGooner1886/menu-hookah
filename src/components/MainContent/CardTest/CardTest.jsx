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
        return <Products item={item} onAdd={props.onAdd} key={item.uid}/>;
      })}
      {pasta.map((item) => {
        return <Products item={item} onAdd={props.onAdd} key={item.uid}/>;
      })}
      {lightSnacks.map((item) => {
        return <Products item={item} onAdd={props.onAdd} key={item.uid}/>;
      })}
      {poke.map((item) => {
        return <Products item={item} onAdd={props.onAdd} key={item.uid}/>;
      })}
      {hotDish.map((item) => {
        return <Products item={item} onAdd={props.onAdd} key={item.uid}/>;
      })}
      {soup.map((item) => {
        return <Products item={item} onAdd={props.onAdd} key={item.uid}/>;
      })}
      {snacks.map((item) => {
        return <Products item={item} onAdd={props.onAdd} key={item.uid}/>;
      })}
      {desserts.map((item) => {
        return <Products item={item} onAdd={props.onAdd} key={item.uid}/>;
      })}
      {iceCream.map((item) => {
        return <Products item={item} onAdd={props.onAdd} key={item.uid}/>;
      })}
      {milkshake.map((item) => {
        return <Products item={item} onAdd={props.onAdd} key={item.uid}/>;
      })}
      {smoothie.map((item) => {
        return <Products item={item} onAdd={props.onAdd} key={item.uid}/>;
      })}
      {coffee.map((item) => {
        return <Products item={item} onAdd={props.onAdd} key={item.uid}/>;
      })}
      {tea.map((item) => {
        return <Products item={item} onAdd={props.onAdd} key={item.uid}/>;
      })}
      {lemonade.map((item) => {
        return <Products item={item} onAdd={props.onAdd} key={item.uid}/>;
      })}
      {drink.map((item) => {
        return <Products item={item} onAdd={props.onAdd} key={item.uid}/>;
      })}
      {alcohol.map((item) => {
        return <Products item={item} onAdd={props.onAdd} key={item.uid}/>;
      })}
    </div>
  );
};

export default CardTest;

// props.salads.map((item)=>console.log(item))
