import style from './NewProvForm.module.css';

type Props = {
    placeholder: string;
    type?: string;
    className: string;
    value?: string;
    onChange?: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => void;
    as?: "input" | "select";
    options?: { value: string; label: string }[];
    error?: boolean;
}

export default function MiniInput({
                                      placeholder,
                                      type = "text",
                                      className,
                                      value,
                                      onChange,
                                      as = "input",
                                      options = [],
                                      error = false
                                  }: Props) {
    return (
        <main className={style.holeMiniInput}>
            <h6>{placeholder}</h6>

            {as === "input" ? (
                <input
                    placeholder={placeholder}
                    type={type}
                    value={value}
                    onChange={onChange}
                    className={`${style[className]} ${error ? style.error : ""}`}
                />
            ) : (
                <select
                    value={value}
                    onChange={onChange}
                    className={`${style[className]} ${error ? style.error : ""}`}
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
    );
}