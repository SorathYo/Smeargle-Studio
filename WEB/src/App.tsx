import SmeargleIcon from './assets/Smeargle_Icon.png';
import ManchasIcon from './assets/Manchas_De_Tinta.png';

function App() {

  return (
    <div className="flex items-center justify-center h-screen ">
      <div className="w-150 rounded-2xl overflow-hidden shadow-lg">
        {/* Topo */}
        <div className="bg-smeargle-brown p-4 text-left relative">
          <div className="flex items-center justify-start gap-2">
            <img
              src={SmeargleIcon}
              alt="Ícone Smeargle"
              className="w-20 h-20"
            />
            <div>
              <h1 className="titulo text-4xl text-white font-bold">
                Smeargle Color
              </h1>
              <p className="font-sans text-base text-[#D4A058]">
                Seletor de cores do artista
              </p>

              <img
                src={ManchasIcon}
                alt="Manchas de tinta"
                className="mt-2 w-auto h-5 rounded"
              />
            </div>
          </div>


          {/* Barra inferior com blocos de cor */}
          <div className="absolute bottom-0 left-0 w-full h-2 flex">
            <div className="flex-1 bg-[#C9B39B]"></div>
            <div className="flex-1 bg-[#885B39]"></div>
            <div className="flex-1 bg-[#6E8E4C]"></div>
            <div className="flex-1 bg-[#988B77]"></div>
            <div className="flex-1 bg-[#AA6949]"></div>
          </div>
        </div>

        {/* Barra de navegação */}
        <div className="flex bg-smeargle-cream text-sm font-semibold text-smeargle-dark">
          <button className="flex-1 py-2 text-center hover:bg-smeargle-brown transition">
            Imagem
          </button>
          <button className="flex-1 py-2 text-center hover:bg-smeargle-brown transition">
            Personalização
          </button>
        </div>

        {/* Conteúdo */}
        <div className="bg-smeargle-cream p-6 text-center text-sm text-smeargle-dark">
          Conteúdo
        </div>
      </div>
    </div>)
}

export default App
