import stethoschopeImage from '../../../assets/images/svg/stethoscope.svg';
import { Card, CardBody, Image } from '@chakra-ui/react';
import './stethoscope.styles.css';
export default function Stethoscope() {
  return (
    <Card variant='edu_card' className='stethoscope'>
      <CardBody>
        <Image src={stethoschopeImage}></Image>
      </CardBody>
    </Card>
  );
}
