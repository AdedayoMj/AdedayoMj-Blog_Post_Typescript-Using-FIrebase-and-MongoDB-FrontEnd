import React from 'react';
import { Card, CardBody, CardHeader, Col, Container, Row } from 'reactstrap';

export interface ICenterPieceProps {
    header:any
}

const CenterPiece: React.FunctionComponent<ICenterPieceProps> = props => {
    const { children,header } = props;

    return (

        <Container>
            <Row>
                <Col 
                    xs={{ size: 10, offset: 1 }} 
                    sm={{ size: 8, offset: 2 }} 
                    md={{ size: 6, offset: 3 }} 
                    lg={{ size: 4, offset: 4 }}
                >
                    <Card className='mt-5' bg='primary'>
                        <CardHeader className=" text-white" style={{backgroundColor:'#222454'}}>
                            {header}
                        </CardHeader>
                        <CardBody>
                            {children}
                        </CardBody>
                    </Card>
                </Col>
            </Row>
        </Container>
    );
}


        // <Container fluid className="p-0" >
        //     <Container 
        //         style={{
        //             position: 'absolute',
        //             left: '50%',
        //             top: '50%',
        //             transform: 'translate(-50%, -50%)',
        //             WebkitTransform: 'translate(-50%, -50%)'
        //         }}
        //         className="d-flex justify-content-center"
        //     >
        //         {children}
        //     </Container>
        // </Container>


export default CenterPiece;