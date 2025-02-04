import { useParams } from 'react-router-dom';

const Lockdetails = () => {
    const { address } = useParams();  // Access the dynamic parameter
    return (
        <Table striped bordered hover responsive>
            <thead>
                <tr>
                    <th>Token Name(Symbol)</th>
                    <th>Amount</th>
                    <th>View</th>
                </tr>
            </thead>
            <tbody>
                {chainData.map((item, index) => (
                    <tr key={index}>
                        <td>{item.tokenName}({item.tokenSymbol})</td>
                        <td>{(parseInt(item.amount) / 10 ** parseInt(item.tokenDecimals)).toString()}</td>
                        <td><Link to={`/lock/${item.token}`}>View</Link></td>
                    </tr>
                ))}
            </tbody>
        </Table>
    );
};
export default Lockdetails;