export default function CodePanel({code}) {
  return (

   <div className="h-56 bg-black/80 backdrop-blur-md border-t border-white/10 p-3 overflow-y-auto">

      <div> {code}</div>

    </div>

  );

}