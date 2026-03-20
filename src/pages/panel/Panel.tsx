import WelcomeText from "../../components/WelcomeText/welcomeText.tsx";

export default function Panel() {
    return(
        <main>
            <WelcomeText
                sectionText={'Acá el resumen del día de hoy.'}
                className={'lightStyle'}
            />
        </main>
    )
}