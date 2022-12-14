import React from 'react';

interface FieldInputProps {
    value: string;
    name: string;
    placeholder: string;
    type: React.HTMLInputTypeAttribute;
    onChange: React.ChangeEventHandler<HTMLInputElement>
}

const FieldInput: React.FC<Partial<FieldInputProps>> = (props) => {
    return (
    <input 
        name={props.name}
        className="bg-evergreen-60 w-96 my-4 text-xl py-2 px-4 rounded-lg" 
        type={props.type} value={props.value} 
        onChange={props.onChange}
        placeholder={props.placeholder}/>);
};

export default FieldInput;