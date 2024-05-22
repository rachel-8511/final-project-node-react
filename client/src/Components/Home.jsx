import React, { useState } from 'react';
import { useSpring, animated } from 'react-spring';

const Home=()=>{
   const images = [
      "./a.jpg", "./b.jpg", "./c.jpg", "./d.jpg"
   ]
   const [index, setIndex] = useState(0);
   const props = useSpring({
       opacity: 1,
       from: { opacity: 0.85 },
       reset: true,
       config: { duration: 3000 },
       onRest: () => setIndex((index + 1) % images.length),
   });
   
   return (
       <div>
         <br></br>
           <div style={{ height: "", opacity: "80%",marginTop:"100px" }}>
           <animated.div style={props}>
               <img src={images[index]} width="100%" alt={`${index + 1}`} />
           </animated.div></div>
           <div style={{ backgroundColor: "#C08F48", height: "5px" }}></div>
           <div style={{ width: '100%', marginTop: '0px', padding: '0px' }}>
                <img src={'h1.png'} width="100%" alt={`${index + 1}`} />
            </div>
            <div style={{ width: '100%', marginTop: '0px',bottom: '0', padding: '0px',border:'none' }}>
                <img src={'h2.png'} width="100%"  alt=""/>
            </div>
            <div style={{ width: '100%',marginTop: '0px', padding: '0px',border:'none' }}>
                <img src={'h3.png'} width="100%"  alt=""/>
            </div>

       </div>
   )
}
export default Home
