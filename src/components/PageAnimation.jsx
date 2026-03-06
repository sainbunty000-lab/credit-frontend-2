import { motion } from "framer-motion";

export default function PageAnimation({children}){

return(

<motion.div
initial={{x:100,opacity:0}}
animate={{x:0,opacity:1}}
exit={{x:-100,opacity:0}}
transition={{duration:0.3}}
>

{children}

</motion.div>

)

}
