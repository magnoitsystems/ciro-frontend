import WelcomeText from "../../components/WelcomeText/welcomeText.tsx";
import style from './Pacientes.module.css';
import SearchBar from "../../components/SearchBar/searchBar.tsx";

export default function Pacientes() {
    return(
        <main className={style.main}>
            <WelcomeText
                sectionText={'Acá el listado de los pacientes existentes.'}
                className={'lightStyle'}
            />

            <div className={style.functionalities}>
                <div className={style.searchBar}>
                    <SearchBar
                        text={'Buscá por Nombre/Apellido'}
                    />
                </div>

                <div className={style.secondFunctionalities}>
                    <div className={style.estadistics}>
                        <img src={'/icons/estadistics.png'} alt={'estadistics image'}/>
                    </div>

                    <div className={style.newPacient}>
                        <img src={'/icons/plus.png'} alt={'plus image'}/>
                    </div>

                    <div className={style.filter}>
                    </div>

                </div>
            </div>
        </main>
    )
}