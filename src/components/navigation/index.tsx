import React, { useContext, useState } from 'react';
import { Link } from 'react-router-dom';
import { Button, ButtonDropdown, Container, DropdownItem, DropdownMenu, DropdownToggle, Nav, Navbar, NavbarBrand, NavbarText } from 'reactstrap';
import { auth } from '../../config/firebase';
import UserContext from '../../context/user';
import ModalPopUp from '../modal';

export interface INavigationProps {}

const Naviagtion: React.FunctionComponent<INavigationProps> = (props) => {
    const userContext = useContext(UserContext);
    const { user } = userContext.userState;
    const [dropdownOpen, setOpen] = useState(false);
    const [modal, setModal] = useState(false);

    const toggle = () => setOpen(!dropdownOpen);

    const toggleModal = () => setModal(!modal);

    const Logout = () => {
        userContext.userDispatch({ type: 'logout', payload: userContext.userState });
        toggleModal();
    };

    return (
        <Navbar color="light;" sticky="top" expand="md" style={{ backgroundColor: '#222454', color: 'white' }}>
            <Container>
                <NavbarBrand tag={Link} to="/">
                    AdeBlog
                </NavbarBrand>
                <Nav className="mr-auto" navbar />
                <Nav className="mr-auto" navbar></Nav>
                {user._id !== '' ? (
                    <div>
                        <Button outline size="sm" tag={Link} to="/edit">
                            <i className="far fa-sticky-note mr-2"></i>
                            Post a Blog
                        </Button>
                        <NavbarText className="ml-2 mr-2">|</NavbarText> 
                         <Button outline size="sm" tag={Link} to ='/'>
                            Home
                        </Button>

                        <ModalPopUp cancel="Cancel" activate="Logout" header="Logout" modal={modal} bodymessage="Are you sure you want to logout?" onClickOK={Logout} toggleModal={toggleModal} />
                        

                        <ButtonDropdown className="ml-3 mr-3" isOpen={dropdownOpen} toggle={toggle}>
                            <DropdownToggle className="ml-2 mr-2">
                                <i className="fas fa-user-circle fa-lg"></i>
                            </DropdownToggle>
                            <DropdownMenu>
                                <DropdownItem tag={Link} to="/">
                                    Account
                                </DropdownItem>
                                {auth.currentUser?.providerData[0]?.providerId === 'password' ? (
                                    <DropdownItem tag={Link} to="/change">
                                        Change Password
                                    </DropdownItem>
                                ) : (
                                    ''
                                )}
                                <DropdownItem divider />
                                <DropdownItem style={{ color: 'red' }} onClick={toggleModal}>
                                    Logout
                                </DropdownItem>
                            </DropdownMenu>
                        </ButtonDropdown>
                        <NavbarText className="ml-2 mr-2"></NavbarText>
                    </div>
                ) : (
                    <div>
                        <NavbarText tag={Link} to="/login">
                            Login
                        </NavbarText>
                        <NavbarText className="ml-2 mr-2">|</NavbarText>
                        <NavbarText tag={Link} to="/register">
                            Signup
                        </NavbarText>
                    </div>
                )}
            </Container>
        </Navbar>
    );
};

export default Naviagtion;
