import React from 'react'

const OrderEditionsOption = ({el}) => {
    console.log(el);
    
  return (
    <option>
      {el.weight}
    </option>
  )
}

export default OrderEditionsOption
