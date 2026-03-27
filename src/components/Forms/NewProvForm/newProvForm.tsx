import { useState } from "react";
import style from './NewProvForm.module.css';
import ProvInput from "./ProvInput";
import GreenFormButton from "../../Buttons/GreenFormButton/greenFormButton";

export default function NewProvForm() {
    const [step, setStep] = useState(1);

    const handleNext = (e: React.MouseEvent) => {
        e.preventDefault();

        if (step === 1) {
            setStep(2);
        } else {
            console.log("CONFIRMAR FORM");
        }
    };

    return(
        <main className={style.formContainer}>
            <p>Crear nuevo proveedor</p>

            <form className={style.form}>

                {step === 1 && (
                    <>
                        <ProvInput type="text" placeholder="Nombre y apellido" className={'inputBoxDefault'}/>

                        <div className={style.sharedInputs}>
                            <ProvInput type="text" placeholder="Dirección" className={'inputBoxDefault'}/>
                            <ProvInput type="text" placeholder="Localidad" className={'inputBoxDefault'}/>
                        </div>

                        <ProvInput type="text" placeholder="IVA" className={'inputBoxDefault'}/>
                        <ProvInput type="text" placeholder="Teléfono" className={'inputBoxDefault'}/>

                        <div className={style.sharedInputs}>
                            <ProvInput type="text" placeholder="E-Mail" className={'inputBoxDefault'}/>

                            <GreenFormButton
                                text={step === 1 ? "Siguiente" : "Confirmar"}
                                onClick={handleNext}
                            />
                        </div>
                    </>
                )}

                {step === 2 && (
                    <>
                        <div className={style.sharedInputs}>
                            <ProvInput type="text" placeholder="Tipo de documento" className={'inputBoxDefault'}/>
                            <ProvInput type="text" placeholder="Número de documento" className={'inputBoxDefault'}/>
                        </div>

                        <ProvInput type="text" placeholder="Observaciones" className={'inputBoxBig'}/>

                        <div className={style.sharedInputs}>
                            <ProvInput placeholder="Orden para importar artículos por excel" type="text" className={'inputBoxDefault'}/>

                            <GreenFormButton
                                text="Confirmar"
                                onClick={handleNext}
                            />
                        </div>
                    </>
                )}

                {/* BOTONES */}
                <div className={style.actions}>
                    {step === 2 && (
                        <span
                            className={style.back}
                            onClick={() => setStep(1)}
                        >
                            ← Volver atrás
                        </span>
                    )}
                </div>

            </form>
        </main>
    )
}