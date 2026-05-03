import WelcomeText from '../WelcomeText/welcomeText';
import BudgetInfo from './BubgetInfo/budgetInfo';
import styles from './budget.module.css';
import { useEffect, useState } from 'react';
import NewBudget from './NewBudget/newBudget';
import { budgetService } from '../../services/budget.service';
import type { BudgetResponseDTO } from '../../types/budgets.types';
import Patient from '../patients/patient';
import DeleteConfirmCard from '../DeleteConfirmCard/deleteConfirmCard';

export default function Budget() {
    const [showFormBudget, setShowFormBudget] = useState(false);
    const [showPatientForm, setShowPatientForm] = useState(false);
    const [budgets, setBudgets] = useState<BudgetResponseDTO[]>([]);
    const [deleteCard, setDeleteCard] = useState(false);
    const [editCard, setEditCard] = useState(false);
    const [idCard, setIdCard] = useState(-1);
    const [budget, setBudget] = useState<BudgetResponseDTO>();

    const fetchBudgets = () => {
        budgetService.findAll()
            .then(fetchedBudgets => setBudgets(fetchedBudgets))
            .catch(error => console.error('Error fetching budgets:', error));
    };
    
    useEffect(() => {
        fetchBudgets();
    }, []);


    const onEditBudget = async (id: number) => { 
        setIdCard(id);
        try {
            const fetchedBudget = await budgetService.findById(id);
            setBudget(fetchedBudget);
            setEditCard(true); 
        } catch (error) {
            console.error(error);
        }
    };

    const deleteBudget = async () => {
        try {
            await budgetService.deleteBudget(idCard);
            setBudgets(budgets.filter(b => b.id !== idCard));
            setDeleteCard(false);
        }
        catch (error) {
            console.log(error);
        }
    };

    const handleSuccess = () => {
        setShowFormBudget(false);
        setEditCard(false);       
        fetchBudgets();
    };

    return (
        <div className={styles.budget}>
            {deleteCard && (
                <DeleteConfirmCard 
                    component='el presupuesto' 
                    onClose={() => setDeleteCard(false)} 
                    onAcceptButtonClick={() => deleteBudget()}
                />
            )}
            
            <WelcomeText sectionText='Aca los presupuestos' className='' />
            
            {showPatientForm && (
                <div>
                    <Patient onNuevoPacienteClick={() => setShowPatientForm(false)} />
                </div>
            )}
            
            <div className={styles.budgetContentProperties}>

                {!showFormBudget && !editCard ? (
                    <div className={styles.tableContainerPropeties}>
                        <BudgetInfo 
                            budgets={budgets} 
                            onDeletelick={(id) => { setDeleteCard(true); setIdCard(id); }} 
                            onEditBudget={(id) => onEditBudget(id)} 
                        />
                    </div>
                ) : (
                    editCard ? (
                        <NewBudget 
                            budget={budget} 
                            type='edit' 
                            id={idCard} 
                            onNuevoPacienteClick={() => {setShowPatientForm(true)}} 
                            onSuccess={handleSuccess} 
                        />
                    ) : (
                        <div className={styles.tableContainerPropeties}>
                            <NewBudget 
                                type='create' 
                                onNuevoPacienteClick={() => setShowPatientForm(true)} 
                                onSuccess={handleSuccess}
                            />
                        </div>
                    )
                )}

                <div className={styles.buttonContainerProperties}>
                    <button onClick={() => { setShowFormBudget(!showFormBudget); setEditCard(false); }}>
                        <img src='/icons/bigRight.png' alt="Toggle form" />
                    </button>
                    <span>{!showFormBudget && !editCard ? 'Cargar presupuesto' : 'Ver presupuestos'}</span>
                </div>
            </div>
        </div>
    );
}