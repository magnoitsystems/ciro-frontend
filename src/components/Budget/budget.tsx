import WelcomeText from '../WelcomeText/welcomeText';
import BudgetInfo from './BubgetInfo/budgetInfo';
import styles from './budget.module.css';
import { useState } from 'react';
import NewBudget from './NewBudget/newBudget';

export default function Budget() {
    const [showFormBudget, setShowFormBudget] = useState(false);

    return (
        <div className={styles.budget}>
            <WelcomeText sectionText='Aca los presupuestos' className=''></WelcomeText>
            <div className={styles.budgetContentProperties}>

                {!showFormBudget ? (
                    <div className={styles.tableContainerPropeties}>
                        <BudgetInfo archivo={{ nombre: 'archivo1.png', estado: 'enviado' }} ></BudgetInfo>
                    </div>
                ): (
                    <div className={styles.tableContainerPropeties}>
                        <NewBudget></NewBudget>
                    </div>
                )}

                <div className={styles.buttonContainerProperties}>
                    <button onClick={() => setShowFormBudget(!showFormBudget)}>
                        <img src='/icons/bigRight.png'></img>
                    </button>
                    <span>{!showFormBudget ? 'Cargar presupuesto' : 'Ver presupuestos'}</span>
                </div>
            </div>
        </div>
    );
}