import style from './NewProvForm.module.css';

type Props = {
    placeholder: string;
    type?: string;
    className: string;
    value?: string;
    onChange?: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => void;
    as?: "input" | "select" | "textarea";
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
            ) : as === "textarea" ? (
                <textarea
                    placeholder={placeholder}
                    className={style[className]}
                    value={value || ""}
                    onChange={onChange}
                    rows={4}
                    style={{ resize: "none", padding: "10px", borderRadius: "8px", backgroundColor: "var(--blue-2)", color: "var(--neutral-1)", border: "none", width: "100%" }}
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