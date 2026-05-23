import BloodCompatibility from "@/components/BloodCompatibility";
import CallToAction from "@/components/CallToAction";
import Footer from "@/components/Footer";
import Hero from "@/components/Hero";
import Navbar from "@/components/Navbar";
import State from "@/components/State";
import WhyChoose from "@/components/WhyChoose";

export default function Home() {
  return (
   <>
   <Navbar/>
   <Hero/>
   {/* <State/> */}
   <WhyChoose/>
   <BloodCompatibility/>
   <CallToAction/>
   <Footer/>
   </>
  );
}
