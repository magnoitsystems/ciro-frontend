import WelcomeText from '../WelcomeText/welcomeText';
import BudgetInfo from './BubgetInfo/budgetInfo';
import styles from './budget.module.css';
import { useEffect, useState } from 'react';
import NewBudget from './NewBudget/newBudget';
import { budgetService } from '../../services/budget.service';
import type { BudgetResponseDTO } from '../../types/budgets.types';
import Patient from '../patients/patient';
import DeleteConfirmCard from '../DeleteConfirmCard/deleteConfirmCard';
import { useNavigate } from 'react-router-dom';

export default function Budget() {
    const navigate = useNavigate()
    const [showFormBudget, setShowFormBudget] = useState(false);
    const [showPatientForm, setShowPatientForm] = useState(false);
    const [budgets, setBudgets] = useState<BudgetResponseDTO[]>([]);
    const [deleteCard, setDeleteCard] = useState(false)
    const [editCard, setEditCard] = useState(false)
    const [idCard, setIdCard] = useState(-1)
    const [budget, setBudget] = useState<BudgetResponseDTO>()

    useEffect(() => {
        budgetService.findAll()
            .then(fetchedBudgets => setBudgets(fetchedBudgets))
            .catch(error => console.error('Error fetching budgets:', error));
    }, []);

    /**
     * 
     *  const getBudget = async () => {
            try {
                await budgetService.f
            }
            catch (error) {
                console.log(error)
            }
        }
     * 
     */

    const deleteBudget = async () => {
        try {
            await budgetService.deleteBudget(idCard)
            navigate('/budget')
        }
        catch (error) {
            console.log(error)
        }
    }

    return (
        <div className={styles.budget}>
            {deleteCard && (
                <DeleteConfirmCard component='el presupuesto' onClose={() => setDeleteCard(false)} onAcceptButtonClick={() => deleteBudget}></DeleteConfirmCard>
            )}
            <WelcomeText sectionText='Aca los presupuestos' className=''></WelcomeText>
            {showPatientForm && (
                <div>
                    <Patient onNuevoPacienteClick={() => setShowPatientForm(false)}></Patient>
                </div>
            )}
            <div className={styles.budgetContentProperties}>

                {!showFormBudget && !editCard ? (
                    <div className={styles.tableContainerPropeties}>
                        <BudgetInfo budgets={budgets} onDeletelick={(id) => { setDeleteCard(true), setIdCard(id) }} onEditBudget={(id) => { setIdCard(id), setEditCard(true) }} ></BudgetInfo>
                    </div>
                ) : (
                    editCard ? (
                        <NewBudget type='edit' id={idCard} onNuevoPacienteClick={() => setShowPatientForm(true)}></NewBudget>
                    ) : (
                        <div className={styles.tableContainerPropeties}>
                            <NewBudget type='create' onNuevoPacienteClick={() => setShowPatientForm(true)}></NewBudget>
                        </div>
                    )
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