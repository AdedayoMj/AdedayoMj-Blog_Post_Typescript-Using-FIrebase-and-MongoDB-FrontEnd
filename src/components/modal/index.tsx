import React from 'react';
import { Modal, ModalHeader, ModalBody, ModalFooter, Button } from 'reactstrap';

export interface IModalProps {
    header: any;
    toggleModal: (event: React.MouseEvent<HTMLButtonElement>) => void;
    onClickOK: (event: React.MouseEvent<HTMLButtonElement>) => void;
    modal: boolean;
    cancel: string;
    activate: string;
    bodymessage: string;
}
const ModalPopUp: React.FunctionComponent<IModalProps> = (props) => {
    const { toggleModal, onClickOK, header, modal, cancel, activate, bodymessage } = props;
   
    return (
        <Modal isOpen={modal} toggle={toggleModal}>
            <ModalHeader header="Logout" className=" text-white" style={{ backgroundColor: '#222454' }}>
                {header}
                Logout
            </ModalHeader>
            <ModalBody>
                <p className="text-center">{bodymessage}</p>
            </ModalBody>
            <ModalFooter>
                <div className="text-center">
                    <Button color="danger" className="mr-2" onClick={toggleModal}>
                        {cancel}
                    </Button>
                    <Button style={{ backgroundColor: '#222454', color: 'white' }} className="mr-2" onClick={onClickOK}>
                        {activate}
                    </Button>
                </div>
            </ModalFooter>
        </Modal>
    );
};

export default ModalPopUp;
