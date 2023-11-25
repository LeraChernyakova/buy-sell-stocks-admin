import React from 'react';
import {
    Table,
    TableContainer,
    TableHead,
    TableRow,
    TableCell,
    TableBody,
    Paper,
    Input,
    Button,
} from '@mui/material';

const BrokersTable = ({ brokers, deleteBroker, updateBalance }) => {
    return (
        <TableContainer component={Paper}>
            <Table>
                <TableHead>
                    <TableRow>
                        <TableCell>Имя</TableCell>
                        <TableCell>Денежная сумма</TableCell>
                        <TableCell>Удалить</TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {brokers.map((broker) => (
                        <TableRow key={broker.id}>
                            <TableCell>{broker.name}</TableCell>
                            <TableCell>
                                <Input
                                    type="number"
                                    value={broker.balance}
                                    onChange={(e) => updateBalance(broker.id, parseFloat(e.target.value))}
                                    inputProps={{ style: { textAlign: 'center' } }}
                                    className={broker.validationError && broker.validationError.balance ? 'error' : ''}
                                />
                                {broker.validationError && broker.validationError.balance && (
                                    <div style={{ color: 'red' }}>{broker.validationError.balance}</div>
                                )}
                            </TableCell>
                            <TableCell>
                                <Button variant="contained" color="error" onClick={() => deleteBroker(broker.id)}>
                                    Удалить
                                </Button>
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </TableContainer>
    );
};

export default BrokersTable;
