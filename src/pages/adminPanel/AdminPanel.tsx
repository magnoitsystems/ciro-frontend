import { useState, useEffect } from 'react';
import style from './AdminPanel.module.css';
import WelcomeText from "../../components/WelcomeText/welcomeText.tsx";
import MiniInput from "../../components/Forms/NewProvForm/MiniInput.tsx";
import GreenFormButton from "../../components/Buttons/GreenFormButton/greenFormButton.tsx";
import { userService } from '../../services/user.service';
import type { UserResponseDTO, UserCreateDTO } from '../../types/users.types';

const PALETA_COLORES = [
    '#9b51e0', '#bb6bd9', '#f2994a', '#f2c94c', 
    '#27ae60', '#2d9cdb', '#2f80ed', '#eb5757',
    '#e2b93b', '#828282', '#4f4f4f', '#333333',
    '#34a853', '#ea4335', '#4285f4', '#FBBC05',
    '#FF6F61', '#6B5B95', '#88B04B', '#FF7F50'
];

const isAdmin = (): boolean => {
    const role = localStorage.getItem('userRole');
    return role === 'ADMIN'; 
};

export default function AdminPanel() {
    const [users, setUsers] = useState<UserResponseDTO[]>([]);
    const [isCreating, setIsCreating] = useState(false);
    const [userToDelete, setUserToDelete] = useState<number | null>(null);

    const [newUser, setNewUser] = useState<UserCreateDTO>({
        name: '',
        lastname: '',
        username: '',
        password: '',
        color: ''
    });

    const [errors, setErrors] = useState(false);

    useEffect(() => {
        if (isAdmin()) {
            loadUsers();
        }
    }, []);

    const loadUsers = async () => {
        try {
            const data = await userService.getAllUsers();
            
            const currentLoggedUsername = localStorage.getItem('userName');
            
            if (currentLoggedUsername) {
                const filtered = data.filter(u => u.username !== currentLoggedUsername);
                setUsers(filtered);
            } else {
                setUsers(data); 
            }

        } catch (error) {
            console.error("Error al obtener usuarios:", error);
        }
    };

    const handleSaveUser = async () => {
        if (!newUser.name || !newUser.lastname || !newUser.username || !newUser.password || !newUser.color) {
            setErrors(true);
            return;
        }

        try {
            await userService.createUser(newUser);
            setNewUser({ name: '', lastname: '', username: '', password: '', color: '' });
            setIsCreating(false);
            setErrors(false);
            loadUsers();
        } catch (error) {
            console.error("Error al crear usuario:", error);
        }
    };

    const confirmDelete = async () => {
        if (userToDelete === null) return;
        try {
            await userService.deleteUser(userToDelete);
            loadUsers();
        } catch (error) {
            console.error("Error al eliminar:", error);
        } finally {
            setUserToDelete(null); 
        }
    };

    const handleToggleRole = async (id: number) => {
        try {
            await userService.toggleUserRole(id);
            loadUsers();
        } catch (error) {
            console.error("Error al cambiar el rol:", error);
        }
    };

    if (!isAdmin()) {
        return (
            <main className={style.main}>
                <div className={style.unauthorized}>
                    <h2>Acceso Denegado</h2>
                    <p>No tienes permisos de administrador para ver esta sección.</p>
                </div>
            </main>
        );
    }

    const coloresUsados = users.map(u => u.color.toLowerCase());

    return (
        <main className={style.main}>
            <div className={style.headerContainer}>
                <WelcomeText
                    sectionText={'Panel de Administración - Usuarios'}
                    className={'darkStyle'}
                />
                
                <div className={style.addBtn} onClick={() => setIsCreating(true)} title="Crear Usuario">
                    <img src="/icons/bigPlus.png" alt="Crear Usuario" />
                </div>
            </div>

            <div className={style.usersContainer}>
                <div className={style.columnNames}>
                    <p>Nombre completo</p>
                    <p>Usuario</p>
                    <p>Rol</p>
                    <p>Color</p>
                    <p style={{ textAlign: 'center' }}>Acciones</p>
                </div>

                {users.length > 0 ? (
                    users.map((user) => (
                        <div key={user.id} className={style.userRow}>
                            <h6>{user.name} {user.lastname}</h6>
                            <h6>{user.username}</h6>
                            <h6 className={user.role === 'ADMIN' ? style.roleAdmin : style.roleUser}>
                                {user.role}
                            </h6>
                            <div className={style.colorBadge} style={{ backgroundColor: user.color }}></div>
                            
                            <div className={style.actions}>
                                <button 
                                    className={style.actionBtn} 
                                    onClick={() => handleToggleRole(user.id)}
                                    title="Cambiar Rol"
                                >
                                    <img src="/icons/supervisorAccount.png" alt="Toggle Role" className={style.icon} />
                                </button>
                                <button 
                                    className={style.actionBtn} 
                                    onClick={() => setUserToDelete(user.id)}
                                    title="Eliminar Usuario"
                                >
                                    <img src="/icons/trash.png" alt="Eliminar" className={style.icon} />
                                </button>
                            </div>
                        </div>
                    ))
                ) : (
                    <p style={{ textAlign: "center", marginTop: "2rem", color: "var(--neutral-4)" }}>
                        Cargando usuarios...
                    </p>
                )}
            </div>

            {isCreating && (
                <div className={style.modalOverlay} onClick={() => setIsCreating(false)}>
                    <div className={style.createFormCard} onClick={(e) => e.stopPropagation()}>
                        
                        <div className={style.cardHeader}>
                            <h2>Crear un nuevo usuario</h2>
                            <span className={style.closeForm} onClick={() => setIsCreating(false)}>×</span>
                        </div>
                        
                        <div className={style.formBody}>
                            <div className={style.inputGroupRow}>
                                <MiniInput
                                    placeholder="Nombre"
                                    className="inputBoxDefault"
                                    value={newUser.name}
                                    onChange={(e) => setNewUser({...newUser, name: e.target.value})}
                                    error={errors && !newUser.name}
                                />
                                <MiniInput
                                    placeholder="Apellido"
                                    className="inputBoxDefault"
                                    value={newUser.lastname}
                                    onChange={(e) => setNewUser({...newUser, lastname: e.target.value})}
                                    error={errors && !newUser.lastname}
                                />
                            </div>

                            <div className={style.inputGroupRow}>
                                <MiniInput
                                    placeholder="Usuario"
                                    className="inputBoxDefault"
                                    value={newUser.username}
                                    onChange={(e) => setNewUser({...newUser, username: e.target.value})}
                                    error={errors && !newUser.username}
                                />
                                <MiniInput
                                    placeholder="Contraseña"
                                    type="password"
                                    className="inputBoxDefault"
                                    value={newUser.password}
                                    onChange={(e) => setNewUser({...newUser, password: e.target.value})}
                                    error={errors && !newUser.password}
                                />
                            </div>

                            <div className={style.colorSection}>
                                <p>Seleccioná tu color hexadecimal</p>
                                <div className={style.colorGrid}>
                                    {PALETA_COLORES.map(hex => {
                                        const isUsed = coloresUsados.includes(hex.toLowerCase());
                                        const isSelected = newUser.color === hex;
                                        
                                        return (
                                            <div 
                                                key={hex} 
                                                className={`${style.colorCircle} ${isUsed ? style.colorUsed : ''} ${isSelected ? style.colorSelected : ''}`}
                                                style={{ backgroundColor: hex }}
                                                onClick={() => !isUsed && setNewUser({...newUser, color: hex})}
                                                title={isUsed ? "Color no disponible" : `Hex: ${hex}`}
                                            >
                                                {isUsed && <span className={style.cross}>×</span>}
                                                {isSelected && <span className={style.check}>✓</span>}
                                            </div>
                                        )
                                    })}
                                </div>
                                {errors && !newUser.color && <span className={style.errorText}>Debes elegir un color hexadecimal.</span>}
                            </div>
                        </div>

                        <div className={style.cardFooter}>
                            <GreenFormButton 
                                text={'Crear usuario'}
                                onClick={handleSaveUser}
                            />
                        </div>
                    </div>
                </div>
            )}

            {userToDelete !== null && (
                <div className={style.modalOverlay}>
                    <div className={style.modalContent}>
                        <p>¿Estás seguro que querés eliminar este usuario?</p>
                        <div className={style.modalButtons}>
                            <button 
                                className={style.cancelBtn} 
                                onClick={() => setUserToDelete(null)}
                            >
                                Cancelar
                            </button>
                            <button 
                                className={style.confirmDeleteBtn} 
                                onClick={confirmDelete}
                            >
                                Eliminar
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </main>
    );
}