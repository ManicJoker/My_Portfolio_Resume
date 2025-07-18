 "use client"

import { useEffect, useState } from "react";

export default function Home() {
  const month = ["January","February","March","April","May","June","July","August","September","October","November","December"];
  const d = new Date()

  const thisMonth = month[d.getMonth()]
  const year = d.getFullYear()

  useEffect(() => {
    fetch('api/track', {
      method:"POST",
      body: JSON.stringify({"event": "resume click"}),
      header: {
        "Content-Type":"application/json"
      }
    }).catch(e => console.error(e))
  },[])

  const handleClick = () => {
    fetch('api/track', {
      method:"POST",
      body: JSON.stringify({"event": "resume click"}),
      header: {
        "Content-Type":"application/json"
      }
    })
  }
  return (
    <div className="min-h-screen bg-stone-400 flex flex-col item-center justify-center p-6 font-sans text-gray-800">
        <div className="max-w-xl w-full bg-white shadow-xl rounded-2xl p-8">
          <h1 className="text-3xl font-bold mb-2"><span className="text-orange-300">Wesley</span> Salesberry</h1>
          <p className="text-gray-600 mb-6">Analyst</p>
          <hr className="my-6 border-t" />
          <p className="mb-4">Lorem ipsum dolor sit amet, consectetur adipiscing elit. Aliquam pretium aliquam eros non luctus. Nunc eget orci pharetra, rutrum felis.</p>
          <a
            href="/wesley_resume.pdf"
            onClick={handleClick}
            className="inline-block mt-4 px-6 py-3 bg-neutral-600 hover:bg-neutral-700 text-white font-semibold rounded shadow"
          > 
           Resume Download
          </a>
          <hr className="my-6 border-t" />
          <p className="text-sm text-gray-500">
            {`Last updated on ${thisMonth} ${year} `}
          </p>
      </div>
    </div>
  );
}
