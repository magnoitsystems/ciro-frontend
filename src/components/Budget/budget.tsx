import WelcomeText from '../WelcomeText/welcomeText';
import BudgetInfo from './BubgetInfo/budgetInfo';
import styles from './budget.module.css';
import { useEffect, useState } from 'react';
import NewBudget from './NewBudget/newBudget';
import { budgetService } from '../../services/budget.service';
import type { BudgetResponseDTO } from '../../types/budgets.types';
import Patient from '../../patients/patient';

export default function Budget() {
    const [showFormBudget, setShowFormBudget] = useState(false);
    const [showPatientForm, setShowPatientForm] = useState(false);
    const [budgets, setBudgets] = useState<BudgetResponseDTO[]>([]); // Aquí podrías almacenar los presupuestos obtenidos de la API

    useEffect(() => {
        budgetService.findAll()
            .then(fetchedBudgets => setBudgets(fetchedBudgets))
            .catch(error => console.error('Error fetching budgets:', error));
    }, []);

    return (
        <div className={styles.budget}>
            <WelcomeText sectionText='Aca los presupuestos' className=''></WelcomeText>
             {showPatientForm && (
                            <div>
                                <Patient onNuevoPacienteClick={() => setShowPatientForm(false)}></Patient>
                            </div>
                        )}
            <div className={styles.budgetContentProperties}>

                {!showFormBudget ? (
                        <div className={styles.tableContainerPropeties}>
                            <BudgetInfo budgets={budgets}></BudgetInfo>
                        </div>
                  

                ) : (
                    <div className={styles.tableContainerPropeties}>
                        <NewBudget onNuevoPacienteClick={() => setShowPatientForm(true)}></NewBudget>
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