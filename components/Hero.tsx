"use client";
import Image from "next/image";
import { CustomButton } from ".";


const Hero = () => {
    const handleScroll = () =>{
      const nextSection = document.getElementById("discover");
      if (nextSection) {
        nextSection.scrollIntoView({ behavior: "smooth" });
      }
    }

  return (
    <div className="hero">
        <div className="flex-1 pt-36 padding-x">
            <h1 className="hero__title">
                The Best Place To Find, or Rent a Car!
            </h1>
            <p className="hero__subtitle">Streamline your car rental experience
             with our effortless booking process
            </p>
            <CustomButton
            title="Explore Cars"
            containerStyles="bg-black text-white rounded-full mt-10 hover:bg-cyan-900 focus-within:shadow-lg "
            handleClick={handleScroll}
            />
        </div>
        <div className="hero__image-container">
        <div className="hero__image">
             <Image src="/hero.svg" alt="hero" fill className="object-contain"/> 
        </div>
        </div>
       
    </div>
  )
}

export default Hero