import { ReceiptText } from "lucide-react";
import Link from "next/link";

export default function LandingPage() {
  return (
    <div className="flex flex-col min-h-screen bg-background text-foreground font-sans selection:bg-white selection:text-black">
      {/* Brutalist Header */}
      <header className="w-full flex justify-between items-start p-10 md:p-16 relative z-10 text-xs md:text-sm uppercase tracking-[0.2em] font-bold text-white/70">
        <div className="flex flex-col leading-tight">
          <span className="text-white">BILL</span>
          <span>TURBO</span>
        </div>
        
        <div className="flex gap-12 md:gap-24">
          <Link href="/login" className="hover:text-white transition-colors">LOGIN</Link>
          <Link href="/signup" className="hover:text-white transition-colors">SIGN UP</Link>
        </div>
      </header>

      {/* Hero Section - Stark Centered Typography */}
      <section className="flex-1 flex flex-col justify-center items-center text-center px-4 -mt-20">
        <span className="text-xs md:text-sm uppercase tracking-[0.3em] font-bold text-white/50 mb-6">WE ARE</span>
        <h1 className="text-7xl md:text-[10rem] font-black tracking-tighter leading-[0.8] mb-8 text-white">
          BILLTURBO
        </h1>
        <div className="flex flex-col items-center gap-2 text-xs md:text-sm uppercase tracking-[0.2em] font-bold text-white/50">
          <span>SIMPLIFIED</span>
          <span>INDIAN BILLING</span>
        </div>
        
        <div className="mt-32 w-[1px] h-24 bg-white/20 relative">
           <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-full text-[10px] uppercase tracking-[0.4em] text-white/30 rotate-90 origin-bottom mb-4">
              SCROLL
           </div>
        </div>
      </section>

      {/* Feature Section - Monochromatic Blocks */}
      <section className="py-32 px-10 md:px-16 border-t border-white/5 bg-[#171717]">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-start gap-16">
          <div className="flex flex-col">
            <span className="text-xs uppercase tracking-[0.3em] font-bold text-white/30 mb-8">.01</span>
            <h2 className="text-3xl md:text-5xl font-black tracking-tight mb-8">THE IDEA</h2>
            <p className="max-w-md text-sm leading-relaxed text-white/50">
              Indian vendors need a digital presence without the complexity of traditional payment gateways. We provide a stark, simple, and direct interface to generate bills and collect payments instantly via UPI.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 w-full max-w-2xl">
            <div className="aspect-square bg-[#121212] flex flex-col justify-center items-center p-8 border border-white/5 hover:border-white/20 transition-colors">
               <span className="text-4xl font-black mb-4 group-hover:scale-110 transition-transform">0%</span>
               <span className="text-xs uppercase tracking-[0.2em] font-bold text-white/50 text-center">TRANSACTION FEES</span>
            </div>
            <div className="aspect-square bg-[#121212] flex flex-col justify-center items-center p-8 border border-white/5 hover:border-white/20 transition-colors">
               <span className="text-4xl font-black mb-4 group-hover:scale-110 transition-transform">UPI</span>
               <span className="text-xs uppercase tracking-[0.2em] font-bold text-white/50 text-center">DIRECT SETTLEMENTS</span>
            </div>
          </div>
        </div>
      </section>

      {/* Contact / CTA Section matching the image's form style */}
      <section className="py-32 px-10 md:px-16 bg-[#1a1a1a]">
         <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between gap-24">
            <div className="flex flex-col flex-1">
               <span className="text-xs uppercase tracking-[0.3em] font-bold text-white/30 mb-8">.02</span>
               <h2 className="text-3xl md:text-5xl font-black tracking-tight mb-12">GET STARTED</h2>
               <p className="max-w-md text-sm leading-relaxed text-white/50 mb-16">
                 Join the minimalist revolution in billing. Create your shop profile, upload products, and start generating QR codes that pay directly into your bank account.
               </p>
               
               <div className="grid grid-cols-2 gap-8 mt-auto">
                  <div className="flex flex-col">
                     <span className="text-xs font-bold uppercase tracking-[0.2em] text-white mb-2">Location</span>
                     <span className="text-xs text-white/50 uppercase tracking-wider">Made in India</span>
                  </div>
                  <div className="flex flex-col">
                     <span className="text-xs font-bold uppercase tracking-[0.2em] text-white mb-2">Support</span>
                     <span className="text-xs text-white/50 uppercase tracking-wider">hello@billturbo.in</span>
                  </div>
               </div>
            </div>

            <div className="flex-1 bg-[#151515] p-12 lg:p-16 border border-white/5 shadow-[20px_20px_60px_#101010,-20px_-20px_60px_#202020]">
               <h3 className="text-xl font-bold uppercase tracking-[0.2em] mb-12">ACCOUNT DETAILS</h3>
               <div className="space-y-8">
                  <input 
                     type="text" 
                     placeholder="Your Name" 
                     className="w-full bg-transparent border-0 border-b border-white/10 p-4 text-sm focus:ring-0 focus:border-white transition-colors placeholder:text-white/30 uppercase tracking-wider" 
                  />
                  <input 
                     type="text" 
                     placeholder="Shop Name" 
                     className="w-full bg-transparent border-0 border-b border-white/10 p-4 text-sm focus:ring-0 focus:border-white transition-colors placeholder:text-white/30 uppercase tracking-wider" 
                  />
                  <input 
                     type="email" 
                     placeholder="Email Address" 
                     className="w-full bg-transparent border-0 border-b border-white/10 p-4 text-sm focus:ring-0 focus:border-white transition-colors placeholder:text-white/30 uppercase tracking-wider" 
                  />
                  
                  <Link href="/signup" className="inline-block mt-8">
                     <button className="bg-white text-black text-xs font-bold uppercase tracking-[0.2em] px-12 py-5 hover:bg-white/90 transition-colors">
                        CREATE ACCOUNT +
                     </button>
                  </Link>
               </div>
            </div>
         </div>
      </section>

      {/* Brutalist Footer */}
      <footer className="py-32 flex flex-col items-center justify-center text-center">
         <span className="text-[10px] uppercase tracking-[0.4em] font-bold text-white/30 mb-4">THE END</span>
         <h2 className="text-2xl font-bold uppercase tracking-[0.3em] mb-4">THANKS FOR SCROLLING!</h2>
         <span className="text-[10px] uppercase tracking-[0.2em] text-white/30">MADE FOR SCALE</span>
      </footer>
    </div>
  );
}
