import style from './Proveedores.module.css';
import WelcomeText from "../../components/WelcomeText/welcomeText.tsx";
import NewProvForm from "../../components/Forms/NewProvForm/newProvForm.tsx";

export default function Proveedores() {
    return(
        <main className={style.main}>
            <WelcomeText
                sectionText={'Acá la administración de proveedores'}
                className={'darkStyle'}
            />

            <div className={style.content}>
                <div className={style.newProvForm}>
                    <NewProvForm/>
                </div>

                <div className={style.seeMore}>
                    <img src={'/icons/bigRight.png'}/>
                    <h6>Ver listado de todos los proveedores</h6>
                </div>
            </div>
        </main>
    )
}