import Image from "next/image";

export default function Home() {
  return (
    <div className="h-fit w-full bg-gradient-to-br from-indigo-50 via-white to-cyan-100 flex flex-col justify-center items-center">
      <div className="w-1/3 mt-[100px]">
        <h1 className="text-center font-bold text-2xl text-stone-600 ">
          Acme Brand
        </h1>
        <h1
          className="animate-fade-up bg-gradient-to-br from-black to-stone-400 bg-clip-text text-center font-display text-3xl font-bold tracking-[-0.02em] text-transparent opacity-0 drop-shadow-sm [text-wrap:balance] md:text-5xl md:leading-[5rem]"
          style={{ animationDelay: "0.15s", animationFillMode: "forwards" }}
        >
          Connecting problems with thinkers
        </h1>
        <p className="my-3 text-center text-stone-600">
          A tool to help you find your next project - with impact.
        </p>
      </div>

      <div className="flex flex-row justify-center space-x-3 text-stone-700 w-1/2">
        <div className="border-1 border black bg-slate-100 rounded-xl p-4 shadow-lg mt-5 w-1/3">
          <h1 className="font-bold mb-2">Step 1 📝</h1>
          <p>
            Start by selecting your skills and what you want to work on, or by
            submitting a problem you have that needs solving.
          </p>
        </div>
        <div className="border-1 border black bg-slate-100 rounded-xl p-4 shadow-lg mt-5 w-1/3">
          <h1 className="font-bold mb-2">Step 2 🔗</h1>
          <p>
            Get matched with someone whose problem matches your skillset! This
            can anyone from a researcher to an electronics engineer to an
            entrepreneur.
          </p>
        </div>
        <div className="border-1 border black bg-slate-100 rounded-xl p-4 shadow-lg mt-5 w-1/3">
          <h1 className="font-bold mb-2">Step 3 🚀</h1>
          <p>
            Collaborate and work together to solve the problem - and ship a
            meaningful project.
          </p>
        </div>
      </div>

      <a
        href="/login"
        className="relative inline-block px-6 text-stone-600 bg-opacity-100 py-3 border-1 border text-xl font-semibold rounded-xl shadow-lg mt-14 bg-gradient-to-r from-indigo-50 via-slate-50 to-cyan-50 animate-gradient-x"
      >
        Get Started
      </a>

      <h1 className="w-1/2 text-center mt-14 text-stone-600 text-2xl font-semibold">
        Featured collaborations
      </h1>
      <div className="flex flex-row justify-center space-x-3 text-stone-700 w-1/2">
        <div className="border-1 border black bg-slate-100 rounded-xl p-4 shadow-lg mt-5 w-1/2">
          <h1 className="font-bold mb-2">James x Prof. Hojnowski</h1>
          <Image
            src="/james-hojnowski.png"
            alt="James and Prof. Hojnowski"
            width={200}
            height={200}
            className="w-fit h-full rounded-lg m-4"
          />
          <p>
            Start by selecting your skills and what you want to work on, or by
            submitting a problem you have that needs solving.
          </p>
        </div>
        <div className="border-1 border black bg-slate-100 rounded-xl p-4 shadow-lg mt-5 w-1/2">
          <h1 className="font-bold mb-2">Step 2 🔗</h1>
          <p>
            Get matched with someone whose problem matches your skillset! This
            can anyone from a researcher to an electronics engineer to an
            entrepreneur.
          </p>
        </div>
      </div>
    </div>
  );
}
