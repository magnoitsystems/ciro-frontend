import { authService } from "../../services/auth.service";
import { useState } from "react";
import type { LoginRequestDTO } from "../../types/auth.types";
import styles from './login.module.css'
import { useNavigate } from "react-router-dom";

type Prop = {
    onLogin: () => void
}

export default function Login({onLogin} : Prop) {
    const navigate = useNavigate()
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');

    const handleSumbit = async (e: React.FormEvent) => {
        e.preventDefault();
        const login: LoginRequestDTO = {
            username,
            password
        }

        try {
            let response;
            console.log("Entro al try");

            console.log("Voy a logearme la task");
            response = await authService.login(login);
            onLogin()
            navigate('/Panel')
            console.log("Logueado")

        } catch (error: any) {
            console.error(error);
        }
    }
    return (
        <div className={styles.containerProperties}>
            <div className={styles.firstContainerProperties}>
                <div className={styles.formContainerProperties}>
                    <form className={styles.formProperties} onSubmit={handleSumbit}>
                        <div className={styles.labelAndInputProperties}>
                            <div className={styles.labelContainerProperties}>
                                <label>Usuario *</label>
                            </div>
                            <input value={username} onChange={(e) => setUsername(e.target.value)} type="text" placeholder="Nombre de usuario" />
                        </div>
                        <div className={styles.labelAndInputProperties}>
                            <div className={styles.labelContainerProperties}>
                                <label>Contraseña *</label>
                            </div>
                            <input value={password} onChange={(e) => setPassword(e.target.value)} type="password" placeholder="Contraseña" />
                        </div>
                        <div className={styles.buttonProperties}>
                            <button>Iniciar sesión</button>
                        </div>
                    </form>
                </div>
                <div className={styles.imageProperties}>
                    <img src="/logo/whiteLogo.png" width={370} height={150}></img>
                </div>
            </div>
        </div>
    )
}