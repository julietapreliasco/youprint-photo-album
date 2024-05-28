import '../App.css';

export const Header = () => {
  return (
    <header className="flex w-full justify-between bg-slate-100 px-5 py-4 text-3xl md:px-16">
      <h1 className="self-center text-center text-base font-semibold sm:text-xl md:text-3xl">
        Ordena tu Fotolibro
      </h1>
      <img
        className="w-20 md:w-32"
        src={`${import.meta.env.VITE_PUBLIC_URL}/youprint-logo.png`}
        alt="youprint-logo"
      />
    </header>
  );
};
