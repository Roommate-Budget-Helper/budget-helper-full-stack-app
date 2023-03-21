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
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 p-4 overflow-x-hidden overflow-y-auto md:inset-0 h-modal md:h-full"
    >
            <div className="relative w-full h-full max-w-2xl md:h-auto">
                {/* <!-- Modal content --> */}
                <div className="relative bg-white rounded-lg shadow dark:bg-gray-700">
                    {props.children}
                </div>
            </div>
        </div>
        <div style={{
            zIndex: 200,
            }} 
            className='absolute inset-0 bg-black bg-opacity-60'></div>
        </>)
}


interface ModalHeaderProps {
    onHide?: () => void;
}
type ModalHeaderType = React.FC<ModalHeaderProps & { children?: React.ReactNode | string}>;

export const ModalHeader: ModalHeaderType = (props: React.PropsWithChildren<ModalHeaderProps>) => {
    return (
        <div className="flex items-start justify-between p-4 border-b rounded-t dark:border-gray-600">
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
                {props.children}
            </h3>
            <button onClick={props.onHide} type="button" className="text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm p-1.5 ml-auto inline-flex items-center dark:hover:bg-gray-600 dark:hover:text-white">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd"></path></svg>
                <span className="sr-only">Close modal</span>
            </button>
        </div>);
}




export const ModalBody: React.FC<{ children?: React.ReactNode | string}> = (props) => {
    return (
        <div className="p-6 space-y-6">        
            <p className="text-base leading-relaxed text-gray-500 dark:text-gray-400">
                {props.children}
            </p>
        </div>
    );
}


export const ModalFooter = (props: React.PropsWithChildren) => {
    return (
    <div className="flex items-center p-6 space-x-2 border-t border-gray-200 rounded-b dark:border-gray-600">
        {props.children}           
    </div>
    );
}

Modal.Header = ModalHeader;
Modal.Body = ModalBody;
Modal.Footer = ModalFooter;

export default Modal;