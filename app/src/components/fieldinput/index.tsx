import { CloseCircleFilled, EyeFilled, EyeInvisibleFilled } from '@ant-design/icons';
import React, { useState } from 'react';

export interface FieldInputProps {
    value: string;
    defaultValue: string;
    name: string;
    placeholder: string;
    type: React.HTMLInputTypeAttribute;
    onChange: React.ChangeEventHandler<HTMLInputElement>;
    max: string;
    min: string;
}
export type FieldInputType = React.FC<Partial<FieldInputProps>>

const FieldInput= (props: Partial<FieldInputProps>) => {
    return (
    <input
        name={props.name}
        className="bg-evergreen-60 w-88 my-4 text-xl py-2 px-4 rounded-lg" 
        type={props.type} 
        value={props.value}
        defaultValue={props.defaultValue} 
        onChange={props.onChange}
        placeholder={props.placeholder}/>);
};

export interface FieldInputGadgetProperties {
    location: "right" | "left";
}


export const VisibilityFieldInput = (props: Partial<FieldInputProps>) => {
        const [visible, setVisibility] = useState<boolean>(false);
        const currentVisibility = visible ? "text" : "password";
        const toggleVisibility = () => {
            setVisibility(visibility => !visibility);
        }
        return (
        <div className="relative flex items-center">
            <FieldInput 
                {...props} 
                type={currentVisibility} />
            <div className="absolute right-2 text-evergreen-100">
                <div onClick={toggleVisibility}>
                    {visible ? <EyeInvisibleFilled /> : <EyeFilled />}
                </div>
            </div>
        </div>);
    };

    export const ClearableFieldInput = (props: Partial<FieldInputProps>) => {
        const [value, setValue] = useState("");

        return (
        <div className="relative flex items-center">
            <FieldInput 
                {...props} 
                value={value}
                onChange={e => setValue(e.currentTarget.value)}  />
                <div className="absolute right-2">
                {value&&<div className="text-evergreen-100" onClick={() => {
                    setValue("");
                }}>
                    <CloseCircleFilled />
                </div>}
            </div>
        </div>);
    };

    export const MoneyFieldInput = (props: Partial<FieldInputProps>) => {
        return (
            <input 
                {...props}
                className="bg-evergreen-60 w-88 my-4 text-xl py-2 px-4 rounded-lg" 
                type="number"
                min="0"
                step="0.01"
                />
        )
    };

    export const DateFieldInput = (props: Partial<FieldInputProps>) => {
        return (
            <input
                {...props}
                className="bg-evergreen-60 text-gray-400 w-88 my-4 text-xl py-2 px-4 rounded-lg"
                type="date"
                placeholder=""
                min={new Date().toISOString().split("T")[0]}
            />
        );
    };

    export const ImageFileFieldInput = ( props: { title: string, fileRef: React.RefObject<HTMLInputElement> } ) => {
        const [imageName, setImageName] = useState<string | null>(null);
        return (
            <div className="w-88 pb-2 pt-1 rounded-lg shadow-xl bg-gray-50">
                <div className="m-4">
                    <label className="inline-block mb-2 text-gray-400">
                        {props.title}
                    </label>
                    <div className="flex items-center justify-center w-full border-dashed border-4 border-evergreen-60 hover:bg-gray-100 hover:border-gray-400">
                        <label className="flex flex-col w-full h-32">
                            <div className="flex flex-col items-center justify-center pt-7">
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    className="w-8 h-8 text-gray-400 group-hover:text-gray-600"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                    stroke="currentColor"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth="2"
                                        d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
                                    />
                                </svg>
                                <p className="pt-1 text-sm tracking-wider text-gray-400 group-hover:text-gray-600">
                                    Attach a file
                                </p>
                            </div>
                            <input
                                type="file"
                                className="opacity-0"
                                ref={props.fileRef}
                                name="image"
                                accept=".png, .jpg"
                                onChange={(e) => {
                                    const file = e.target.files?.[0];
                                    if (file) {
                                        setImageName(file.name);
                                    } else {
                                        setImageName(null);
                                    }
                                }}
                            />
                        </label>
                    </div>
                </div>
                {imageName && <div className="text-gray-400">{imageName}</div>}
            </div>
        );
    };


export default FieldInput;