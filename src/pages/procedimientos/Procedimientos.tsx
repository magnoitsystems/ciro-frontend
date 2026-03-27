import WelcomeText from "../../components/WelcomeText/welcomeText.tsx";
import style from './Procedimientos.module.css';
import FilterButton from "../../components/Buttons/FilterButton/filterButton.tsx";
import Procedimiento from "../../components/Procedimiento/procedimiento.tsx";

export default function Procedimientos() {
    return(
        <main className={style.main}>
            <WelcomeText
                sectionText={'Acá todos los procedimientos internos'}
                className={'darkStyle'}
            />

            <div className={style.filters}>
                <FilterButton/>
            </div>

            <div className={style.procedimientosContainer}>
                <div className={style.columnNames}>
                    <p>Día</p>
                    <p>Mes</p>
                    <p>Año</p>
                    <p>D.N.I del paciente</p>
                    <p>Tipo de cirugía</p>
                    <p>Tipo de implante</p>
                    <p>Reimplante</p>
                    <p>Cantidad</p>
                </div>

                <Procedimiento/>
                <Procedimiento/>
                <Procedimiento/>
                <Procedimiento/>
                <Procedimiento/>
                <Procedimiento/>
            </div>
        </main>
    )
}