import { useParams } from 'react-router-dom';

export default function PerformCase(props) {

    let { caseid } = useParams()

    return (
        <>
            <p>CASE {caseid}</p>
        </>
        
    );
}