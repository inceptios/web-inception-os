import type { FC, InputHTMLAttributes } from "react";

type InputProps = InputHTMLAttributes<HTMLInputElement> &{
    value:string,
    onValueChange:(val:string)=>void,
}

const Input:FC<InputProps> = ({value,onValueChange,...props})=>{
    return(
        <input
        value={value}
        onChange={(e)=>{
            onValueChange(e.target.value)
        }}
        {...props}
        />
    )
}

export default Input;