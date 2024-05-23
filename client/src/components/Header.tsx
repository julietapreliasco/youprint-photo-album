import "../App.css"

export const Header = () => {
  return (
    <header className="flex px-5 md:px-16 py-4 bg-slate-100 w-full text-3xl justify-between">
      <h1 className="font-semibold text-base sm:text-xl md:text-3xl self-center text-center">Ordena tus fotos</h1>
      <img className="w-20 md:w-32" src="static/youprint-logo.png" alt="youprint-logo" />
    </header>
  )
}
