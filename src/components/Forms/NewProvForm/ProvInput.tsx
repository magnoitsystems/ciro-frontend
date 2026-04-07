import style from './NewProvForm.module.css';

type Props = {
    placeholder: string;
    type?: string;
    className: string;
    value?: string;
    onChange?: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => void;
    as?: "input" | "select";
    options?: { value: string; label: string }[];
}

export default function ProvInput({
                                      placeholder,
                                      type = "text",
                                      className,
                                      value,
                                      onChange,
                                      as = "input",
                                      options = []
                                  }: Props) {
    return (
        <main className={style.holeInput}>
            <h6>{placeholder}</h6>

            {as === "input" ? (
                <input
                    placeholder={placeholder}
                    type={type}
                    className={style[className]}
                    value={value || ""}
                    onChange={onChange}
                />
            ) : (
                <select
                    className={style[className]}
                    value={value || ""}
                    onChange={onChange}
                >
                    <option value="" disabled>
                        Seleccionar...
                    </option>

                    {options.map((opt, i) => (
                        <option key={i} value={opt.value}>
                            {opt.label}
                        </option>
                    ))}
                </select>
            )}
        </main>
    )
}