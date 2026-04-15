import { useState } from 'react';
import style from './Procedimiento.module.css';
import type { TariffResponseDTO, TariffUpdateDTO } from '../../types/tariffs.types';

interface Props {
    tariff: TariffResponseDTO;
    onDelete: (id: number) => void;
    onUpdate: (id: number, data: TariffUpdateDTO) => Promise<void>;
}

export default function Procedimiento({ tariff, onDelete, onUpdate }: Props) {
    const [isEditing, setIsEditing] = useState(false);
    
    const [editForm, setEditForm] = useState({
        name: tariff.name,
        tariffDate: tariff.tariffDate || "",
        amountPesos: tariff.amountPesos?.toString() || "",
        amountDollars: tariff.amountDollars?.toString() || "",
        tc: tariff.tc?.toString() || ""
    });

    const handleSave = async () => {
        const data: TariffUpdateDTO = {
            name: editForm.name,
            tariffDate: editForm.tariffDate ? editForm.tariffDate : undefined,
            amountPesos: editForm.amountPesos ? Number(editForm.amountPesos) : undefined,
            amountDollars: editForm.amountDollars ? Number(editForm.amountDollars) : undefined,
            tc: editForm.tc ? Number(editForm.tc) : undefined
        };
        await onUpdate(tariff.id, data);
        setIsEditing(false);
    };

    const handleCancel = () => {
        setIsEditing(false);
        setEditForm({
            name: tariff.name,
            tariffDate: tariff.tariffDate || "",
            amountPesos: tariff.amountPesos?.toString() || "",
            amountDollars: tariff.amountDollars?.toString() || "",
            tc: tariff.tc?.toString() || ""
        });
    };

    return (
        <main className={style.main}>
            {isEditing ? (
                <>
                    <input 
                        type="date" 
                        value={editForm.tariffDate} 
                        onChange={(e) => setEditForm({...editForm, tariffDate: e.target.value})} 
                        className={style.editInput}
                    />
                    <input 
                        type="text" 
                        value={editForm.name} 
                        onChange={(e) => setEditForm({...editForm, name: e.target.value})} 
                        className={style.editInput}
                    />
                    <input 
                        type="number" 
                        value={editForm.amountDollars} 
                        onChange={(e) => setEditForm({...editForm, amountDollars: e.target.value})} 
                        className={style.editInput}
                    />
                    <input 
                        type="number" 
                        value={editForm.amountPesos} 
                        onChange={(e) => setEditForm({...editForm, amountPesos: e.target.value})} 
                        className={style.editInput}
                    />
                    <input 
                        type="number" 
                        value={editForm.tc} 
                        onChange={(e) => setEditForm({...editForm, tc: e.target.value})} 
                        className={style.editInput}
                    />
                    
                    <div className={style.actions}>
                        <img 
                            src="/icons/saveIcon.png" 
                            alt="Guardar" 
                            onClick={handleSave} 
                            className={style.icon}
                            style={{ transform: "scale(2)" }} 
                        />
                        <img 
                            src="/icons/cancelIcon.png" 
                            alt="Cancelar" 
                            onClick={handleCancel} 
                            className={style.icon}
                        />
                    </div>
                </>
            ) : (
                <>
                    <h6>{tariff.tariffDate || '-'}</h6>
                    <h6>{tariff.name}</h6>
                    <h6>{tariff.amountDollars ? `$${tariff.amountDollars}` : '-'}</h6>
                    <h6>{tariff.amountPesos ? `$${tariff.amountPesos}` : '-'}</h6>
                    <h6>{tariff.tc || '-'}</h6>
                    
                    <div className={style.actions}>
                        <img 
                            src="/icons/editGrey.png" 
                            alt="Editar" 
                            onClick={() => setIsEditing(true)} 
                            className={style.icon}
                        />
                        <img 
                            src="/icons/trash.png" 
                            alt="Eliminar" 
                            onClick={() => onDelete(tariff.id)} 
                            className={style.icon}
                        />
                    </div>
                </>
            )}
        </main>
    )
}