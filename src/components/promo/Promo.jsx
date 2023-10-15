import React from 'react'
import style from './Promo.module.css'
import video from '../../assets/videos/promo1.MP4'

const Promo = () => {
  return (
    <div>
      <video className={style.video} loop muted autoPlay preload='auto' >
        <source src={video} type='video/mp4'/>
        {/* <source src='../../assets/videos/promo1.webm' type='video/webm'/> */}
      </video>
      
    </div>
  )
}

export default Promo
