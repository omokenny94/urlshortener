import ShortenForm from "./forms/ShortenForm";


export default function HeroSection() {

   return (
      <section
         className="py-12 px-4 bg-white">
         <div className="max-w-7xl mx-auto">


            <div className="grid min-h-screen lg:grid-cols-2 gap-16 lg:gap-12 mt-6  items-center">
               <div>
                  <h1 className="text-slate-900 text-4xl font-bold !leading-tight md:text-5xl lg:text-6xl dark:text-slate-50 uppercase">Shorten your URLs and track analytics with ease.</h1>

                  <p className="text-slate-600 text-lg leading-relaxeddark:text-slate-400 font-bold ">Create and track shorter, more manageable links and QR codes, for your website or social media posts.</p>


               </div>

               <div className="border-4 border-black border-solid p-10">
                  <ShortenForm />
               </div>
            </div>
         </div>
      </section>
   );
}