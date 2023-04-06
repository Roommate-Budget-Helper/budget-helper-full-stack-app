import React from 'react';

export interface ModalProps {
    show: boolean;
    onHide?: () => void;
    onConfirm?: () => void;
}

export type ModalType = React.FC<React.PropsWithChildren<ModalProps>>;

interface ModalSubComponents{
    Header: typeof ModalHeader;
    Body: typeof ModalBody;
    Footer: typeof ModalFooter;
};

const Modal: ModalType & ModalSubComponents =(props: React.PropsWithChildren<ModalProps>) => {
    if(!props.show) return <></>;

    return (<>
    <div style={{
            zIndex: 300,
        }}
        tabIndex={-1} 
        className="fixed top-28 left-0 w-full h-full bg-black bg-opacity-60 flex justify-center items-center"
    >
            <div className="relative w-full max-w-md h-full">
                {/* <!-- Modal content --> */}
                <div className="relative bg-white rounded-lg shadow dark:bg-gray-700">
                    {props.children}
                </div>
            </div>
        </div>
        </>)
}


interface ModalHeaderProps {
    onHide?: () => void;
}
type ModalHeaderType = React.FC<ModalHeaderProps & { children?: React.ReactNode | string}>;

export const ModalHeader: ModalHeaderType = (props: React.PropsWithChildren<ModalHeaderProps>) => {
    return (
        <div className="flex items-center justify-between p-4 border-b rounded-t">
            <h3 className="text-lg font-semibold text-gray-900">
                {props.children}
            </h3>
            <button onClick={props.onHide} type="button" className="text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg p-2 inline-flex items-center">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd"></path></svg>
                <span className="sr-only">Close modal</span>
            </button>
        </div>);
}




export const ModalBody: React.FC<{ children?: React.ReactNode | string}> = (props) => {
    return (
        <div className="p-4 sm:p-6">        
            <p className="text-base leading-relaxed text-gray-500">
                {props.children}
            </p>
        </div>
    );
}


export const ModalFooter = (props: React.PropsWithChildren) => {
    return (
    <div className="flex items-center p-4 sm:p-6 border-t">
        {props.children}           
    </div>
    );
}

Modal.Header = ModalHeader;
Modal.Body = ModalBody;
Modal.Footer = ModalFooter;

export default Modal;
