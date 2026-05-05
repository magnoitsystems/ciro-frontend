import type { ShiftResponseDTO } from "../../types/clinical.types"

type Prop = {
    shifts: ShiftResponseDTO[]
}

export default function Shift({ shifts }: Prop) {
    return (
        <div>
            <Shift shifts={shifts} />
        </div>
    )
}